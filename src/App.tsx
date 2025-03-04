import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import {
  useAddTodo,
  useToggleTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from "./hooks/useTodos";

import {
  getLocalTimeZone,
  today,
  isEqualDay,
  DateValue,
  parseZonedDateTime,
  toCalendarDate,
  CalendarDate,
  parseDate,
} from "@internationalized/date";
import { Priority } from "./types/todo";
import { useState, useEffect } from "react";
import { useSelectedProject } from "./hooks/useMetaState";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContainer } from './components/notifications/NotificationContainer';
import { NotificationPermissionButton } from './components/notifications/NotificationPermissionButton';

// Utility function to work with URL params
const getDateFromUrl = (): CalendarDate | null => {
  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get('date');
  
  if (dateParam) {
    try {
      return parseDate(dateParam);
    } catch (e) {
      console.error('Invalid date format in URL', e);
      return null;
    }
  }
  return null;
};

const updateUrlWithDate = (date: CalendarDate) => {
  const todayDate = today(getLocalTimeZone());
  const params = new URLSearchParams(window.location.search);
  
  if (isEqualDay(date, todayDate)) {
    params.delete('date');
  } else {
    params.set('date', date.toString());
  }
  
  const newUrl = 
    window.location.pathname + 
    (params.toString() ? `?${params.toString()}` : '') +
    window.location.hash;
  
  window.history.replaceState({}, '', newUrl);
};

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const updateTodo = useUpdateTodo();
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(() => {
    const urlDate = getDateFromUrl();
    return urlDate || today(getLocalTimeZone());
  });
  const { selectedProject } = useSelectedProject();

  // Update URL when selected date changes
  useEffect(() => {
    updateUrlWithDate(selectedDate);
  }, [selectedDate]);

  const minDate =
    todos.length > 0
      ? todos.reduce<CalendarDate>((min, todo) => {
          const todoDate = toCalendarDate(parseZonedDateTime(todo.createdAt));
          return todoDate.compare(min) < 0 ? todoDate : min;
        }, toCalendarDate(parseZonedDateTime(todos[0].createdAt)))
      : today(getLocalTimeZone());

  const handleSubmit = (title: string, priority: Priority) => {
    addTodo(title, priority, selectedProject || undefined);
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
  };

  const handleEditTodo = (id: string, title: string, priority: Priority) => {
    updateTodo(id, title, priority);
  };

  const handleDateChange = (date: DateValue) => {
    const calendarDate = toCalendarDate(date);
    setSelectedDate(calendarDate);
  };

  return (
    <NotificationProvider>
      <div className="min-h-dvh [--aside-width:280px]">
        <Sidebar
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          minDate={minDate}
        />
        <main className="lg:pl-[var(--aside-width)]">
          <Header />
          <div className="container lg:max-w-3xl py-12">
            <div className="flex flex-col gap-8">
              <h3 className="font-bold tracking-tight text-gray-900 text-2xl">
                Toodoos {filteredTodos.length > 0 ? `(${filteredTodos.length})` : ''} 📝
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
                onEdit={handleEditTodo}
              />
            </div>
          </div>
        </main>
        <NotificationContainer />
        <NotificationPermissionButton />
      </div>
    </NotificationProvider>
  );
}

export default App;
