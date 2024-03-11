"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import React from "react";
import { useSearchParams } from "next/navigation";
import Menu from "@/components/Menu";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getOne, updateOne } from "@/lib/db";
import {
    saveObjectToCookie,
    getObjectFromCookie,
    clearCookie,
  } from "../../lib/cookieService";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  date: z.any(),
});

export default function Page({ params }: any) {
  const [booking, setBooking] = React.useState<any>([])
  const { register, handleSubmit, reset } = useForm();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: booking.name,
      date: booking.date
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedDate = format(values.date, "EEEE dd MMMM yyyy");
    values.date = formattedDate;
    console.log(values);
    const response = await updateOne(values, params.id);
    console.log(response)
  }

  React.useEffect(() => {
    const cookie = getObjectFromCookie("auth")
    if(cookie != true){
        location.assign("/")
    } else {
    const fetchData = async () => {
        try {
          console.log(params.id);
          const payload = await getOne(params.id);
          setBooking(payload);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }
  }, []);

  React.useEffect(() => {
    if (booking) {
      const defaultValues = {
        name: booking.name || '', 
        date: booking.date ? new Date(booking.date) : new Date(),
      };
      form.reset(defaultValues);
    }
  }, [booking, form.reset]);

  return (
    <div>
      <Menu />
      <div className="ms-3 mt-3 mb-3 me-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Edit Booking
        </h2>
        <br></br>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Name: </FormLabel>
                  <FormControl >
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date: </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
