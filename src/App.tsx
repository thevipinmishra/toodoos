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
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  TextField,
  Form,
  Label,
  Input,
} from "react-aria-components";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
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
import { useUserName } from "./hooks/useMetaState";

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
  const { name, setName } = useUserName();
  const [inputName, setInputName] = useState(name);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const minDate =
    todos.length > 0
      ? todos.reduce<CalendarDate>((min, todo) => {
          const todoDate = toCalendarDate(parseZonedDateTime(todo.createdAt));
          return todoDate.compare(min) < 0 ? todoDate : min;
        }, toCalendarDate(parseZonedDateTime(todos[0].createdAt)))
      : today(getLocalTimeZone());

  const handleSubmit = (title: string, priority: Priority) => {
    addTodo(title, priority);
  };

  const isSameDay = (date1: DateValue, date2: DateValue) => {
    return isEqualDay(date1, date2);
  };

  const filteredTodos = todos.filter((todo) =>
    isSameDay(selectedDate, toCalendarDate(parseZonedDateTime(todo.createdAt)))
  );

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName(inputName);
    setSettingsDialogOpen(false);
  };

  return (
    <div className="min-h-dvh [--aside-width:280px]">
      <aside className="fixed w-[var(--aside-width)] inset-y-0 left-0 bg-white border-r border-gray-200">
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
      <main className="pl-[var(--aside-width)]">
        <header className="bg-white py-4 border-b border-gray-200">
          <div className="container flex items-center justify-between">
            <p className="text-gray-600 text-sm font-medium">
              ✨ {getGreeting()}
              {name ? `, ${name}` : ""}
            </p>

            <DialogTrigger
              isOpen={settingsDialogOpen}
              onOpenChange={setSettingsDialogOpen}
            >
              <Button className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1">
                <Settings size={16} />
              </Button>
              <ModalOverlay
                isDismissable
                className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto"
              >
                <Modal className="w-[400px] bg-white rounded-lg shadow-lg">
                  <Dialog className="outline-0">
                    <div className="p-6 space-y-6">
                      <Heading
                        slot="title"
                        className="text-xl font-semibold text-gray-900"
                      >
                        Settings ⚙️
                      </Heading>

                      <Form onSubmit={handleNameSubmit} className="space-y-4">
                        <TextField className="space-y-2">
                          <Label className="block text-sm font-medium text-gray-700">
                            Name
                          </Label>
                          <Input
                            name="name"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent"
                          />
                        </TextField>
                        <Button
                          type="submit"
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-200"
                        >
                          Save Changes
                        </Button>
                      </Form>
                    </div>
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          </div>
        </header>
        <div className="container max-w-3xl py-12">
          <div className="flex flex-col gap-8">
            <h3 className="font-bold tracking-tight text-gray-900 text-2xl">
              Toodoos 📝
            </h3>
            <TodoForm onSubmit={handleSubmit} />
            <TodoList
              todos={filteredTodos}
              selectedDate={selectedDate}
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
