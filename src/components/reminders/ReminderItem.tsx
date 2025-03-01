import { useCallback, memo } from "react";
import { Check, Trash2Icon, Repeat } from "lucide-react";
import { Button, Checkbox } from "react-aria-components";
import cx from "classix";
import { parseZonedDateTime } from "@internationalized/date";
import { formatDate } from "../../utils/dateUtils";

interface ReminderItemProps {
  reminder: {
    id: string;
    title: string;
    datetime: string;
    completed: boolean;
    isRecurring?: boolean;
    recurringDays?: number[];
    recurringTime?: string;
  };
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const formatRecurringDays = (days: number[] = []) => {
  if (days.length === 7) return "Every day";
  if (days.length === 0) return "";
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Check for weekdays
  const weekdays = [1, 2, 3, 4, 5];
  if (weekdays.every(day => days.includes(day)) && days.length === 5) {
    return "Weekdays";
  }
  
  // Check for weekends
  const weekends = [0, 6];
  if (weekends.every(day => days.includes(day)) && days.length === 2) {
    return "Weekends";
  }
  
  // Otherwise, show the list of days
  return days.sort().map(day => dayNames[day]).join(", ");
};

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
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {reminder.isRecurring ? (
                <>
                  <Repeat size={12} className="text-gray-400" />
                  <span>
                    {formatRecurringDays(reminder.recurringDays)} at {reminder.recurringTime}
                  </span>
                </>
              ) : (
                formatDate(parseZonedDateTime(reminder.datetime).toDate(), true)
              )}
            </div>
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

export default ReminderItem;
