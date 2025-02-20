import { Button, Checkbox } from "react-aria-components";
import { Todo } from "../types/todo";
import { Check, TrashIcon } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-gray-500">No todos yet!</p>;
  }

  return (
    <ul className=" divide-y divide-gray-100">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Checkbox
            aria-label={`toggle ${todo.title}`}
            isSelected={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="group inline-flex"
          >
            <div className="h-5 w-5 rounded-md flex justify-center items-center border border-gray-300 group-data-[selected]:bg-gray-900 group-data-[selected]:border-gray-900 group-data-[selected]:text-white transition-colors">
              <Check className="size-3.5 hidden group-data-[selected]:block" />
            </div>
          </Checkbox>
          <span
            className={`flex-1 text-gray-600 ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.title}
          </span>
          <Button
            onPress={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded-md hover:bg-gray-100"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
