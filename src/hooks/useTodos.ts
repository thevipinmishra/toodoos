import { useCallback } from 'react'
import { useStore } from '../store'
import { Priority, Todo } from '../types/todo'

export const useAddTodo = (): ((title: string, priority: Priority, projectId?: string) => void) => {
  return useCallback((title: string, priority: Priority = Priority.MEDIUM, projectId?: string) => {
    useStore.getState().addTodo(title, priority, projectId)
  }, [])
}

export const useToggleTodo = (): ((id: string) => void) => {
  return useCallback((id: string) => {
    useStore.getState().toggleTodo(id)
  }, [])
}

export const useDeleteTodo = (): ((id: string) => void) => {
  return useCallback((id: string) => {
    useStore.getState().deleteTodo(id)
  }, [])
}

export const useUpdateTodo = (): ((id: string, title: string, priority: Priority) => void) => {
  return useCallback((id: string, title: string, priority: Priority) => {
    useStore.getState().updateTodo(id, title, priority)
  }, [])
}

export const useTodos = (): Todo[] => {
  const todos = useStore((state) => state.todos)
  return todos
}
