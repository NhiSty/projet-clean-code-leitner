import vine from "@vinejs/vine";

const cardIdParamSchema = vine.object({
  cardId: vine.string().uuid({ version: [4] }),
});
/**
 * Check if the params contains the card id parameter
 */
export const cardIdParamValidator = vine.compile(cardIdParamSchema);

const answerCardBodyScema = vine.object({
  valid: vine.boolean(),
});
/**
 * Check if the request body contains the `valid` field
 */
export const answerCardBodyValidator = vine.compile(answerCardBodyScema);

const getQuizSchema = vine.object({
  date: vine.date({ formats: ["YYYY-MM-DD"] }).optional(),
});
/**
 * Check if the request body contains the `date` field
 */
export const getQuizValidator = vine.compile(getQuizSchema);
