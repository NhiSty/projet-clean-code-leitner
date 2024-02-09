import vine from "@vinejs/vine";

/**
 * Card creation validation schema
 */
const createCard = vine.object({
  question: vine.string().minLength(1),
  answer: vine.string().minLength(1),
  tag: vine.string().minLength(1),
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
