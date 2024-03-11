"use client";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import { getData, deleteData } from "@/lib/db";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "../lib/cookieService";

export default function Home() {
  const [bookings, setBookings] = React.useState<any>([]);
  const [todayCounter, setTodayCounter] = React.useState(0);
  const [tomorrowCounter, setTomorrowCounter] = React.useState(0);
  const [showPin, setShowPin] = React.useState<any>(false);
  const [pin, setPin] = React.useState<any>(0);

  async function handleDeleteData(id: number) {
    const response = await deleteData(id);
    console.log(await response);
    handleGetData();
  }

  function countToday() {
    // Get today's date in the desired format
    const today = new Date();
    const formattedDate = format(today, "EEEE dd MMMM yyyy");
    console.log(formattedDate);
    // Filter the array for entries where the date matches today's date
    if (bookings.length > 0) {
      const matchingEntries = bookings.filter(
        (entry: any) => entry.date === formattedDate
      );
      // Return the count of matching entries
      console.log(matchingEntries.length);
      setTodayCounter(matchingEntries.length);
    }
  }

  function countTomorrow() {
    // Get today's date in the desired format
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const formattedDate = format(today, "EEEE dd MMMM yyyy");
    console.log(formattedDate);
    // Filter the array for entries where the date matches today's date
    if (bookings.length > 0) {
      const matchingEntries = bookings.filter(
        (entry: any) => entry.date === formattedDate
      );
      // Return the count of matching entries
      console.log(matchingEntries.length);
      setTomorrowCounter(matchingEntries.length);
    }
  }

  async function handleGetData() {
    const response = await getData();
    setBookings(response);
  }

  React.useEffect(() => {
    const cookie = getObjectFromCookie("auth")
    if(cookie != true){
      setShowPin(true)
    }else{
    handleGetData();
    }
  }, []);

  React.useEffect(() => {
    console.log(pin)
    if(pin == 123456) {
      handleGetData();
      setShowPin(false)
      saveObjectToCookie(true, "auth")
    }
  },[pin])

  React.useEffect(() => {
    console.log(bookings);
    countToday();
    countTomorrow();
  }, [bookings]);

  return (
    <div>
      <Menu />
      <Dialog open={showPin}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock</DialogTitle>
            <DialogDescription>Enter PIN</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="flex-child justify-evenly">
              <InputOTP
                maxLength={6}
                render={({ slots }) => (
                  <div className="space-y-2">
                    <br></br>
                    <InputOTP
                      maxLength={6}
                      value={pin}
                      data-lpignore="true"
                      data-1p-ignore="true"
                      onChange={(value) => setPin(value)}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} data-lpignore="true" data-1p-ignore="true" />
                          ))}{" "}
                        </InputOTPGroup>
                        
                      )}
                    />
                    <br></br>
                  </div>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="ms-3 mt-3 mb-3 me-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          All Bookings
        </h2>
        <br></br>
        <div className="grid gap-4 grid-cols-2">
          <Card className="flex-child">
            <CardHeader>
              <CardDescription>Today:</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress className="ProgressRoot" value={todayCounter * 20}>
                <Progress
                  className="ProgressIndicator"
                  style={{
                    transform: `translateX(-${5 - todayCounter * 20}%)`,
                  }}
                />
              </Progress>
              <h4 className="scroll-m-20 text-md font-semibold tracking-tight mt-3">
                Desks Booked: {todayCounter} / 5
              </h4>
            </CardContent>
          </Card>
          <Card className="flex-child">
            <CardHeader>
              <CardDescription>Tomorrow:</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress className="ProgressRoot" value={tomorrowCounter * 20}>
                <Progress
                  className="ProgressIndicator"
                  style={{
                    transform: `translateX(-${5 - tomorrowCounter * 20}%)`,
                  }}
                />
              </Progress>
              <h4 className="scroll-m-20 text-md font-semibold tracking-tight mt-3">
                Desks Booked: {tomorrowCounter} / 5
              </h4>
            </CardContent>
          </Card>
        </div>
        <br></br>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="ml-auto h-4 w-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteData(booking.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                        <Link href={`/${booking.id}`} legacyBehavior passHref>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  No bookings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
