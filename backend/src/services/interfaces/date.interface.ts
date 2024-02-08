/**
 * This service handle all date-related operations.
 */
export abstract class AbstractDateService {
  /**
   * Returns the current date.
   * @returns {Date} The current date.
   */
  abstract getToday(): Date;

  /**
   * Check if the date is today or not.
   * @returns {boolean} true if the date is today
   */
  abstract isToday(date: Date): boolean;
}
