import { faker } from "@faker-js/faker";

/**
 * Generates a list of words
 * @param count the number of words to generate
 * @returns a list of words
 */
export function generateWords(count: number) {
  return faker.word.words({ count }).split(" ");
}

/**
 * Generates a single word
 * @returns a single word
 */
export function generateSingleWord() {
  return faker.word.words();
}

/**
 * Generates a sentence
 * @returns a sentence
 */
export function generateSentence() {
  return faker.lorem.sentence();
}
