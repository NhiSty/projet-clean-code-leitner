import { fetchQuiz } from "@/api/learning";
import { AnswerQuiz } from "@/components/answerQuiz";
import { DateSelector } from "@/components/dateSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

export function LearningPage(): JSX.Element {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { isPending, error, data } = useQuery({
    queryKey: ["quiz", date],
    queryFn: () => fetchQuiz(date),
  });

  const renderQuiz = () => {
    if (isPending) {
      return (
        <div className="container my-24 flex flex-col justify-center items-center">
          <Loader2Icon className="animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="container my-24">
          <Card className="lg:max-w-screen-md mx-auto">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error.message}</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (data) {
      return <AnswerQuiz quiz={data} />;
    }
  };

  return (
    <div className="container my-24">
      <header className="flex flex-row">
        <DateSelector
          className="w-52"
          default={new Date()}
          onDateSelected={(date) => setDate(date)}
        />
      </header>

      <main>{renderQuiz()}</main>
    </div>
  );
}
