'use client'

/**
 * User Role Context Provider
 *
 * React Context untuk mengelola user role state dengan Supabase Auth:
 * - Realtime auth state listener via supabase.auth.onAuthStateChange
 * - Fast role resolution dari app_metadata / user_metadata
 * - Error boundary & graceful failure handling
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRoleContextType, UserRoleState, UserRoleProviderProps, UserRole } from '../types'

export const DEFAULT_ROLE: UserRole = 'user'

type RoleAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ROLE' }

const initialState: UserRoleState = {
  role: null,
  isLoading: true,
  error: null,
  lastUpdated: null,
}

const roleReducer = (state: UserRoleState, action: RoleAction): UserRoleState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'CLEAR_ROLE':
      return {
        ...state,
        role: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
      }
    default:
      return state
  }
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export function UserRoleProvider({
  children,
  devMode = { enabled: false, allowRoleSwitching: false },
}: UserRoleProviderProps) {
  const [state, dispatch] = useReducer(roleReducer, initialState)

  useEffect(() => {
    const supabase = createClient()

    // Initial user fetch
    const fetchUserRole = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          dispatch({ type: 'CLEAR_ROLE' })
          return
        }

        const role = (user.app_metadata?.role || user.user_metadata?.role || DEFAULT_ROLE) as UserRole
        dispatch({ type: 'SET_ROLE', payload: role })
      } catch (err) {
        console.error('Error fetching user role from Supabase:', err)
        dispatch({ type: 'SET_ROLE', payload: DEFAULT_ROLE })
      }
    }

    fetchUserRole()

    // Realtime auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = (session.user.app_metadata?.role || session.user.user_metadata?.role || DEFAULT_ROLE) as UserRole
        dispatch({ type: 'SET_ROLE', payload: role })
      } else {
        dispatch({ type: 'CLEAR_ROLE' })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const setRole = useCallback((role: UserRole) => {
    dispatch({ type: 'SET_ROLE', payload: role })
  }, [])

  const clearRole = useCallback(() => {
    dispatch({ type: 'CLEAR_ROLE' })
  }, [])

  const refreshRole = useCallback(async (): Promise<void> => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const role = (user?.app_metadata?.role || user?.user_metadata?.role || DEFAULT_ROLE) as UserRole
      dispatch({ type: 'SET_ROLE', payload: role })
    } catch {
      dispatch({ type: 'SET_ROLE', payload: DEFAULT_ROLE })
    }
  }, [])

  const updateRoleCache = useCallback((role: UserRole) => {
    dispatch({ type: 'SET_ROLE', payload: role })
  }, [])

  const contextValue = useMemo<UserRoleContextType>(
    () => ({
      ...state,
      setRole,
      clearRole,
      refreshRole,
      updateRoleCache,
      devMode: {
        ...devMode,
        switchRole: setRole,
      },
    }),
    [state, setRole, clearRole, refreshRole, updateRoleCache, devMode],
  )

  return <UserRoleContext.Provider value={contextValue}>{children}</UserRoleContext.Provider>
}

export function useUserRoleContext(): UserRoleContextType {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error('useUserRoleContext must be used within a UserRoleProvider')
  }
  return context
}
