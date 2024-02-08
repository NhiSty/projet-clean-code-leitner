import { CardWithCategory } from "@/types/card";
import { fetcher } from "./fetcher";
import { format } from "date-fns";

export async function fetchQuiz(date?: Date): Promise<CardWithCategory[]> {
  if (!date) {
    return fetcher(`/api/cards/quizz`);
  }

  return fetcher(`/api/cards/quizz?date=${format(date, "yyyy-MM-dd")}`);
}
