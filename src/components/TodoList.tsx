import { Button, Checkbox } from "react-aria-components";
import { Todo, Priority } from "../types/todo";
import { Check,  Trash2 } from "lucide-react";
import cx from "classix";
import {
    CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  isSameDay,
  parseZonedDateTime,
  today,
} from "@internationalized/date";

const priorityColors = {
  [Priority.LOW]: {
    badge: "bg-gray-100 text-gray-700",
    border: "border-l-gray-300",
  },
  [Priority.MEDIUM]: {
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-400",
  },
  [Priority.HIGH]: {
    badge: "bg-red-100 text-red-700",
    border: "border-l-red-400",
  },
};


interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  selectedDate: CalendarDate;
}

export function TodoList({ todos, onToggle, onDelete, selectedDate }: TodoListProps) {
  const dateTimeFormatter = new DateFormatter("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dateFormatter = new DateFormatter("en-IN", {
    day: "numeric",
    month: "short",
  });

  const formatDate = (date: Date, includeTime: boolean = false) => {
    return includeTime ? dateTimeFormatter.format(date) : dateFormatter.format(date);
  };

  const isSelectedToday = isSameDay(selectedDate, today(getLocalTimeZone()));

  if (todos.length === 0) {
    return  <div className="text-center py-12">
    <p className="text-gray-500 text-sm">No tasks for {isSelectedToday ? 'today' : formatDate(selectedDate.toDate(getLocalTimeZone()))}</p>
    <p className="text-gray-400 text-sm mt-1">Add a task to get started ✨</p>
  </div>;
  }

  return (
    <ul className=" divide-y divide-gray-100">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={cx(
            "p-3 rounded-r-lg hover:bg-gray-50 transition-colors border-l-4",
            priorityColors[todo.priority].border
          )}
        >
          <div className="grid items-center grid-cols-[auto_1fr_auto_auto] gap-x-3">
            <Checkbox
              aria-label={`toggle ${todo.title}`}
              isSelected={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="group inline-flex items-center"
            >
              <div className="size-5 rounded-md flex justify-center items-center border border-gray-300 group-data-[selected]:bg-gray-900 group-data-[selected]:border-gray-900 group-data-[selected]:text-white transition-colors">
                <Check className="size-4 hidden group-data-[selected]:block" />
              </div>
            </Checkbox>

            <p
              className={cx(
                "text-gray-600 font-semibold text-lg",
                todo.completed ? "line-through text-gray-400" : ""
              )}
            >
              {todo.title}
            </p>

            <Button
              onPress={() => onDelete(todo.id)}
              className="p-1 text-gray-400 hover:text-gray-900 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <Trash2 size={16} />
            </Button>

            <p className="text-xs col-start-2 text-gray-400 mt-0.5">
              {formatDate(parseZonedDateTime(todo.createdAt).toDate(), true)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
