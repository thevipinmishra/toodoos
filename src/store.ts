import { create, StateCreator } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { Todo, Priority } from './types/todo'
import { getCurrentDateTime } from './utils/date'

interface PersonStore {
  name: string
  setName: (name: string) => void
}

type PersonStorePersist = (
  config: StateCreator<PersonStore>,
  options: PersistOptions<PersonStore>
) => StateCreator<PersonStore>

export const usePersonStore = create<PersonStore>()(
  (persist as PersonStorePersist)(
    (set) => ({
      name: '',
      setName: (name) => set({ name }),
    }),
    {
      name: 'toodoos-meta',
      version: 1,
    }
  )
)

interface TodoStore {
  todos: Todo[]
  addTodo: (title: string, priority: Priority) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updateTodo: (id: string, title: string, priority: Priority) => void
}

type TodoStorePersist = (
  config: StateCreator<TodoStore>,
  options: PersistOptions<TodoStore>
) => StateCreator<TodoStore>

export const useStore = create<TodoStore>()(
  (persist as TodoStorePersist)(
    (set) => ({
      todos: [],
      addTodo: (title, priority = Priority.MEDIUM) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: nanoid(),
              title,
              priority,
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
              ? { ...todo, completed: !todo.completed, updatedAt: getCurrentDateTime() } 
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
    }),
    {
      name: 'todo-storage',
      version: 1,
    }
  )
)
