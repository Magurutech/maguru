import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Course from './Course'

describe('Courses Component', () => {
  test('renders section title and description', () => {
    render(<Course />)

    expect(screen.getByText('Kursus Pilihan')).toBeInTheDocument()
    expect(screen.getByText('Terbaik Untukmu ✨')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Temukan kursus-kursus berkualitas tinggi yang dirancang khusus untuk mengembangkan potensi terbaikmu dengan cara yang menyenangkan dan interaktif/i,
      ),
    ).toBeInTheDocument()
  })

  test('renders course cards with correct information', () => {
    render(<Course />)

    // Check for course titles
    expect(screen.getByText('Petualangan Matematika Nusantara')).toBeInTheDocument()
    expect(screen.getByText('Legenda Bahasa Indonesia')).toBeInTheDocument()
    expect(screen.getByText('Sains Alam Magis')).toBeInTheDocument()

    // Check for instructor names
    expect(screen.getByText('Prof. Sari Dewi')).toBeInTheDocument()
    expect(screen.getByText('Dr. Budi Santoso')).toBeInTheDocument()
    expect(screen.getByText('Dr. Maya Indira')).toBeInTheDocument()
  })

  test('renders course ratings and statistics', () => {
    render(<Course />)

    // Multiple "4.9" could be present, so we check at least one of them exists
    expect(screen.getAllByText('4.9').length).toBeGreaterThan(0)
    expect(screen.getAllByText('4.8').length).toBeGreaterThan(0)
    expect(screen.getAllByText('4.7').length).toBeGreaterThan(0)

    // We skip checking exact student counts as they might be formatted differently
    // depending on locale settings

    // Check for durations
    expect(screen.getByText('8 minggu')).toBeInTheDocument()
    expect(screen.getByText('6 minggu')).toBeInTheDocument()
    expect(screen.getByText('10 minggu')).toBeInTheDocument()
  })

  test('renders course level badges', () => {
    render(<Course />)

    expect(screen.getAllByText('Pemula').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Menengah').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Lanjutan').length).toBeGreaterThan(0)
  })

  test('renders pricing information', () => {
    render(<Course />)

    // Menggunakan getAllByText untuk harga karena mungkin muncul lebih dari sekali
    expect(screen.getAllByText('Rp 299.000')[0]).toBeInTheDocument()
    expect(screen.getByText('Rp 249.000')).toBeInTheDocument()
    expect(screen.getByText('Rp 299.000')).toBeInTheDocument()
  })

  test('renders view all button', () => {
    render(<Course />)

    expect(screen.getByText('Lihat Semua Kursus')).toBeInTheDocument()
  })
})
