'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Nav = () => {
  const pathname = usePathname()
  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Handle nav visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide nav
        setNavVisible(false)
        setMobileMenuOpen(false) // Close mobile menu when hiding nav
      } else {
        // Scrolling up - show nav
        setNavVisible(true)
      }

      // Check if scrolled past top
      setIsScrolled(currentScrollY > 50)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navVisible ? 'translate-y-0' : '-translate-y-full'
      } ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
    >
      <div className={`${isScrolled ? '' : 'backdrop-blur-sm'}`}>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            {/* Logo */}
            <Link
              href='/'
              className={`text-xl font-bold tracking-wide hover:text-primary transition uppercase ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              Lucci Living
            </Link>

            {/* Navigation Links */}
            <div className='hidden md:flex items-center gap-8'>
              <Link
                href='/about'
                className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                  isScrolled ? 'text-black' : 'text-white'
                } ${isActive('/about') ? 'text-primary' : ''}`}
              >
                About
              </Link>
              <Link
                href='/contact'
                className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                  isScrolled ? 'text-black' : 'text-white'
                } ${isActive('/contact') ? 'text-primary' : ''}`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${isScrolled ? 'text-black' : 'text-white'}`}
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
                  className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                    isScrolled ? 'text-black' : 'text-white'
                  } ${isActive('/about') ? 'text-primary' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href='/contact'
                  className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                    isScrolled ? 'text-black' : 'text-white'
                  } ${isActive('/contact') ? 'text-primary' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
 }

export default Nav
