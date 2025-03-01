import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Todo, Priority } from "../types/todo";
import { Project } from "../types/project";
import { getCurrentDateTime } from "../utils/date";
import { Reminder } from "../types/reminder";

interface Store {
  name: string;
  projects: Project[];
  todos: Todo[];
  selectedProject: string | null;
  reminders: Reminder[];
  setName: (name: string) => void;
  addProject: (title: string) => void;
  updateProject: (id: string, title: string) => void;
  deleteProject: (id: string) => void;
  addTodo: (title: string, priority: Priority, projectId?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, priority: Priority) => void;
  setSelectedProject: (projectId: string | null) => void;
  addReminder: (
    title: string, 
    datetime: string, 
    isRecurring?: boolean, 
    recurringDays?: number[],
    recurringTime?: string
  ) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

type StorePersist = (
  config: StateCreator<Store>,
  options: PersistOptions<Store>
) => StateCreator<Store>;

export const useStore = create<Store>()(
  (persist as StorePersist)(
    (set) => ({
      name: "",
      projects: [],
      todos: [],
      selectedProject: null,
      reminders: [],
      setName: (name) => set({ name }),
      addProject: (title) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: nanoid(7),
              title,
              createdAt: getCurrentDateTime(),
              updatedAt: getCurrentDateTime(),
            },
          ],
        })),
      updateProject: (id, title) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, title, updatedAt: getCurrentDateTime() }
              : project
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          todos: state.todos.filter((todo) => todo.projectId !== id),
          selectedProject:
            state.selectedProject === id ? null : state.selectedProject,
        })),
      addTodo: (title, priority = Priority.MEDIUM, projectId) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: nanoid(),
              title,
              priority,
              projectId,
              completed: false,
              createdAt: getCurrentDateTime(),
              updatedAt: getCurrentDateTime(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  updatedAt: getCurrentDateTime(),
                }
              : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateTodo: (id, title, priority) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, title, priority, updatedAt: getCurrentDateTime() }
              : todo
          ),
        })),
      setSelectedProject: (projectId) => set({ selectedProject: projectId }),
      addReminder: (title, datetime, isRecurring = false, recurringDays = [], recurringTime = "") =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            {
              id: nanoid(),
              title,
              datetime,
              completed: false,
              createdAt: getCurrentDateTime(),
              updatedAt: getCurrentDateTime(),
              isRecurring,
              recurringDays: isRecurring ? recurringDays : undefined,
              recurringTime: isRecurring ? recurringTime : undefined,
            },
          ],
        })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? {
                  ...reminder,
                  completed: !reminder.completed,
                  updatedAt: getCurrentDateTime(),
                }
              : reminder
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        })),
    }),
    {
      name: "todo-app-storage",
      version: 1,
    }
  )
);
