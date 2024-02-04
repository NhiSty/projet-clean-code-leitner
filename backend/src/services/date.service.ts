import { inject } from "@adonisjs/fold";
import { addDays } from "date-fns";
import { CardCategory } from "../database/models/cardCategory.enum.js";
import { AbstractDateService } from "./interfaces/date.interface.js";

/**
 * See {@link AbstractDateService}.
 */
@inject()
export default class DateService implements AbstractDateService {
  public async getToday(): Promise<Date> {
    return new Date();
  }

  public getNextDate(date: Date, category: CardCategory): Date | null {
    switch (category) {
      case CardCategory.FIRST: {
        return addDays(date, 1);
      }
      case CardCategory.SECOND: {
        return addDays(date, 2);
      }
      case CardCategory.THIRD: {
        return addDays(date, 4);
      }
      case CardCategory.FOURTH: {
        return addDays(date, 8);
      }
      case CardCategory.FIFTH: {
        return addDays(date, 16);
      }
      case CardCategory.SIXTH: {
        return addDays(date, 32);
      }
      case CardCategory.SEVENTH: {
        return addDays(date, 64);
      }
      default: {
        return null;
      }
    }
  }
}
