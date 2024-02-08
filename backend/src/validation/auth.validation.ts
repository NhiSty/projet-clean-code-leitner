import vine from "@vinejs/vine";

/**
 * Login object validation schema
 */
const login = vine.object({
  username: vine.string(),
  password: vine.string(),
});

/**
 * Login validator function
 */
export const loginValidator = vine.compile(login);
