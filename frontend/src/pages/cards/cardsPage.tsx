import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { tagSearchSchema } from "@/lib/validation/cards.validation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "@/api/cards";
import { useState } from "react";
import debounce from "lodash.debounce";
import { QuestionCard } from "@/components/questionCard";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

interface FormInputs {
  tag?: string;
}

export function CardsPage(): JSX.Element {
  const [searchTag, setSearchTag] = useState<string | undefined>();

  const form = useForm<FormInputs>({
    resolver: yupResolver(tagSearchSchema),
    defaultValues: {
      tag: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = debounce((data: FormInputs) => {
    setSearchTag(data.tag);
  }, 150);

  const { isLoading, data, error } = useQuery({
    queryKey: ["cards", searchTag],
    queryFn: () => fetchCards(searchTag),
  });

  const renderList = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((card) => (
          <li key={card.id}>
            <QuestionCard card={card} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container flex flex-col my-24">
      <section className="mb-8 flex flex-row">
        <Form {...form}>
          <form
            className="flex flex-row justify-start gap-4 flex-1"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Search a tag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Search</Button>
          </form>

          <Button asChild>
            <Link to="/cards/new" className="inline-flex items-center gap-1">
              <PlusIcon className="w-6 h-6 mr-2" />
              Create new card
            </Link>
          </Button>
        </Form>
      </section>

      <main>{renderList()}</main>
    </div>
  );
}
