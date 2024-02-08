import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import { isSameDay } from "date-fns";

/**
 * See {@link AbstractDateService}.
 */
@inject()
export default class DateService implements AbstractDateService {
  public getToday(): Date {
    return new Date();
  }

  public isToday(date: Date): boolean {
    return isSameDay(date, this.getToday());
  }
}
