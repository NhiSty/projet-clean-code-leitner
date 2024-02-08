import * as yup from "yup";

export const dateSelectorSchema = yup
  .object({
    date: yup.date().required(),
  })
  .required();
