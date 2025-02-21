import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { Priority } from "../types/todo";

interface TodoFormProps {
  onSubmit: (title: string, priority: Priority) => void;
  selectedProject?: string;
}

const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: "Low",
  [Priority.MEDIUM]: "Medium",
  [Priority.HIGH]: "High",
};

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.LOW);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), priority);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextField
        autoComplete="off"
        spellCheck="off"
        value={title}
        aria-label="Add new todo"
        onChange={setTitle}
        className="flex-1"
      >
        <Input
          placeholder="Add a new todo..."
          className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-600 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </TextField>
      <Select
        aria-label="Select priority"
        className="w-[120px]"
        selectedKey={priority}
        onSelectionChange={(key) => setPriority(key as Priority)}
      >
        <Button className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0">
          <SelectValue />
          <ChevronDownIcon className="size-4 shrink-0" aria-hidden />
        </Button>
        <Popover className="w-[120px]">
          <ListBox className="rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
            {Object.entries(priorityLabels).map(([key, label]) => (
              <ListBoxItem
                key={key}
                id={key}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-600 outline-none data-[selected]:bg-gray-100 data-[focused]:bg-gray-50"
              >
                {label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      <Button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-5"
      >
        Add
      </Button>
    </form>
  );
}
