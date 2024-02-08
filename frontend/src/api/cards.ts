import { Card, CardWithCategory } from "@/types/card";
import { fetcher } from "./fetcher";

export async function fetchCards(tag?: string): Promise<CardWithCategory[]> {
  if (tag) {
    return fetcher(`/api/cards?tags=${tag}`);
  }

  return fetcher("/api/cards");
}

export async function createCard(card: Omit<Card, "id">): Promise<Card> {
  return fetcher("/api/cards", {
    method: "POST",
    body: JSON.stringify(card),
  });
}
