import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";

export const Sidebar = ({
  selectedDate,
  setSelectedDate,
  minDate,
}: {
  selectedDate: DateValue;
  setSelectedDate: (date: DateValue) => void;
  minDate: CalendarDate;
}) => {
  return (
    <aside className="fixed hidden lg:block w-[var(--aside-width)] inset-y-0 left-0 bg-white border-r border-gray-200">
      <Calendar
        aria-label="Appointment date"
        className="p-6"
        maxValue={today(getLocalTimeZone())}
        minValue={minDate}
        value={selectedDate}
        onChange={setSelectedDate}
      >
        <header className="flex items-center justify-between mb-6">
          <Button
            slot="previous"
            className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
          >
            <ChevronLeft size={16} />
          </Button>
          <Heading className="text-sm font-medium text-gray-600" />
          <Button
            slot="next"
            className="size-8 flex justify-center items-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200"
          >
            <ChevronRight size={16} />
          </Button>
        </header>
        <CalendarGrid className="gap-0.5">
          {(date) => (
            <CalendarCell
              date={date}
              className="flex items-center justify-center size-8 rounded-sm text-sm font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-900 data-[selected]:bg-gray-900 data-[selected]:text-white data-[unavailable]:text-gray-300 data-[outside-month]:text-gray-300 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
          )}
        </CalendarGrid>
      </Calendar>
    </aside>
  );
};
