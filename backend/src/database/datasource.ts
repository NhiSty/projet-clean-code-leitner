import { container } from "../utils/ioc.js";
import { MikroORM, EntityManager } from "@mikro-orm/core";
import mikroOrmConfig from "../mikro-orm.config.js";

/**
 * AppDataSource is a singleton instance of the MikroORM DataSource.
 * It is used to connect to the database and to create repositories.
 */
container.singleton(MikroORM, async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  return orm;
});

container.bind(EntityManager, async () => {
  const orm = await container.make(MikroORM);
  return orm.em.fork();
});
