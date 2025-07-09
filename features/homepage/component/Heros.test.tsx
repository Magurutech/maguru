import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Heros } from './Heros'

describe('Hero Component', () => {
  test('renders headline and main call-to-action', () => {
    render(<Heros />)

    // Check for headline content
    expect(screen.getByText(/Petualangan Belajar/i)).toBeInTheDocument()
    expect(screen.getByText(/Dimulai di Sini!/i)).toBeInTheDocument()

    // Check for description
    expect(
      screen.getByText(/Bergabunglah dalam perjalanan magis menuju pengetahuan dengan/i),
    ).toBeInTheDocument()

    // Check for call-to-action buttons
    expect(screen.getByText('🚀 Mulai Petualangan')).toBeInTheDocument()
    expect(screen.getByText('🎯 Jelajahi Kursus')).toBeInTheDocument()
  })

  test('renders social proof elements', () => {
    render(<Heros />)

    // Check for social proof statistics
    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('Siswa Aktif')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Kursus Berkualitas')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
    expect(screen.getByText('Kepuasan Siswa')).toBeInTheDocument()
  })
})
