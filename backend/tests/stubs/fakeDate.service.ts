import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "../../src/services/interfaces/date.interface.js";
import { CardCategory } from "../../src/database/models/cardCategory.enum.js";
import { isSameDay } from "date-fns";

@inject()
export class FakeDateService implements AbstractDateService {
  private _date: Date;

  public constructor(date: Date) {
    this._date = date;
  }

  public getToday(): Date {
    return this._date;
  }

  public isToday(date: Date): boolean {
    return isSameDay(date, this.getToday());
  }
}
