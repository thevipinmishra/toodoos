import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { nanoid } from 'nanoid'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TodoStore {
  todos: Todo[]
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updateTodo: (id: string, title: string) => void
}

type TodoStorePersist = (
  config: StateCreator<TodoStore>,
  options: PersistOptions<TodoStore>
) => StateCreator<TodoStore>

export const useStore = create<TodoStore>()(
  (persist as TodoStorePersist)(
    (set) => ({
      todos: [],
      addTodo: (title) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: nanoid(),
              title,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id 
              ? { ...todo, completed: !todo.completed, updatedAt: new Date() } 
              : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateTodo: (id, title) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id 
              ? { ...todo, title, updatedAt: new Date() } 
              : todo
          ),
        })),
    }),
    {
      name: 'todo-storage',
      version: 1,
    }
  )
)
