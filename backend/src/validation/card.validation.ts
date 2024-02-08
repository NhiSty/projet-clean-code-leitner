import vine from "@vinejs/vine";

/**
 * Card creation validation schema
 */
const createCard = vine.object({
  question: vine.string(),
  answer: vine.string(),
  tag: vine.string(),
});

/**
 * Card creation validator function
 */
export const createCardValidator = vine.compile(createCard);

/**
 * Card fetch parameters validation schema
 */
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
