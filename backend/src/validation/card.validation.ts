import vine from "@vinejs/vine";

const createCard = vine.object({
  question: vine.string(),
  answer: vine.string(),
  tag: vine.string(),
});
/**
 * Card creation validator function
 */
export const createCardValidator = vine.compile(createCard);

const getAllCardsParams = vine.object({
  tags: vine
    .string()
    .regex(/^\w(,\w)*/)
    .optional(),
});
/**
 * Get all cards query parameter validator function
 */
export const getAllCardsParamsValidator = vine.compile(getAllCardsParams);
