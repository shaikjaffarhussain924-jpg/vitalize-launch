"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CalendarSchedulerProps {
  timeSlots?: string[];
  onConfirm?: (value: { date?: Date; time?: string }) => void;
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
  showCard?: boolean;
}

function CalendarScheduler({
  timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ],
  onConfirm,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  showCard = true,
}: CalendarSchedulerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(new Date());
  const [internalTime, setInternalTime] = React.useState<string | undefined>();

  const date = selectedDate !== undefined ? selectedDate : internalDate;
  const time = selectedTime !== undefined ? selectedTime : internalTime;

  const handleDateChange = (d: Date | undefined) => {
    if (onDateChange) onDateChange(d);
    else setInternalDate(d);
  };

  const handleTimeChange = (t: string) => {
    if (onTimeChange) onTimeChange(t);
    else setInternalTime(t);
  };

  const content = (
    <>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Calendar Section */}
        <div className="flex-shrink-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className={cn("p-3 pointer-events-auto")}
          />
        </div>

        {/* Time Slots Section */}
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Pick a time
          </p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={time === slot ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs",
                  time === slot && "bg-gold hover:bg-gold/90 text-gold-foreground"
                )}
                onClick={() => handleTimeChange(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (!showCard) return content;

  return (
    <Card className="w-full max-w-lg border-2 border-border/50">
      <CardHeader>
        <CardTitle className="text-navy font-heading">Schedule Appointment</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            handleDateChange(undefined);
            handleTimeChange("");
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          className="bg-gold hover:bg-gold/90 text-gold-foreground"
          onClick={() => onConfirm?.({ date, time })}
          disabled={!date || !time}
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}

export { CalendarScheduler };
