import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import { EntityManager } from "@mikro-orm/postgresql";
import { Card } from "../database/models/card.model.js";
import { DbID } from "../utils/types.js";

@inject()
export class QuizzService {
  public constructor(
    private dateService: AbstractDateService,
    private em: EntityManager
  ) {}

  public async retrieveQuizz(date: Date): Card[] {
    throw new Error("Not implemented");
  }

  public async answerCard(id: DbID, valid: boolean): Card | null {
    throw new Error("Not implemented");
  }
}
