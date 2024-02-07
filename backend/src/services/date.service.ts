import { inject } from "@adonisjs/fold";
import { AbstractDateService } from "./interfaces/date.interface.js";

/**
 * See {@link AbstractDateService}.
 */
@inject()
export default class DateService implements AbstractDateService {
  public getToday(): Date {
    return new Date();
  }
}
