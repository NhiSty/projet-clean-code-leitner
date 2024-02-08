import { CardWithCategory } from "@/types/card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AnswerQuizProps {
  quiz: CardWithCategory[];
}

export function AnswerQuiz(props: AnswerQuizProps): JSX.Element {
  if (props.quiz.length === 0) {
    return (
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>

      <CardContent>
        <p>Quiz</p>
      </CardContent>
    </Card>
  );
}
