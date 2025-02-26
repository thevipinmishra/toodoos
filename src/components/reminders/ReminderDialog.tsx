import { useState, useCallback, memo } from "react";
import {
  Bell,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  PenLine,
  Plus,
  Trash2Icon,
  X,
} from "lucide-react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Checkbox,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Form,
  Group,
  Heading,
  Input,
  Popover,
  TextField,
} from "react-aria-components";
import { useStore } from "../../store";
import { formatDate } from "../../utils/dateUtils";
import cx from "classix";
import {
  getLocalTimeZone,
  now,
  parseZonedDateTime,
  today,
  ZonedDateTime,
} from "@internationalized/date";
import React from "react";

interface ReminderItemProps {
  reminder: {
    id: string;
    title: string;
    datetime: string;
    completed: boolean;
  };
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const ReminderItem = memo(
  ({ reminder, toggleReminder, deleteReminder }: ReminderItemProps) => {
    const handleToggle = useCallback(
      () => toggleReminder(reminder.id),
      [reminder.id, toggleReminder]
    );
    const handleDelete = useCallback(
      () => deleteReminder(reminder.id),
      [reminder.id, deleteReminder]
    );

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-3">
          <Checkbox
            isSelected={reminder.completed}
            onChange={handleToggle}
            aria-label={`Mark ${reminder.title} as ${
              reminder.completed ? "incomplete" : "complete"
            }`}
            className="group inline-flex items-center"
          >
            <div
              className={cx(
                "size-6 rounded-md flex justify-center items-center border-2",
                reminder.completed
                  ? "bg-gray-200 border-gray-200"
                  : "border-gray-300",
                "transition-all duration-200"
              )}
            >
              <Check
                className={cx(
                  "size-3.5",
                  reminder.completed
                    ? "text-white"
                    : "hidden group-data-[selected]:block"
                )}
              />
            </div>
          </Checkbox>

          <div>
            <p
              className={reminder.completed ? "line-through text-gray-500" : ""}
            >
              {reminder.title}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(parseZonedDateTime(reminder.datetime).toDate(), true)}
            </p>
          </div>
        </div>
        <Button
          onPress={handleDelete}
          aria-label={`Delete reminder: ${reminder.title}`}
          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    );
  }
);

ReminderItem.displayName = "ReminderItem";

