import { dateSelectorSchema } from "@/lib/validation/dateSelector.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useCallback, useEffect } from "react";

interface DateSelectorProps {
  onDateSelected?: (date: Date) => void;
  default?: Date;
  className?: string;
}

interface FormInputs {
  date: Date;
}

export function DateSelector(props: DateSelectorProps): JSX.Element {
  const form = useForm<FormInputs>({
    defaultValues: {
      date: props.default,
    },
    mode: "all",
    resolver: yupResolver(dateSelectorSchema),
  });

  const renderFieldValue = useCallback(
    (value: Date | undefined) => {
      const day = value ?? props.default;

      if (day) {
        if (isToday(day)) return <span>Today</span>;

        return <span>{format(day, "PPP")}</span>;
      }

      return <span>Pick a date</span>;
    },
    [props.default]
  );

  const data = form.watch();

  useEffect(() => {
    props.onDateSelected?.(data.date);
  }, [data, props]);

  return (
    <Form {...form}>
      <form className={cn("space-y-8", props.className)}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select a date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {renderFieldValue(field.value)}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2000-01-01")
                    }
                    initialFocus
                  />

                  <Button
                    variant={"ghost"}
                    className="w-full"
                    onClick={() => field.onChange(new Date())}
                  >
                    Today
                  </Button>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
