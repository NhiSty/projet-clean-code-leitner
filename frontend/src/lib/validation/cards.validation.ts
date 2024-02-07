import * as yup from "yup";

export const tagSearchSchema = yup
  .object({
    tag: yup.string(),
  })
  .required();
