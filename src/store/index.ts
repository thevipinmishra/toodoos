import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { nanoid } from "nanoid";
import { Todo, Priority } from "../types/todo";
import { Project } from "../types/project";
import { getCurrentDateTime } from "../utils/date";

interface Store {
  name: string;
  projects: Project[];
  todos: Todo[];
  selectedProject: string | null;
  setName: (name: string) => void;
  addProject: (title: string) => void;
  updateProject: (id: string, title: string) => void;
  deleteProject: (id: string) => void;
  addTodo: (title: string, priority: Priority, projectId?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, title: string, priority: Priority) => void;
  setSelectedProject: (projectId: string | null) => void;
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
    }),
    {
      name: "todo-app-storage",
      version: 1,
    }
  )
);
