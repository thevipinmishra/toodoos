import { useState } from "react";
import { Button, Input, TextField } from "react-aria-components";

interface TodoFormProps {
  onSubmit: (title: string) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextField value={title} aria-label="Add new todo" onChange={setTitle} className="flex-1">
        <Input 
          placeholder="Add a new todo..." 
          className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-gray-600 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </TextField>
      <Button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-5"
      >
        Add
      </Button>
    </form>
  );
}
