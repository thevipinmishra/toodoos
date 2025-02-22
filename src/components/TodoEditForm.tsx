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
import { useState } from "react";
import { X, ChevronDownIcon } from "lucide-react";

interface TodoEditFormProps {
  initialTitle: string;
  initialPriority: Priority;
  onSubmit: (title: string, priority: Priority) => void;
  onCancel: () => void;
}

export function TodoEditForm({
  initialTitle,
  initialPriority,
  onSubmit,
  onCancel,
}: TodoEditFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [priority, setPriority] = useState(initialPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, priority);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between gap-6 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Edit Todo ✍️</h2>
        <Button
          type="button"
          onPress={onCancel}
          className="size-7 flex justify-center items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
        >
          <X className="size-5" />
        </Button>
      </div>

      <TextField
        aria-label="Edit todo title"
        autoFocus
        value={title}
        onChange={(value) => setTitle(value)}
      >
        <Input className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-600 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50" />
      </TextField>

      <Select
        aria-label="Edit todo priority"
        defaultSelectedKey={priority}
        onSelectionChange={(selected) => setPriority(selected as Priority)}
        className="w-full"
      >
        <Button className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0">
          <SelectValue />
          <ChevronDownIcon className="size-4 shrink-0" aria-hidden />
        </Button>
        <Popover className="w-[var(--trigger-width)] data-entering:motion-opacity-in-0 motion-duration-200 data-entering:data-[placement=bottom]:motion-translate-y-in-[0.5rem] data-exiting:motion-opacity-out-0">
          <ListBox className="rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
            {Object.values(Priority).map((p) => (
              <ListBoxItem
                key={p}
                id={p}
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-600 outline-none data-[selected]:bg-gray-100 data-[focused]:bg-gray-50"
              >
                {p}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onPress={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
