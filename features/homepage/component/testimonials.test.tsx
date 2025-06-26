import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Testimonials } from './Testimonials';

describe('Testimonials Component', () => {
  test('renders section title and description', () => {
    render(<Testimonials />);

    expect(screen.getByText('Apa Kata')).toBeInTheDocument();
    expect(screen.getByText('Alumni?')).toBeInTheDocument();
    expect(
      screen.getByText(/Dengarkan cerita sukses dari ribuan alumni Maguru/i),
    ).toBeInTheDocument();
  });

  test('renders all testimonial cards with correct names and roles', () => {
    render(<Testimonials />);

    // Check testimonial names and roles
    expect(screen.getByText('Sarah Wijaya')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer at Tokopedia')).toBeInTheDocument();

    expect(screen.getByText('Ahmad Rizki')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Designer at Gojek')).toBeInTheDocument();

    expect(screen.getByText('Lisa Chen')).toBeInTheDocument();
    expect(screen.getByText('Digital Marketing Manager')).toBeInTheDocument();
  });

  test('renders testimonial quotes correctly', () => {
    render(<Testimonials />);

    // Check testimonial quotes
    expect(
      screen.getByText(
        /Maguru benar-benar mengubah karir saya. Dari yang tidak tahu coding sama sekali/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Course UI\/UX di Maguru sangat comprehensive. Tidak hanya teori/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Sebagai career changer, saya butuh pembelajaran yang terstruktur/i),
    ).toBeInTheDocument();
  });

  test('renders 5-star ratings for all testimonials', () => {
    render(<Testimonials />);

    // Count star icons (5 per testimonial, 3 testimonials)
    const starIcons = document.querySelectorAll('.text-accent-orange.fill-current');
    expect(starIcons.length).toBe(15); // 5 stars × 3 testimonials
  });
});
