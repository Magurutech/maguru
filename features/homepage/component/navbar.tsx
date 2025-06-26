'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Maguru
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#courses"
              className="text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Courses
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Pricing
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-primary">
              Masuk
            </Button>
            <Button className="neu-button bg-gradient-to-r from-primary to-secondary text-white px-6">
              Daftar Gratis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <a
              href="#courses"
              className="block text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Courses
            </a>
            <a
              href="#features"
              className="block text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="block text-gray-700 hover:text-primary transition-colors duration-150"
            >
              Pricing
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="justify-start">
                Masuk
              </Button>
              <Button className="neu-button bg-gradient-to-r from-primary to-secondary text-white">
                Daftar Gratis
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
