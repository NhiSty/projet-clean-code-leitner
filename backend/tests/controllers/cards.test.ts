import { Server, createServer } from "../../src/server.js";
import {
  describe,
  test,
  beforeEach,
  beforeAll,
  afterAll,
  expect,
  afterEach,
} from "vitest";
import { container } from "../../src/utils/ioc.js";
import { MikroORM, SchemaGenerator } from "@mikro-orm/postgresql";
import { setupTestDb } from "../setup/setupDataSource.js";
import { Tag } from "../../src/database/models/tag.model.js";
import { DatabaseSeeder } from "../seed/test.seeder.js";
import { Card } from "../../src/database/models/card.model.js";

const TOTAL_CARDS_COUNT = 10;

describe("CardsController", () => {
  let server: Server;
  let orm: MikroORM;
  let generator: SchemaGenerator;

  // Create a new server before each test
  beforeAll(async () => {
    // Create a new datasource
    orm = await setupTestDb();
    generator = orm.getSchemaGenerator();

    // Swap the datasource with our own
    container.swap(MikroORM, () => orm);

    server = await createServer(3000);

    await server.initialize();
    await server.app.ready();
  });

  beforeEach(async () => {
    await generator.refreshDatabase();
    // Load seeders
    await orm.getSeeder().seed(DatabaseSeeder);

    const em = orm.em.fork();
    const cards = await em.findAll(Card);

    await server.app.ready();
  });

  afterEach(async () => {
    await generator.clearDatabase();
  });

  // Close the server when tests are finished
  afterAll(async () => {
    // Stop the server
    await server.stop();
  });

  test("GET / should return 'Hello World'", async () => {
    const res = await server.app.inject({
      method: "GET",
      url: "/",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("Hello World");
  });

  test("GET /cards should return all cards", async ({ expect }) => {
    const res = await server.app.inject({
      method: "GET",
      url: "/cards",
    });

    expect(res.statusCode).toBe(200);

    const body = await res.json();
    expect(body).toHaveLength(TOTAL_CARDS_COUNT);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /cards should return empty array if not tags are found", async ({
    expect,
  }) => {
    const res = await server.app.inject({
      method: "GET",
      url: "/cards",
      query: {
        tags: "invalid-tag",
      },
    });

    expect(res.statusCode).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(0);
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /cards should return cards filtered by specific tags", async () => {
    // Get the 2 first tags
    const em = orm.em.fork();
    const tagRepository = em.getRepository(Tag);
    const tags: Tag[] = await tagRepository.find({}, { limit: 2 });

    const names = tags.map((tag) => tag.name);

    // Get the cards that have the first tag
    const res = await server.app.inject({
      method: "GET",
      url: "/cards",
      query: {
        tags: names.join(","),
      },
    });

    expect(res.statusCode).toBe(200);
    // Check that the response contains only cards both tags
    const body = await res.json();
    expect(body.length).toBeGreaterThan(1);
    //expect(res.body.every((card: any) => names.includes(card.tag))).toBe(true);
  });

  test("POST /cards should create a new card", async ({ expect }) => {
    const em = orm.em.fork();
    const tagRepository = em.getRepository(Tag);
    const tag: Tag[] = await tagRepository.find({}, { limit: 1 });

    const card = {
      question: "What is the capital of the USA?",
      answer: "Washington DC",
      tag: tag[0].name,
    };

    const res = await server.app.inject({
      method: "POST",
      url: "/cards",
      payload: card,
    });

    expect(res.statusCode).toBe(200);
    expect(await res.json()).toMatchObject(card);
  });

  test("POST /cards should return a 400 error if the body is invalid", async () => {
    const res = await server.app.inject({
      method: "POST",
      url: "/cards",
      payload: {
        question: "",
        answer: "",
        tag: "",
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
