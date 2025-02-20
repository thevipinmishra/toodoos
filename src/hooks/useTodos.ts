import { useCallback } from 'react'
import { useStore } from '../store'

export const useAddTodo = () => {
  return useCallback((title: string) => {
    useStore.getState().addTodo(title)
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
  return useCallback((id: string, title: string) => {
    useStore.getState().updateTodo(id, title)
  }, [])
}

export const useTodos = () => {
  const todos = useStore((state) => state.todos)
  return todos
}
