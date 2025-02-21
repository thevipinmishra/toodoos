import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import {
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
  useTodos,
} from "./hooks/useTodos";

import {
  getLocalTimeZone,
  today,
  isEqualDay,
  DateValue,
  parseZonedDateTime,
  toCalendarDate,
  CalendarDate,
} from "@internationalized/date";
import { Priority } from "./types/todo";
import { useState } from "react";
import { useSelectedProject } from "./hooks/useMetaState";
import { toast } from "sonner";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
  const { selectedProject } = useSelectedProject();

  const minDate =
    todos.length > 0
      ? todos.reduce<CalendarDate>((min, todo) => {
          const todoDate = toCalendarDate(parseZonedDateTime(todo.createdAt));
          return todoDate.compare(min) < 0 ? todoDate : min;
        }, toCalendarDate(parseZonedDateTime(todos[0].createdAt)))
      : today(getLocalTimeZone());

  const handleSubmit = (title: string, priority: Priority) => {
    addTodo(title, priority, selectedProject || undefined);
    toast.success("Todo added successfully");
  };

  const isSameDay = (date1: DateValue, date2: DateValue) => {
    return isEqualDay(date1, date2);
  };

  const filteredTodos = todos.filter(
    (todo) =>
      isSameDay(
        selectedDate,
        toCalendarDate(parseZonedDateTime(todo.createdAt))
      ) &&
      (selectedProject === null
        ? !todo.projectId
        : todo.projectId === selectedProject)
  );

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    toast.success("Todo deleted successfully");
  };

  return (
    <div className="min-h-dvh [--aside-width:280px]">
      <Sidebar
        selectedDate={selectedDate}
        setSelectedDate={(date) => setSelectedDate(toCalendarDate(date))}
        minDate={minDate}
      />
      <main className="lg:pl-[var(--aside-width)]">
        <Header />
        <div className="container max-w-3xl py-12">
          <div className="flex flex-col gap-8">
            <h3 className="font-bold tracking-tight text-gray-900 text-2xl">
              Toodoos 📝
            </h3>
            <TodoForm
              onSubmit={handleSubmit}
              selectedProject={
                selectedProject && selectedProject !== "all"
                  ? selectedProject
                  : undefined
              }
            />
            <TodoList
              todos={filteredTodos}
              selectedDate={selectedDate}
              onToggle={toggleTodo}
              onDelete={handleDeleteTodo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
