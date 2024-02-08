import { Card } from "@/types/card";
import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { answerQuestionSchema } from "@/lib/validation/cards.validation";
import { Input } from "./ui/input";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightCircleIcon,
  CheckSquareIcon,
  LucideIcon,
} from "lucide-react";

interface QuestionFormProps {
  card: Card;
  onAnswered?: (valid: boolean) => void;
}

interface FormAction {
  text: string;
  onClick?: () => void;
  icon?: ReactElement<LucideIcon>;
  variant?: ButtonProps["variant"];
}

interface QuestionFormActionProps {
  wrong?: boolean;
  primaryAction: FormAction;
  secondaryAction?: FormAction;
}

function QuestionFormAction(props: QuestionFormActionProps) {
  return (
    <div
      className={cn(
        "flex flex-row w-full",
        props.secondaryAction ? "justify-between" : "justify-end"
      )}
    >
      {props.secondaryAction && (
        <Button
          onClick={() => props.secondaryAction?.onClick?.()}
          className="inline-flex gap-2"
          variant={props.secondaryAction!.variant}
        >
          {props.secondaryAction!.icon}
          {props.secondaryAction!.text}
        </Button>
      )}

      <Button
        onClick={() => props.primaryAction.onClick?.()}
        className="inline-flex gap-2"
        variant={props.primaryAction.variant}
      >
        {props.primaryAction.text}
        {props.primaryAction.icon}
      </Button>
    </div>
  );
}

export function QuestionForm({
  card,
  onAnswered,
}: QuestionFormProps): JSX.Element {
  const [answer, setAnswer] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [ensureValidation, setEnsureValidation] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState<number | null>(
    null
  );

  useEffect(() => {
    setAnswer(null);
    setWrong(false);
    setEnsureValidation(false);
    if (validationTimeout) window.clearTimeout(validationTimeout);
    setValidationTimeout(null);
  }, [card]);

  const form = useForm({
    resolver: yupResolver(answerQuestionSchema),
    defaultValues: {
      answer: "",
    },
  });

  const onSubmit = useCallback(
    (data: { answer: string }) => {
      setAnswer(data.answer);
      form.reset();

      if (data.answer !== card.answer) {
        setWrong(true);
      }
    },
    [card.answer, form]
  );

  const onForceValidationClicked = useCallback(() => {
    if (!ensureValidation) {
      setEnsureValidation(true);
      const t = window.setTimeout(() => {
        setEnsureValidation(false);
        if (validationTimeout) window.clearTimeout(validationTimeout);
      }, 5000);
      setValidationTimeout(t);
    } else {
      setEnsureValidation(false);
      if (validationTimeout) window.clearTimeout(validationTimeout);
      // Do something
      onAnswered?.(true);
    }
  }, [ensureValidation, onAnswered, validationTimeout]);

  const onContinueClicked = useCallback(() => {
    onAnswered?.(!wrong);
  }, [onAnswered, wrong]);

  const renderContent = () => {
    if (answer == null) {
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col gap-4 mt-8">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="answer">Your answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      );
    }

    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center text-2xl py-8">
          {answer !== card.answer && (
            <p className="text-red-600">
              <del>{answer}</del>
            </p>
          )}
          <p className="text-green-700">{card.answer}</p>
        </div>

        <QuestionFormAction
          wrong={wrong}
          secondaryAction={
            wrong
              ? {
                  text: ensureValidation ? "Force validation ?" : "I was right",
                  onClick: onForceValidationClicked,
                  icon: <CheckSquareIcon className="w-5 h-5" />,
                  variant: ensureValidation ? "destructive" : "outline",
                }
              : undefined
          }
          primaryAction={{
            text: "Continue",
            onClick: onContinueClicked,
            icon: <ArrowRightCircleIcon className="w-5 h-5" />,
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <p className="text-3xl">{card.question}</p>
      </div>

      {renderContent()}
    </>
  );
}
