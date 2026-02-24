'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SearchNav = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white shadow-lg'>
      <div className='max-w-7xl mx-auto px-6 py-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link
            href='/'
            className='text-xl font-bold tracking-wide hover:text-primary transition text-black uppercase'
          >
            Lucci Living
          </Link>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              href='/about'
              className={`hover:text-primary transition uppercase tracking-wide text-sm text-black ${
                isActive('/about') ? 'text-primary' : ''
              }`}
            >
              About
            </Link>
            <Link
              href='/contact'
              className={`hover:text-primary transition uppercase tracking-wide text-sm text-black ${
                isActive('/contact') ? 'text-primary' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden text-black'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 pb-4'>
            <div className='flex flex-col gap-4'>
              <Link
                href='/about'
                className={`hover:text-primary transition uppercase tracking-wide text-sm text-black ${
                  isActive('/about') ? 'text-primary' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href='/contact'
                className={`hover:text-primary transition uppercase tracking-wide text-sm text-black ${
                  isActive('/contact') ? 'text-primary' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default SearchNav
