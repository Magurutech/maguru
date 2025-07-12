/**
 * CourseContext - Feature Context untuk Course Management
 *
 * @description
 * Context untuk mengelola state UI/UX yang perlu diakses lintas komponen dalam fitur course.
 * Mengikuti arsitektur Maguru untuk feature context dengan:
 * - Dialog state management (create, edit, delete, enrollment)
 * - Form state management untuk dialog
 * - Search/filter state yang mempengaruhi multiple komponen
 * - File upload state untuk thumbnail
 * - Enrollment dialog state management
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
type DialogType = 'create' | 'edit' | 'delete' | 'enrollment' | null

// Form state interface
interface FormState {
  data: CreateCourseFormData
  errors: string[]
  isValid: boolean
  isSubmitting: boolean
}

// Enrollment dialog state interface
interface EnrollmentDialogState {
  isOpen: boolean
  courseId: string | null
  courseTitle: string | null
  isLoading: boolean
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
  selectedCategory: string
  hasActiveFilters: boolean

  // Enrollment dialog state
  enrollmentDialog: EnrollmentDialogState
}

// Context actions
type CourseContextAction =
  | { type: 'OPEN_CREATE_DIALOG' }
  | { type: 'OPEN_EDIT_DIALOG'; payload: Course }
  | { type: 'OPEN_DELETE_DIALOG'; payload: Course }
  | { type: 'OPEN_ENROLLMENT_DIALOG'; payload: { courseId: string; courseTitle: string } }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<CreateCourseFormData> }
  | { type: 'SET_FORM_ERRORS'; payload: string[] }
  | { type: 'SET_FORM_VALID'; payload: boolean }
  | { type: 'SET_FORM_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_STATUS'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_ENROLLMENT_LOADING'; payload: boolean }
  | { type: 'CLOSE_ENROLLMENT_DIALOG' }

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

// Initial enrollment dialog state
const initialEnrollmentDialogState: EnrollmentDialogState = {
  isOpen: false,
  courseId: null,
  courseTitle: null,
  isLoading: false,
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
  selectedCategory: 'All',
  hasActiveFilters: false,

  // Enrollment dialog state
  enrollmentDialog: initialEnrollmentDialogState,
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

    case 'OPEN_ENROLLMENT_DIALOG':
      return {
        ...state,
        activeDialog: 'enrollment',
        enrollmentDialog: {
          isOpen: true,
          courseId: action.payload.courseId,
          courseTitle: action.payload.courseTitle,
          isLoading: false,
        },
      }

    case 'CLOSE_DIALOG':
      return {
        ...state,
        activeDialog: null,
        selectedCourse: null,
        formState: initialFormState,
        enrollmentDialog: initialEnrollmentDialogState,
      }

    case 'CLOSE_ENROLLMENT_DIALOG':
      return {
        ...state,
        activeDialog: null,
        enrollmentDialog: initialEnrollmentDialogState,
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
        hasActiveFilters:
          action.payload !== '' ||
          state.selectedStatus !== 'all' ||
          state.selectedCategory !== 'All',
      }

    case 'SET_SELECTED_STATUS':
      return {
        ...state,
        selectedStatus: action.payload,
        hasActiveFilters:
          state.searchQuery !== '' || action.payload !== 'all' || state.selectedCategory !== 'All',
      }

    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        hasActiveFilters:
          state.searchQuery !== '' || state.selectedStatus !== 'all' || action.payload !== 'All',
      }

    case 'CLEAR_FILTERS':
      return {
        ...state,
        searchQuery: '',
        selectedStatus: 'all',
        selectedCategory: 'All',
        hasActiveFilters: false,
      }

    case 'SET_ENROLLMENT_LOADING':
      return {
        ...state,
        enrollmentDialog: {
          ...state.enrollmentDialog,
          isLoading: action.payload,
        },
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
  openEnrollmentDialog: (courseId: string, courseTitle: string) => void
  closeDialog: () => void
  closeEnrollmentDialog: () => void

  // Form actions
  updateFormData: (data: Partial<CreateCourseFormData>) => void
  setFormErrors: (errors: string[]) => void
  setFormValid: (isValid: boolean) => void
  setFormSubmitting: (isSubmitting: boolean) => void
  resetForm: () => void

  // Search/filter actions
  setSearchQuery: (query: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedCategory: (category: string) => void
  clearFilters: () => void

  // Enrollment actions
  setEnrollmentLoading: (isLoading: boolean) => void

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

  const openEnrollmentDialog = useCallback((courseId: string, courseTitle: string) => {
    dispatch({ type: 'OPEN_ENROLLMENT_DIALOG', payload: { courseId, courseTitle } })
  }, [])

  const closeDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_DIALOG' })
  }, [])

  const closeEnrollmentDialog = useCallback(() => {
    dispatch({ type: 'CLOSE_ENROLLMENT_DIALOG' })
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

  const setSelectedCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  // Enrollment actions
  const setEnrollmentLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_ENROLLMENT_LOADING', payload: isLoading })
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
      openEnrollmentDialog,
      closeDialog,
      closeEnrollmentDialog,

      // Form actions
      updateFormData,
      setFormErrors,
      setFormValid,
      setFormSubmitting,
      resetForm,

      // Search/filter actions
      setSearchQuery,
      setSelectedStatus,
      setSelectedCategory,
      clearFilters,

      // Enrollment actions
      setEnrollmentLoading,

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
      openEnrollmentDialog,
      closeDialog,
      closeEnrollmentDialog,
      updateFormData,
      setFormErrors,
      setFormValid,
      setFormSubmitting,
      resetForm,
      setSearchQuery,
      setSelectedStatus,
      setSelectedCategory,
      clearFilters,
      setEnrollmentLoading,
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
