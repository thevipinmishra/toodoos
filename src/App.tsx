import { getGreeting } from "./utils/greeting";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import {
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
  useTodos,
} from "./hooks/useTodos";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Heading,
} from "react-aria-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <div className="min-h-dvh [--aside-width:280px]">
      <aside className="fixed w-[var(--aside-width)] inset-y-0 left-0 bg-gray-50 border-r border-gray-100">
        <Calendar
          aria-label="Appointment date"
          className="p-6"
          maxValue={today(getLocalTimeZone())}
          defaultValue={today(getLocalTimeZone())}
        >
          <header className="flex items-center justify-between mb-6">
            <Button
              slot="previous"
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={16} />
            </Button>
            <Heading className="text-sm font-medium text-gray-600" />
            <Button
              slot="next"
              className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronRight size={16} />
            </Button>
          </header>
          <CalendarGrid className="gap-0.5">
            {(date) => (
              <CalendarCell
                date={date}
                className="flex items-center justify-center h-9 w-9 rounded-sm text-sm text-gray-600 cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-900 data-[selected]:bg-gray-900 data-[selected]:text-white data-[unavailable]:text-gray-300 data-[outside-month]:text-gray-300  aria-disabled:pointer-events-none aria-disabled:opacity-50"
              />
            )}
          </CalendarGrid>
        </Calendar>
      </aside>
      <main className="pl-[var(--aside-width)]">
        <header className="bg-white flex py-4 border-b border-gray-100">
          <div className="container">
            <p className="text-gray-600 text-sm font-medium">{getGreeting()}</p>
          </div>
        </header>
        <div className="container max-w-3xl py-12">
          <div className="flex flex-col gap-8">
            <h3 className="font-bold tracking-tight text-gray-900 text-2xl">
              Toodoos
            </h3>
            <TodoForm onSubmit={addTodo} />
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
