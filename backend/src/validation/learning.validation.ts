import vine from "@vinejs/vine";

/**
 * Card id parameter validation schema
 */
const cardIdParamSchema = vine.object({
  cardId: vine.string().uuid({ version: [4] }),
});

/**
 * Check if the params contains the card id parameter
 */
export const cardIdParamValidator = vine.compile(cardIdParamSchema);

/**
 * Card body validation schema
 */
const answerCardBodyScema = vine.object({
  isValid: vine.boolean(),
});

/**
 * Check if the request body contains the `valid` field
 */
export const answerCardBodyValidator = vine.compile(answerCardBodyScema);

/**
 * Card body validation schema
 */
const getQuizSchema = vine.object({
  date: vine.date({ formats: ["YYYY-MM-DD"] }).optional(),
});

/**
 * Check if the request body contains the `date` field
 */
export const getQuizValidator = vine.compile(getQuizSchema);
