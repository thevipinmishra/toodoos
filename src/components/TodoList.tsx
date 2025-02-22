import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Todo, Priority } from "../types/todo";
import { Check, Trash2, Pencil } from "lucide-react";
import cx from "classix";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  isSameDay,
  parseZonedDateTime,
  today,
} from "@internationalized/date";
import { useState } from "react";
import { TodoEditForm } from "./TodoEditForm";

const priorityColors = {
  [Priority.LOW]: {
    badge: "bg-gray-100 text-gray-700",
    accent: "text-gray-500",
    hover: "hover:bg-gray-50",
    border: "border-gray-200",
  },
  [Priority.MEDIUM]: {
    badge: "bg-blue-100 text-blue-700",
    accent: "text-blue-600",
    hover: "hover:bg-blue-50",
    border: "border-blue-200",
  },
  [Priority.HIGH]: {
    badge: "bg-red-100 text-red-700",
    accent: "text-red-600",
    hover: "hover:bg-red-50",
    border: "border-red-200",
  },
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, priority: Priority) => void;
  dateTimeFormatter: DateFormatter;
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  dateTimeFormatter,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li
      className={cx(
        "p-4 rounded-lg transition-all duration-200",
        "bg-white border shadow-2xs",
        todo.completed
          ? "bg-gray-50 border-gray-200"
          : `${priorityColors[todo.priority].hover} ${
              priorityColors[todo.priority].border
            }`
      )}
    >
      <div className="grid items-center grid-cols-[auto_1fr_auto] gap-x-4">
        <Checkbox
          aria-label={`toggle ${todo.title}`}
          isSelected={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="group inline-flex items-center"
        >
          <div
            className={cx(
              "size-5 rounded-full flex justify-center items-center border-2",
              todo.completed
                ? "bg-gray-200 border-gray-200"
                : `border-gray-300 group-hover:border-${
                    priorityColors[todo.priority].accent
                  }`,
              "transition-all duration-200"
            )}
          >
            <Check
              className={cx(
                "size-3.5",
                todo.completed
                  ? "text-white"
                  : "hidden group-data-[selected]:block"
              )}
            />
          </div>
        </Checkbox>

        <div className="flex flex-col gap-1">
          <p
            className={cx(
              "font-medium text-base transition-all duration-200",
              todo.completed
                ? "text-gray-400"
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            {todo.title}
          </p>
          <p className="text-xs text-gray-400">
            {dateTimeFormatter.format(
              parseZonedDateTime(todo.createdAt).toDate()
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 transition-all duration-200">
          <DialogTrigger isOpen={isEditing} onOpenChange={setIsEditing}>
            <Button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
              <Pencil size={14} />
            </Button>
            <ModalOverlay
              isDismissable
              className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto data-[entering]:motion-preset-fade data-[entering]:motion-duration-100"
            >
              <Modal className="w-full max-w-md bg-white rounded-lg shadow-lg data-[entering]:motion-preset-blur-up data-[entering]:motion-duration-150">
                <Dialog className="outline-0">
                  {({ close }) => (
                    <div className="p-6">
                      <TodoEditForm
                        initialTitle={todo.title}
                        initialPriority={todo.priority}
                        onSubmit={(title, priority) => {
                          onEdit(todo.id, title, priority);
                          close();
                        }}
                        onCancel={close}
                      />
                    </div>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>

          <Button
            onPress={() => onDelete(todo.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </li>
  );
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, priority: Priority) => void;
  selectedDate: CalendarDate;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  selectedDate,
}: TodoListProps) {
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
    return includeTime
      ? dateTimeFormatter.format(date)
      : dateFormatter.format(date);
  };

  const isSelectedToday = isSameDay(selectedDate, today(getLocalTimeZone()));

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-sm mx-auto">
          <div className="mb-4 text-gray-300">
            <Check size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600 text-lg font-medium">
            No tasks for{" "}
            {isSelectedToday
              ? "today"
              : formatDate(selectedDate.toDate(getLocalTimeZone()))}
          </p>
          <p className="text-gray-400 mt-2">
            Add a task using the input field above ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3 px-1">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          dateTimeFormatter={dateTimeFormatter}
        />
      ))}
    </ul>
  );
}
