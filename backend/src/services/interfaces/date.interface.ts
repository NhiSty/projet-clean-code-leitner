/**
 * This service handle all date-related operations.
 */
export abstract class AbstractDateService {
  /**
   * Returns the current date.
   * @returns {Date} The current date.
   */
  abstract getToday(): Date;
}
