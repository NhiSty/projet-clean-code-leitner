import { MikroORM, SchemaGenerator } from "@mikro-orm/postgresql";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { Server, createServer } from "../../src/server.js";
import { container } from "../../src/utils/ioc.js";
import { setupTestDb } from "../setup/setupDataSource.js";
import { AbstractDateService } from "../../src/services/interfaces/date.interface.js";
import { FakeDateService } from "../stubs/fakeDate.service.js";
import { DatabaseSeeder } from "../seed/test.seeder.js";
import { format, subDays } from "date-fns";

describe("LearningController", () => {
  let server: Server;
  let orm: MikroORM;
  let dateService: FakeDateService;
  let generator: SchemaGenerator;
  const TODAY = new Date("2024-01-31");

  // Create a new server before each test
  beforeAll(async () => {
    // Create a new datasource
    orm = await setupTestDb();
    generator = orm.getSchemaGenerator();

    // Swap the datasource with our own
    container.swap(MikroORM, () => orm);
    // Swap the date service with our own
    dateService = new FakeDateService(TODAY);
    container.swap(AbstractDateService, () => dateService);

    server = await createServer(3000);

    await server.initialize();
    await server.app.ready();
  });

  beforeEach(async () => {
    await generator.refreshDatabase();
    // Load seeders
    await orm.getSeeder().seed(DatabaseSeeder);

    // Reset today date
    dateService.setToday(TODAY);

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

  test("GET /cards/quizz should return no quiz for yesterday", async () => {
    const yesterday = subDays(TODAY, 1);

    const res = await server.app.inject({
      method: "GET",
      url: "/cards/quizz",
      query: {
        date: format(yesterday, "yyyy-MM-dd"),
      },
    });

    expect(res.statusCode).toBe(200);

    const body = await res.json();
    expect(body).toEqual([]);
  });

  test("GET /cards/quizz should return the today quiz", async () => {
    const res = await server.app.inject({
      method: "GET",
      url: "/cards/quizz",
    });

    expect(res.statusCode).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
  });

  test("GET /cards/quizz should return the quiz for yesterday if the user generated one for yesterday", async () => {
    const yesterday = subDays(TODAY, 1);
    // Set the date to yesterday
    dateService.setToday(yesterday);
    // Generate a quiz for yesterday
    const res = await server.app.inject({
      method: "GET",
      url: "/cards/quizz",
    });

    expect(res.statusCode).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);

    // Now set the date to today
    dateService.setToday(TODAY);

    // Retrieve the quiz from yesterday
    console.log("Retrieve quiz for yesterday:", yesterday);
    const res2 = await server.app.inject({
      method: "GET",
      url: "/cards/quizz",
      query: {
        date: format(yesterday, "yyyy-MM-dd"),
      },
    });

    expect(res2.statusCode).toBe(200);
    const body2 = await res2.json();
    expect(body2.length).toBeGreaterThan(0);
    expect(body).toMatchObject(body2);
  });
});
