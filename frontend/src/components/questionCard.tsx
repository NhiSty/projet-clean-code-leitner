import { CardWithCategory as ICard } from "@/types/card";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface QuestionCardProps {
  card: ICard;
}

export function QuestionCard({ card }: QuestionCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>{card.question}</CardTitle>
        <span className="flex flex-wrap gap-1">
          <Badge className="inline-block w-auto">{card.tag}</Badge>
          <Badge className="inline-block w-auto uppercase">
            {card.category}
          </Badge>
        </span>
      </CardHeader>

      <CardContent>
        <p>{card.answer}</p>
      </CardContent>
    </Card>
  );
}
