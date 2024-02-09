import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "../../src/services/interfaces/date.interface.js";
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

  /**
   * This method is only used for testing purposes. It allows us to set the
   * date returned by the service. This way, we can have some predictable
   * time traveling in our tests.
   *
   * @param date - The date to set
   */
  public setToday(date: Date): void {
    this._date = date;
  }
}
