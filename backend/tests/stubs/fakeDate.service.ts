import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "../../src/services/interfaces/date.interface.js";
import { CardCategory } from "../../src/database/models/cardCategory.enum.js";

@inject()
export class FakeDateService implements AbstractDateService {
  private _date: Date;

  public constructor(date: Date) {
    this._date = date;
  }

  getToday(): Date {
    return this._date;
  }
  getNextDate(date: Date, category: CardCategory): Date | null {
    throw new Error("Method not implemented.");
  }
}
