export interface Card {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

export enum CardCategory {
  FIRST = "first",
  SECOND = "second",
  THIRD = "third",
  FOURTH = "fourth",
  FIFTH = "fifth",
  SIXTH = "sixth",
  SEVENTH = "seventh",
  DONE = "done",
}

export interface CardWithCategory extends Card {
  category: CardCategory;
}
