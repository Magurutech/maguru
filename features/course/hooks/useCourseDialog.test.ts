/**
 * Unit Test: useCourseDialog Hook
 *
 * @description
 * Test suite untuk useCourseDialog hook yang mencakup:
 * - Dialog state management (create, edit, delete)
 * - Form data management dan validation
 * - File upload handling
 * - Error handling dan fallback mechanisms
 *
 * Mengikuti TDD approach dan Designing for Failure principles
 */

import { renderHook, act } from '@testing-library/react'
import { useCourseDialog } from './useCourseDialog'
import { validateCourseData } from '../lib/courseUtils'
import type { Course } from '../types'

// Mock courseUtils
jest.mock('../lib/courseUtils', () => ({
  validateCourseData: jest.fn(),
}))

const mockValidateCourseData = validateCourseData as jest.MockedFunction<typeof validateCourseData>

// Test data
const mockCourse: Course = {
  id: 'course-1',
  title: 'Test Course',
  description: 'Test Description',
  thumbnail: '/test-thumbnail.jpg',
  category: 'Programming',
  status: 'DRAFT',
  students: 0,
  lessons: 0,
  duration: '0',
  rating: 0,
  creatorId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('useCourseDialog Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock implementation
    mockValidateCourseData.mockReturnValue({
      isValid: true,
      errors: [],
    })
  })

  describe('Initial State', () => {
    test('should initialize with default state', () => {
      const { result } = renderHook(() => useCourseDialog())

      expect(result.current.activeDialog).toBeNull()
      expect(result.current.selectedCourse).toBeNull()
      expect(result.current.formState.data).toEqual({
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        status: 'DRAFT',
      })
      expect(result.current.formState.errors).toEqual([])
      expect(result.current.formState.isValid).toBe(false)
      expect(result.current.formState.isSubmitting).toBe(false)
    })
  })

  describe('Dialog State Management', () => {
    test('should open create dialog correctly', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.openCreateDialog()
      })

      expect(result.current.activeDialog).toBe('create')
      expect(result.current.selectedCourse).toBeNull()
      expect(result.current.formState.data).toEqual({
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        status: 'DRAFT',
      })
    })

    test('should open edit dialog with course data', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.openEditDialog(mockCourse)
      })

      expect(result.current.activeDialog).toBe('edit')
      expect(result.current.selectedCourse).toEqual(mockCourse)
      expect(result.current.formState.data).toEqual({
        title: mockCourse.title,
        description: mockCourse.description,
        thumbnail: mockCourse.thumbnail || '',
        category: mockCourse.category,
        status: mockCourse.status,
      })
      expect(result.current.formState.isValid).toBe(true)
    })

    test('should open delete dialog with course data', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.openDeleteDialog(mockCourse)
      })

      expect(result.current.activeDialog).toBe('delete')
      expect(result.current.selectedCourse).toEqual(mockCourse)
    })

    test('should close dialog and reset state', () => {
      const { result } = renderHook(() => useCourseDialog())

      // Open dialog first
      act(() => {
        result.current.openEditDialog(mockCourse)
      })

      expect(result.current.activeDialog).toBe('edit')

      // Close dialog
      act(() => {
        result.current.closeDialog()
      })

      expect(result.current.activeDialog).toBeNull()
      expect(result.current.selectedCourse).toBeNull()
      expect(result.current.formState.data).toEqual({
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        status: 'DRAFT',
      })
    })
  })

  describe('Form State Management', () => {
    test('should update form data correctly', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: true,
        errors: [],
      })

      act(() => {
        result.current.updateFormData({ title: 'Updated Title' })
      })

      expect(result.current.formState.data.title).toBe('Updated Title')
      expect(mockValidateCourseData).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: '',
        thumbnail: '',
        category: '',
        status: 'DRAFT',
      })
    })

    test('should handle validation errors in form update', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: false,
        errors: ['Title is required'],
      })

      act(() => {
        result.current.updateFormData({ title: '' })
      })

      expect(result.current.formState.errors).toEqual(['Title is required'])
      expect(result.current.formState.isValid).toBe(false)
    })

    test('should reset form to initial state', () => {
      const { result } = renderHook(() => useCourseDialog())

      // Update form first
      act(() => {
        result.current.updateFormData({ title: 'Test Title' })
      })

      expect(result.current.formState.data.title).toBe('Test Title')

      // Reset form
      act(() => {
        result.current.resetForm()
      })

      expect(result.current.formState.data).toEqual({
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        status: 'DRAFT',
      })
      expect(result.current.formState.errors).toEqual([])
      expect(result.current.formState.isValid).toBe(false)
    })

    test('should set submitting state correctly', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.setSubmitting(true)
      })

      expect(result.current.formState.isSubmitting).toBe(true)

      act(() => {
        result.current.setSubmitting(false)
      })

      expect(result.current.formState.isSubmitting).toBe(false)
    })
  })

  describe('Form Validation', () => {
    test('should validate form with valid data', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: true,
        errors: [],
      })

      let isValid = false
      act(() => {
        isValid = result.current.validateForm()
      })

      expect(isValid).toBe(true)
      expect(result.current.formState.isValid).toBe(true)
      expect(result.current.formState.errors).toEqual([])
    })

    test('should validate form with invalid data', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: false,
        errors: ['Title is required', 'Description is required'],
      })

      let isValid = false
      act(() => {
        isValid = result.current.validateForm()
      })

      expect(isValid).toBe(false)
      expect(result.current.formState.isValid).toBe(false)
      expect(result.current.formState.errors).toEqual([
        'Title is required',
        'Description is required',
      ])
    })

    test('should check form changes against original data', () => {
      const { result } = renderHook(() => useCourseDialog())

      // Open edit dialog with course data
      act(() => {
        result.current.openEditDialog(mockCourse)
      })

      // No changes initially
      expect(result.current.hasFormChanges(mockCourse)).toBe(false)

      // Make changes
      act(() => {
        result.current.updateFormData({ title: 'Changed Title' })
      })

      expect(result.current.hasFormChanges(mockCourse)).toBe(true)
    })

    test('should handle hasFormChanges with no original data', () => {
      const { result } = renderHook(() => useCourseDialog())

      // Should return true when no original data provided
      expect(result.current.hasFormChanges()).toBe(true)
    })
  })

  describe('File Upload Handling', () => {
    test('should handle valid file upload', async () => {
      const { result } = renderHook(() => useCourseDialog())

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      let uploadResult: string | null = null
      await act(async () => {
        uploadResult = await result.current.handleFileUpload(mockFile)
      })

      // Sekarang menggunakan base64, bukan file path
      expect(uploadResult).toMatch(/^data:image\/jpeg;base64,/)
      expect(result.current.formState.data.thumbnail).toMatch(/^data:image\/jpeg;base64,/)
    })

    test('should reject invalid file types', async () => {
      const { result } = renderHook(() => useCourseDialog())

      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      let uploadResult: string | null = null
      await act(async () => {
        uploadResult = await result.current.handleFileUpload(mockFile)
      })

      expect(uploadResult).toBeNull()
      expect(result.current.formState.data.thumbnail).toBe('')
    })

    test('should reject oversized files', async () => {
      const { result } = renderHook(() => useCourseDialog())

      // Create a file larger than 5MB
      const mockFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      let uploadResult: string | null = null
      await act(async () => {
        uploadResult = await result.current.handleFileUpload(mockFile)
      })

      expect(uploadResult).toBeNull()
      expect(result.current.formState.data.thumbnail).toBe('')
    })

    test('should remove thumbnail correctly', () => {
      const { result } = renderHook(() => useCourseDialog())

      // Set thumbnail first
      act(() => {
        result.current.updateFormData({ thumbnail: '/test-thumbnail.jpg' })
      })

      expect(result.current.formState.data.thumbnail).toBe('/test-thumbnail.jpg')

      // Remove thumbnail
      act(() => {
        result.current.removeThumbnail()
      })

      expect(result.current.formState.data.thumbnail).toBe('')
    })

    test('should handle file upload errors gracefully', async () => {
      const { result } = renderHook(() => useCourseDialog())

      // Mock a file that would cause an error by making it invalid
      const mockFile = new File(['test'], 'error.txt', { type: 'text/plain' })

      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      let uploadResult: string | null = null
      await act(async () => {
        uploadResult = await result.current.handleFileUpload(mockFile)
      })

      expect(uploadResult).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    test('should handle validation errors gracefully', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockImplementation(() => {
        throw new Error('Validation error')
      })

      act(() => {
        result.current.updateFormData({ title: 'Test' })
      })

      expect(result.current.formState.errors).toEqual(['Terjadi kesalahan saat validasi data'])
      expect(result.current.formState.isValid).toBe(false)
    })

    test('should provide clear error messages', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: false,
        errors: ['Title is required', 'Description is required'],
      })

      act(() => {
        result.current.updateFormData({ title: '' })
      })

      const errors = result.current.getFormErrors()
      expect(errors).toEqual(['Title is required', 'Description is required'])
    })
  })

  describe('Utility Functions', () => {
    test('should get form errors correctly', () => {
      const { result } = renderHook(() => useCourseDialog())

      mockValidateCourseData.mockReturnValue({
        isValid: false,
        errors: ['Error 1', 'Error 2'],
      })

      act(() => {
        result.current.updateFormData({ title: '' })
      })

      expect(result.current.getFormErrors()).toEqual(['Error 1', 'Error 2'])
    })

    test('should handle form changes detection', () => {
      const { result } = renderHook(() => useCourseDialog())

      const originalData = {
        title: 'Original Title',
        description: 'Original Description',
        thumbnail: '/original.jpg',
        category: 'Programming',
        status: 'DRAFT' as const,
      }

      // No changes
      expect(result.current.hasFormChanges(originalData)).toBe(true) // Because form is empty initially

      // Set form data to match original
      act(() => {
        result.current.updateFormData(originalData)
      })

      expect(result.current.hasFormChanges(originalData)).toBe(false)

      // Make a change
      act(() => {
        result.current.updateFormData({ title: 'Changed Title' })
      })

      expect(result.current.hasFormChanges(originalData)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle null/undefined course data', () => {
      const { result } = renderHook(() => useCourseDialog())

      const courseWithNullFields = {
        ...mockCourse,
        thumbnail: null,
        description: undefined,
      }

      act(() => {
        result.current.openEditDialog(courseWithNullFields as unknown as Course)
      })

      expect(result.current.formState.data.thumbnail).toBe('')
      expect(result.current.formState.data.description).toBe('')
    })

    test('should handle rapid state changes', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.openCreateDialog()
        result.current.openEditDialog(mockCourse)
        result.current.openDeleteDialog(mockCourse)
        result.current.closeDialog()
      })

      expect(result.current.activeDialog).toBeNull()
      expect(result.current.selectedCourse).toBeNull()
    })

    test('should handle concurrent form updates', () => {
      const { result } = renderHook(() => useCourseDialog())

      act(() => {
        result.current.updateFormData({ title: 'Title 1' })
        result.current.updateFormData({ description: 'Description 1' })
        result.current.updateFormData({ category: 'Category 1' })
      })

      expect(result.current.formState.data).toEqual({
        title: 'Title 1',
        description: 'Description 1',
        thumbnail: '',
        category: 'Category 1',
        status: 'DRAFT',
      })
    })
  })
})
