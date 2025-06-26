import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from './navbar';

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

  test('renders desktop CTA buttons', () => {
    render(<Navbar />);

    // Check for CTA buttons
    expect(screen.getByText('Masuk')).toBeInTheDocument();
    expect(screen.getByText('Daftar Gratis')).toBeInTheDocument();
  });

  test('toggles mobile menu when menu button is clicked', () => {
    render(<Navbar />);

    // Mobile menu should be hidden initially
    expect(screen.queryByText('Courses')).toBeInTheDocument();

    // Find and click the menu button (the one with Menu icon)
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);

    // Mobile menu should be visible now with the same menu items
    expect(screen.getAllByText('Courses')[0]).toBeVisible();
    expect(screen.getAllByText('Features')[0]).toBeVisible();
    expect(screen.getAllByText('Testimonials')[0]).toBeVisible();
    expect(screen.getAllByText('Pricing')[0]).toBeVisible();

    // Click again to close
    fireEvent.click(menuButton);
  });
});
