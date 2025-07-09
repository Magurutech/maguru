/**
 * CourseContext - Feature Context untuk Course Management
 *
 * @description
 * Context untuk mengelola state UI/UX yang perlu diakses lintas komponen dalam fitur course.
 * Mengikuti arsitektur Maguru untuk feature context dengan:
 * - Dialog state management (create, edit, delete)
 * - Form state management untuk dialog
 * - Search/filter state yang mempengaruhi multiple komponen
 * - File upload state untuk thumbnail
 *
 * State data kursus (courses, isLoading, dsb) tetap di hook (useCourseManagement),
 * context hanya untuk state UI/UX yang perlu diakses lintas komponen.
 */

'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useMemo,
} from 'react'
import type { Course, CreateCourseFormData, CourseStatus } from '../types'
// import { logger } from '@/services/logger'

// Dialog types
type DialogType = 'create' | 'edit' | 'delete' | null

// Form state interface
interface FormState {
  data: CreateCourseFormData
  errors: string[]
  isValid: boolean
  isSubmitting: boolean
}

// Context state interface
interface CourseContextState {
  // Dialog state
  activeDialog: DialogType
  selectedCourse: Course | null

  // Form state
  formState: FormState

  // Search/filter state (global untuk mempengaruhi grid, stats, dsb)
  searchQuery: string
  selectedStatus: string
  hasActiveFilters: boolean
}

// Context actions
type CourseContextAction =
  | { type: 'OPEN_CREATE_DIALOG' }
  | { type: 'OPEN_EDIT_DIALOG'; payload: Course }
  | { type: 'OPEN_DELETE_DIALOG'; payload: Course }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<CreateCourseFormData> }
  | { type: 'SET_FORM_ERRORS'; payload: string[] }
  | { type: 'SET_FORM_VALID'; payload: boolean }
  | { type: 'SET_FORM_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_STATUS'; payload: string }
  | { type: 'CLEAR_FILTERS' }

// Initial form state
const initialFormState: FormState = {
  data: {
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    status: 'DRAFT' as CourseStatus,
  },
  errors: [],
  isValid: false,
  isSubmitting: false,
}

// Initial context state
const initialState: CourseContextState = {
  // Dialog state
  activeDialog: null,
  selectedCourse: null,

  // Form state
  formState: initialFormState,

  // Search/filter state
  searchQuery: '',
  selectedStatus: 'all',
  hasActiveFilters: false,
}

// Reducer function
function courseContextReducer(
  state: CourseContextState,
  action: CourseContextAction,
): CourseContextState {
  switch (action.type) {
    case 'OPEN_CREATE_DIALOG':
      return {
        ...state,
        activeDialog: 'create',
        selectedCourse: null,
        formState: initialFormState,
      }

    case 'OPEN_EDIT_DIALOG':
      return {
        ...state,
        activeDialog: 'edit',
        selectedCourse: action.payload,
        formState: {
          ...initialFormState,
          data: {
            title: action.payload.title || '',
            description: action.payload.description || '',
            thumbnail: action.payload.thumbnail || '',
            category: action.payload.category || '',
            status: action.payload.status || 'DRAFT',
          },
          isValid: true, // Assume valid since it's existing data
        },
      }

    case 'OPEN_DELETE_DIALOG':
      return {
        ...state,
        activeDialog: 'delete',
        selectedCourse: action.payload,
      }

    case 'CLOSE_DIALOG':
      return {
        ...state,
        activeDialog: null,
        selectedCourse: null,
        formState: initialFormState,
      }

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formState: {
          ...state.formState,
          data: { ...state.formState.data, ...action.payload },
        },
      }

    case 'SET_FORM_ERRORS':
      return {
        ...state,
        formState: {
          ...state.formState,
          errors: action.payload,
        },
      }

    case 'SET_FORM_VALID':
      return {
        ...state,
        formState: {
          ...state.formState,
          isValid: action.payload,
        },
      }

    case 'SET_FORM_SUBMITTING':
      return {
        ...state,
        formState: {
          ...state.formState,
          isSubmitting: action.payload,
        },
      }

    case 'RESET_FORM':
      return {
        ...state,
        formState: initialFormState,
      }

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        hasActiveFilters: action.payload !== '' || state.selectedStatus !== 'all',
      }

    case 'SET_SELECTED_STATUS':
      return {
        ...state,
        selectedStatus: action.payload,
        hasActiveFilters: state.searchQuery !== '' || action.payload !== 'all',
      }

    case 'CLEAR_FILTERS':
      return {
        ...state,
        searchQuery: '',
        selectedStatus: 'all',
        hasActiveFilters: false,
      }

    default:
      return state
  }
}

