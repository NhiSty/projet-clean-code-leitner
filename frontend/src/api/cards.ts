import { Card } from "@/types/card";
import { fetcher } from "./fetcher";

export async function fetchCards(tag?: string): Promise<Card[]> {
  return fetcher(`/api/cards?tag=${tag}`);
}
