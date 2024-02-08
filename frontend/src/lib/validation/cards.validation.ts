import * as yup from "yup";

export const tagSearchSchema = yup
  .object({
    tag: yup.string(),
  })
  .required();

export const newCardSchema = yup
  .object({
    question: yup.string().required(),
    answer: yup.string().required(),
    tag: yup.string().required(),
  })
  .required();

export const answerQuestionSchema = yup.object({
  answer: yup.string().required(),
});
