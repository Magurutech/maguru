import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';

// Mock Clerk hooks dan komponen
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isLoaded: true,
    user: {
      firstName: 'Test',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      id: 'user_123',
      createdAt: new Date().toISOString(),
    },
  }),
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

describe('Dashboard Page', () => {
  it('menampilkan halaman dashboard dengan informasi user', () => {
    render(<DashboardPage />);

    // Cek elemen-elemen utama
    expect(screen.getByText(/Selamat datang, Test!/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user_123/i)).toBeInTheDocument();
    expect(screen.getByTestId('user-button')).toBeInTheDocument();

    // Cek header utama
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    // Sidebar menu: pastikan ada lebih dari satu 'Dashboard'
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(1);
    expect(screen.getByText('Kursus Terbaru')).toBeInTheDocument();
    expect(screen.getByText('Aktivitas Terbaru')).toBeInTheDocument();
  });
});
