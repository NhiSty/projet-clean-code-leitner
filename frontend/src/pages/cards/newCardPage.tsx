import { createCard } from "@/api/cards";
import {
  ConflictError,
  UnprocessableContentError,
  queryClient,
} from "@/api/fetcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { newCardSchema } from "@/lib/validation/cards.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { FilePlusIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormInputs {
  question: string;
  answer: string;
  tag: string;
}

function isFormInputsField(key: string): key is keyof FormInputs {
  return ["question", "answer", "tag"].includes(key);
}

export function NewCardPage(): JSX.Element {
  const navigate = useNavigate();

  const form = useForm<FormInputs>({
    resolver: yupResolver(newCardSchema),
    defaultValues: {
      question: "",
      answer: "",
      tag: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const mutation = useMutation({
    mutationFn: (data: FormInputs) => createCard(data),
    onSuccess: () => {
      // Invalid react query cache
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      // Then redirect to the cards page
      navigate("/cards");
    },
    onError: (error) => {
      if (error instanceof UnprocessableContentError) {
        for (const e of error.errors) {
          if (e.field === "") {
            form.setError("root.serverError", { message: e.message });
          } else if (isFormInputsField(e.field)) {
            form.setError(e.field, { message: e.message });
          }
        }
        return;
      }

      if (error instanceof ConflictError) {
        form.setError("root.serverError", { message: error.message });
        return;
      }

      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = debounce((data) => {
    mutation.mutate(data);
  }, 150);

  return (
    <div className="container flex flex-col my-24 justify-center items-center">
      <Card className="lg:max-w-lg w-full">
        <CardHeader>
          <CardTitle>New Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {errors.root && (
                <FormMessage>{errors.root.serverError.message}</FormMessage>
              )}
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Tag" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="inline-flex items-center gap-2">
                <FilePlusIcon className="w-6 h-6" />
                Create
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