export const ReminderDialog = memo(() => {
  const { reminders, addReminder, deleteReminder, toggleReminder } = useStore();
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<ZonedDateTime>(
    now(getLocalTimeZone()).set({ second: 0, millisecond: 0 })
  );

  const handleAddReminder = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!title.trim()) return;

      try {
        const currentDate = today(getLocalTimeZone());
        if (selectedDate.compare(currentDate) < 0) {
          alert("Please select a future date");
          return;
        }

        addReminder(title, selectedDate.toString());
        setTitle("");
        setSelectedDate(
          now(getLocalTimeZone()).set({ second: 0, millisecond: 0 })
        );
      } catch (error: unknown) {
        console.error("Error creating reminder:", error);
        alert("Please select a date");
      }
    },
    [title, selectedDate, addReminder]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );
  const handleDateChange = useCallback(
    (date: ZonedDateTime | null) =>
      date && setSelectedDate(date.set({ second: 0, millisecond: 0 })),
    []
  );

  // Add helper functions to check if a duration button corresponds to selected time
  const isSelectedDuration = useCallback(
    (minutes: number): boolean => {
      const currentTime = now(getLocalTimeZone()).set({
        second: 0,
        millisecond: 0,
      });
      const expectedTime = currentTime.add({ minutes });

      // Compare if selectedDate is equivalent to the expected time with this duration
      return (
        selectedDate.hour === expectedTime.hour &&
        selectedDate.minute === expectedTime.minute &&
        selectedDate.day === expectedTime.day &&
        selectedDate.month === expectedTime.month &&
        selectedDate.year === expectedTime.year
      );
    },
    [selectedDate]
  );

  // Define duration options array
  const durationOptions = [
    { minutes: 15, label: "15 minutes" },
    { minutes: 30, label: "30 minutes" },
    { minutes: 60, label: "1 hour" },
  ];

  return (
    <Dialog className="outline-0 space-y-4 p-6">
      {({ close }) => (
        <>
          <div className="flex items-center justify-between gap-6">
            <Heading className="text-lg font-semibold flex items-center gap-2">
              <Bell className="size-5 text-gray-600" />
              Reminders
            </Heading>

            <Button
              aria-label="Close settings dialog"
              onPress={close}
              className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
            >
              <X className="size-5" />
            </Button>
          </div>

          <Form
            className="space-y-4"
            onSubmit={handleAddReminder}
            validationBehavior="native"
          >
            <TextField
              aria-label="Reminder title"
              className="space-y-1"
              isRequired
            >
              <div className="relative">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <PenLine size={16} />
                </div>
                <Input
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent"
                  placeholder="Remind me for..."
                />
              </div>
              <FieldError className="text-red-600 text-sm font-medium mt-1" />
            </TextField>

            <DatePicker
              value={selectedDate}
              hideTimeZone
              onChange={handleDateChange}
              aria-label="Reminder date"
              minValue={now(getLocalTimeZone())}
              className="flex-1 space-y-1"
              validate={(date) =>
                date && date.compare(now(getLocalTimeZone())) >= 0
                  ? undefined
                  : "Please select a future date"
              }
              isRequired
            >
              <Group className="flex border border-gray-300 rounded-md overflow-hidden">
                <DateInput className="flex flex-1 px-2 py-1.5">
                  {(segment) => (
                    <DateSegment
                      segment={segment}
                      className="focus:bg-gray-100 focus:outline-none rounded-sm text-sm px-0.5 py-0.5 text-gray-800 caret-transparent"
                    />
                  )}
                </DateInput>
                <Button
                  className="px-2 text-gray-600 border-l border-gray-300 hover:bg-gray-50 outline-0"
                  aria-label="Open calendar"
                >
                  <CalendarClock size={16} />
                </Button>
              </Group>
              <FieldError className="text-red-600 text-sm font-medium mt-1" />
              <Popover>
                <Dialog className="outline-none">
                  <Calendar className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <header className="flex items-center justify-between">
                      <Button
                        slot="previous"
                        aria-label="Previous month"
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Heading className="text-sm font-medium text-gray-900" />
                      <Button
                        slot="next"
                        aria-label="Next month"
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </header>
                    <CalendarGrid className="border-collapse w-full">
                      {(date) => (
                        <CalendarCell
                          date={date}
                          className="text-center text-sm p-1.5 hover:bg-gray-100 cursor-default rounded-md focus:outline-none focus:ring-1 focus:ring-gray-200 aria-selected:bg-gray-200 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
                        />
                      )}
                    </CalendarGrid>
                  </Calendar>
                </Dialog>
              </Popover>
            </DatePicker>

            <Group className="flex gap-2 *:flex-1">
              {durationOptions.map((option) => (
                <Button
                  key={option.minutes}
                  onPress={() =>
                    setSelectedDate(
                      now(getLocalTimeZone())
                        .add({ minutes: option.minutes })
                        .set({ second: 0, millisecond: 0 })
                    )
                  }
                  className={cx(
                    "py-1.5 px-2 border rounded-md outline-none focus:ring-1 focus:ring-gray-200 transition-colors text-sm flex items-center justify-center gap-2",
                    isSelectedDuration(option.minutes)
                      ? "bg-gray-800 border-gray-800 text-white font-medium"
                      : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <Clock size={14} />
                  {option.label}
                </Button>
              ))}
            </Group>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Reminder
            </Button>
          </Form>

          {reminders.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {reminders.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  toggleReminder={toggleReminder}
                  deleteReminder={deleteReminder}
                />
              ))}
            </div>
          )}
        </>
      )}
    </Dialog>
  );
});

ReminderDialog.displayName = "ReminderDialog";
