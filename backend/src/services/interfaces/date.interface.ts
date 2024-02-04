import { CardCategory } from "../../database/models/cardCategory.enum.js";

/**
 * This service handle all date-related operations.
 */
export abstract class AbstractDateService {
  /**
   * Returns the current date.
   * @returns {Date} The current date.
   */
  abstract getToday(): Promise<Date>;

  /**
   * Returns the next date based on the given date and card category.
   * @param {Date} date - The current date.
   * @param {CardCategory} category - The card category.
   * @returns {Date | null} The next date or null if the category is invalid.
   */
  abstract getNextDate(date: Date, category: CardCategory): Date | null;
}