// Context interface
interface CourseContextValue extends CourseContextState {
  // Dialog actions
  openCreateDialog: () => void
  openEditDialog: (course: Course) => void
  openDeleteDialog: (course: Course) => void
  closeDialog: () => void

  // Form actions
  updateFormData: (data: Partial<CreateCourseFormData>) => void
  setFormErrors: (errors: string[]) => void
  setFormValid: (isValid: boolean) => void
  setFormSubmitting: (isSubmitting: boolean) => void
  resetForm: () => void

  // Search/filter actions
  setSearchQuery: (query: string) => void
  setSelectedStatus: (status: string) => void
  clearFilters: () => void

  // Utility functions
  getFormErrors: () => string[]
  hasFormChanges: (originalData?: Partial<Course>) => boolean
  isSelectedCourseValid: () => boolean
}

// Create context
const CourseContext = createContext<CourseContextValue | undefined>(undefined)

// Provider component
interface CourseContextProviderProps {
  children: ReactNode
}

export function CourseContextProvider({ children }: CourseContextProviderProps) {
  const [state, dispatch] = useReducer(courseContextReducer, initialState)

  // Dialog actions
  const openCreateDialog = useCallback(() => {
    dispatch({ type: 'OPEN_CREATE_DIALOG' })
  }, [])

  const openEditDialog = useCallback((course: Course) => {
    dispatch({ type: 'OPEN_EDIT_DIALOG', payload: course })
  }, [])

  const openDeleteDialog = useCallback((course: Course) => {
    dispatch({ type: 'OPEN_DELETE_DIALOG', payload: course })
  }, [])

  const closeDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_DIALOG' })
  }, [])

  // Form actions
  const updateFormData = useCallback((data: Partial<CreateCourseFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data })
  }, [])

  const setFormErrors = useCallback((errors: string[]) => {
    dispatch({ type: 'SET_FORM_ERRORS', payload: errors })
  }, [])

  const setFormValid = useCallback((isValid: boolean) => {
    dispatch({ type: 'SET_FORM_VALID', payload: isValid })
  }, [])

  const setFormSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_FORM_SUBMITTING', payload: isSubmitting })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  // Search/filter actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const setSelectedStatus = useCallback((status: string) => {
    dispatch({ type: 'SET_SELECTED_STATUS', payload: status })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  // Utility functions
  const getFormErrors = useCallback((): string[] => {
    return state.formState.errors
  }, [state.formState.errors])

  const hasFormChanges = useCallback(
    (originalData?: Partial<Course>): boolean => {
      if (!originalData) return true // If no original data, assume there are changes

      const currentData = state.formState.data

      return (
        currentData.title !== originalData.title ||
        currentData.description !== originalData.description ||
        currentData.thumbnail !== originalData.thumbnail ||
        currentData.category !== originalData.category ||
        currentData.status !== originalData.status
      )
    },
    [state.formState.data],
  )

  const isSelectedCourseValid = useCallback((): boolean => {
    return state.selectedCourse !== null && state.selectedCourse.id !== undefined
  }, [state.selectedCourse])

  // Context value dengan memoization untuk mencegah re-render berlebihan
  const contextValue: CourseContextValue = useMemo(
    () => ({
    // State
    ...state,

    // Dialog actions
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,

    // Form actions
    updateFormData,
    setFormErrors,
    setFormValid,
    setFormSubmitting,
    resetForm,

    // Search/filter actions
    setSearchQuery,
    setSelectedStatus,
    clearFilters,

    // Utility functions
    getFormErrors,
    hasFormChanges,
      isSelectedCourseValid,
    }),
    [
      state,
      openCreateDialog,
      openEditDialog,
      openDeleteDialog,
      closeDialog,
      updateFormData,
      setFormErrors,
      setFormValid,
      setFormSubmitting,
      resetForm,
      setSearchQuery,
      setSelectedStatus,
      clearFilters,
      getFormErrors,
      hasFormChanges,
      isSelectedCourseValid,
    ],
  )

  return <CourseContext.Provider value={contextValue}>{children}</CourseContext.Provider>
}

// Hook untuk menggunakan context
export function useCourseContext(): CourseContextValue {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseContextProvider')
  }
  return context
}
