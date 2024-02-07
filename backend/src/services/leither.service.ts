import { inject } from "@adonisjs/fold";
import { CardCategory } from "../database/models/cardCategory.enum.js";
import { addDays } from "date-fns";

/**
 * This service will handle the computation operations for the date using
 * the Leither system
 */
@inject()
export class LeitherSystem {
  /**
   * Returns the next date based on the given date and card category.
   * @param {Date} date - The current date.
   * @param {CardCategory} category - The card category.
   * @returns {Date | null} The next date or null if the category is invalid.
   */
  public getNextDate(date: Date, category: CardCategory): Date | null {
    const dayIncrement = this.getDays(category);
    if (dayIncrement === 0) {
      return null;
    }

    return addDays(date, this.getDays(category));
  }

  /**
   * Returns the number of days based on the given card category.
   * @param {CardCategory} category - The card category.
   * @returns {Number} The number of days
   */
  public getDays(category: CardCategory): number {
    switch (category) {
      case CardCategory.FIRST: {
        return 1;
      }
      case CardCategory.SECOND: {
        return 2;
      }
      case CardCategory.THIRD: {
        return 4;
      }
      case CardCategory.FOURTH: {
        return 8;
      }
      case CardCategory.FIFTH: {
        return 16;
      }
      case CardCategory.SIXTH: {
        return 32;
      }
      case CardCategory.SEVENTH: {
        return 64;
      }
      default: {
        return 0;
      }
    }
  }
}
