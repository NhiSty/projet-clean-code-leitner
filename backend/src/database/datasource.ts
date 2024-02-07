import { container } from "../utils/ioc.js";
import {
  MikroORM,
  EntityManager,
  PostgreSqlDriver,
} from "@mikro-orm/postgresql";
import mikroOrmConfig from "../mikro-orm.config.js";
import { randomUUID } from "crypto";

/**
 * AppDataSource is a singleton instance of the MikroORM DataSource.
 * It is used to connect to the database and to create repositories.
 */
container.singleton(MikroORM, async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  return orm;
});

container.bind(EntityManager<PostgreSqlDriver>, async () => {
  const orm = await container.make(MikroORM);
  // Cast the output value to `EntityManager<PostgreSqlDriver>` to avoid compiler errors.
  // Based on the documentation and API, we can assume that the output is an `EntityManager<PostgreSqlDriver>`.
  return orm.em.fork() as EntityManager<PostgreSqlDriver>;
});

export function generateUUID(): string {
  return randomUUID();
}
