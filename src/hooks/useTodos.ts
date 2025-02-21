import { useCallback } from 'react'
import { useStore } from '../store'
import { Priority } from '../types/todo'

export const useAddTodo = () => {
  return useCallback((title: string, priority: Priority = Priority.MEDIUM) => {
    useStore.getState().addTodo(title, priority)
  }, [])
}

export const useToggleTodo = () => {
  return useCallback((id: string) => {
    useStore.getState().toggleTodo(id)
  }, [])
}

export const useDeleteTodo = () => {
  return useCallback((id: string) => {
    useStore.getState().deleteTodo(id)
  }, [])
}

export const useUpdateTodo = () => {
  return useCallback((id: string, title: string, priority: Priority) => {
    useStore.getState().updateTodo(id, title, priority)
  }, [])
}

export const useTodos = () => {
  const todos = useStore((state) => state.todos)
  return todos
}
