import { Server, createServer } from "../../src/server.js";
import supertest from "supertest";
import {
  describe,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  expect,
} from "vitest";
import { container } from "../../src/utils/ioc.js";
import { MikroORM } from "@mikro-orm/core";
import { setupTestDb } from "../setup/setupDataSource.js";
import { Tag } from "../../src/database/models/tag.model.js";
import { Card, CardCategory } from "../../src/database/models/card.model.js";
import { DatabaseSeeder } from "../seed/test.seeder.js";
import { SchemaGenerator } from "@mikro-orm/sqlite";

const TOTAL_CARDS_COUNT = 10;

describe("CardsController", (group) => {
  let server: Server;
  let orm: MikroORM;
  let generator: SchemaGenerator;

  // Create a new server before each test
  beforeAll(async () => {
    // Create a new datasource
    orm = await setupTestDb();
    generator = orm.getSchemaGenerator() as SchemaGenerator;

    // Swap the datasource with our own
    container.swap(MikroORM, () => orm);

    server = await createServer(3000);

    await server.initialize();
    await server.app.ready();
  });

  beforeEach(async () => {
    await generator.dropSchema();
    await generator.createSchema();

    // Load seeders
    await orm.getSeeder().seed(DatabaseSeeder);
  });

  // Close the server when tests are finished
  afterAll(async () => {
    // Stop the server
    await server.stop();

    await orm.close(true);
  });

  test("GET / should return 'Hello World'", async () => {
    await supertest(server.app.server)
      .get("/")
      .expect(200)
      .expect("Hello World");
  });

  test("GET /cards should return all cards", async ({ expect }) => {
    const response = await supertest(server.app.server)
      .get("/cards")
      .expect(200);

    expect(response.body).toHaveLength(TOTAL_CARDS_COUNT);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /cards should return empty array if not tags are found", async ({
    expect,
  }) => {
    const response = await supertest(server.app.server)
      .get("/cards")
      .query({ tags: "invalid-tag" })
      .expect(200);

    console.log(response.body);
    expect(response.body).toHaveLength(0);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /cards should return cards filtered by specific tags", async () => {
    // Get the 2 first tags
    const em = orm.em.fork();
    const tagRepository = em.getRepository(Tag);
    const tags: Tag[] = await tagRepository.find({}, { limit: 2 });

    const names = tags.map((tag) => tag.name);

    // Get the cards that have the first tag
    const response = await supertest(server.app.server)
      .get("/cards")
      .query({ tags: names.join(",") })
      .expect(200);

    // Check that the response contains only cards both tags
    expect(response.body.length).toBeGreaterThan(1);
    console.log(response.body);
    expect(response.body.every((card: any) => names.includes(card.tag))).toBe(
      true
    );
  });

  test("POST /cards should create a new card", async ({ expect }) => {
    const em = orm.em.fork();
    const tagRepository = em.getRepository(Tag);
    const tag: Tag[] = await tagRepository.find({}, { limit: 1 });

    const card = {
      question: "What is the capital of the USA?",
      answer: "Washington DC",
      category: CardCategory.FIRST,
      tag: tag[0].id,
    };

    const response = await supertest(server.app.server)
      .post("/cards")
      // Set the body
      .send({
        question: "What is the capital of the USA?",
        answer: "Washington DC",
        tag: tag[0].name,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      ...card,
      tag: tag[0].name,
    });
  });

  test("POST /cards should return a 400 error if the body is invalid", async () => {
    await supertest(server.app.server)
      .post("/cards")
      // Set the body
      .send({
        question: "What is the capital of the USA?",
        answer: "Washington DC",
        tag: "invalid-tag",
      })
      .expect(400);
  });
});
