import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";
import { isSameDay } from "date-fns";

/**
 * This service handle all date-related operations.
 */
@inject()
export default class DateService implements AbstractDateService {
  /**
   * @see {@link AbstractDateService.getToday}
   */
  public getToday(): Date {
    return new Date();
  }

  /**
   * @see {@link AbstractDateService.isToday}
   */
  public isToday(date: Date): boolean {
    return isSameDay(date, this.getToday());
  }
}
