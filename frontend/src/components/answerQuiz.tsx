import { Card as ICard } from "@/types/card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { QuestionForm } from "./questionForm";
import { useMutation } from "@tanstack/react-query";
import { answerCard } from "@/api/cards";

interface AnswerQuizProps {
  quiz: ICard[];
}

export function AnswerQuiz(props: AnswerQuizProps): JSX.Element {
  const [cards] = useState<ICard[]>(structuredClone(props.quiz));
  const [currentCard, setCurrentCard] = useState<ICard | undefined>();

  useEffect(() => {
    setCurrentCard(cards.shift());
  }, [cards]);

  const { mutate } = useMutation({
    mutationKey: ["card", currentCard?.id],
    mutationFn: (valid: boolean) => answerCard(currentCard!, valid),
  });

  const onCardAnswered = async (valid: boolean) => {
    // Update the data on the server
    if (currentCard) {
      mutate(valid);
    }

    // Update the local state
    if (cards.length === 0) {
      setCurrentCard(undefined);
      return;
    }

    setCurrentCard(cards.shift());
  };

  if (props.quiz.length === 0) {
    return (
      <Card className="lg:max-w-screen-md mx-auto">
        <CardHeader>
          <CardTitle>Whoops</CardTitle>
        </CardHeader>

        <CardContent>
          <p>You didn't do any quiz this day!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:max-w-screen-md mx-auto">
      <CardHeader>
        <CardTitle>
          Quiz
          <span className="text-sm text-gray-500 ml-2">
            {cards.length} cards left
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full">
        <div className="flex flex-col items-center w-full px-8">
          {currentCard ? (
            <QuestionForm card={currentCard} onAnswered={onCardAnswered} />
          ) : (
            <p className="text-3xl">You finished the quiz!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
