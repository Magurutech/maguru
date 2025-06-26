import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from './Navbar';

describe('Navbar Component', () => {
  test('renders logo and brand name', () => {
    render(<Navbar />);

    // Check if the brand name is rendered
    expect(screen.getByText('Maguru')).toBeInTheDocument();

    // Check for BookOpen icon (indirectly by checking its container)
    const logoContainer = screen.getByText('Maguru').previousSibling;
    expect(logoContainer).toBeInTheDocument();
  });

  test('renders desktop menu items', () => {
    render(<Navbar />);

    // Check for desktop menu items
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  test('renders desktop CTA buttons as links', () => {
    render(<Navbar />);
    const masuk = screen.getAllByText('Masuk')[0];
    const daftar = screen.getAllByText('Daftar Gratis')[0];
    expect(masuk.closest('a')).toHaveAttribute('href', '/sign-in');
    expect(daftar.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  test('toggles mobile menu and links close menu on click', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    // Mobile menu should be visible
    expect(screen.getAllByText('Courses')[1]).toBeVisible();
    // Cek link Masuk dan Daftar Gratis di mobile
    const masukMobile = screen.getAllByText('Masuk')[1];
    const daftarMobile = screen.getAllByText('Daftar Gratis')[1];
    expect(masukMobile.closest('a')).toHaveAttribute('href', '/sign-in');
    expect(daftarMobile.closest('a')).toHaveAttribute('href', '/sign-up');
    // Klik link harus menutup menu (simulate click)
    fireEvent.click(masukMobile);
    // Menu harus tertutup (tidak ada lagi menu mobile)
    expect(screen.queryByText('Courses', { selector: 'a.block' })).not.toBeInTheDocument();
  });
});
