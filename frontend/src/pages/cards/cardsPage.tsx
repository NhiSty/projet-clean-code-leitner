import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { tagSearchSchema } from "@/lib/validation/cards.validation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCards } from "@/api/cards";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CardsPage(): JSX.Element {
  const form = useForm({
    resolver: yupResolver(tagSearchSchema),
    defaultValues: {
      tag: "",
    },
  });

  const { isLoading, data, error } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchCards(),
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
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>{card.question}</CardTitle>
                <span>
                  <Badge className="inline-block w-auto">{card.tag}</Badge>
                </span>
              </CardHeader>

              <CardContent>
                <p>{card.answer}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container min-h-screen flex flex-col my-24">
      <section className="mb-8">
        <Form {...form}>
          <form className="flex flex-row justify-start gap-4">
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
        </Form>
      </section>

      <main>{renderList()}</main>
    </div>
  );
}
