'use client'

import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Nav from './components/Nav'

export default function NewHome() {
  const [parallaxOffset, setParallaxOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Handle parallax effect - hero scrolls at 5% speed
      setParallaxOffset(currentScrollY * 0.05)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div className='w-full h-full relative'>
      {/* Hero Background - Fixed position for parallax */}
      <div className='fixed inset-0 z-0 overflow-hidden'>
        <img
          src='/home-header.webp'
          alt='Hero background'
          className='absolute w-full min-h-screen object-cover'
          style={{
            top: 0,
            transform: `translateY(-${parallaxOffset}px)`,
            height: 'calc(100vh + 400px)'
          }}
        />
        <div className='absolute inset-0 bg-black' style={{ opacity: 0.8 }} />
      </div>

      {/* Content Container */}
      <div className='relative z-10'>
        <Nav />

        {/* Hero Content Section */}
        <div className='relative w-full h-screen flex items-center justify-center'>
          <div className='text-center px-6'>
            <img
              src='/lucci-title.svg'
              alt='Lucci Living'
              className='w-[350px] md:w-[600px] lg:w-[1050px] h-auto mx-auto'
            />
          </div>
        </div>

        {/* Realtor Section */}
        <div className='relative bg-white'>
          <div className='max-w-7xl mx-auto px-6 py-16 lg:py-24'>
            <div className='flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto'>
              <div className='w-full lg:w-1/2 flex justify-center'>
                <img
                  src='/lucci-profile.png'
                  alt='Chris Lucci'
                  className='rounded-lg shadow-xl w-full max-w-md object-cover'
                />
              </div>
              <div className='w-full lg:w-1/2'>
                <h2 className='text-3xl lg:text-5xl tracking-wide mb-2'>
                  Chris Lucci
                </h2>
                <h3 className='text-lg lg:text-xl tracking-wide text-primary mb-6'>
                  Your Home, Your Way
                </h3>
                <p className='text-lg text-gray-700 leading-relaxed mb-4'>
                  Finding your dream home should be exciting &mdash; not stressful. Chris Lucci is here to take
                  the hassle out of home buying so you can focus on what matters: discovering the place
                  you&apos;ll love coming home to.
                </p>
                <p className='text-lg text-gray-700 leading-relaxed mb-4'>
                  With Chris, the process isn&apos;t just smooth &mdash; it&apos;s fun. From your first conversation to
                  the moment you get your keys, he makes every step feel easy, personal, and genuinely
                  enjoyable.
                </p>
                <p className='text-lg text-gray-700 leading-relaxed mb-8'>
                  Buying a home should be one of the best experiences of your life, and with Lucci Living at your side, it will be.
                </p>
                <a
                  href='/contact'
                  className='inline-block bg-primary text-white px-10 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:opacity-90 transform hover:scale-105'
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>

      {/* Parallax Gap Section - Shows hero background */}
      <div className='relative h-64 overflow-hidden' />

      <div className='relative z-20 bg-white'>
        <div className='max-w-5xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center'>
          <h2 className='text-3xl lg:text-5xl tracking-wide mb-20'>
            Featured Listing
          </h2>
          <img
            src='/5158VivianSt.jpg'
            alt='Featured Listing - 5181 Vivian St'
            className='w-full rounded-lg shadow-xl border border-gray-200'
          />
        </div>
      </div>

        {/* Parallax Gap Section - Shows hero background */}
        <div className='relative h-32 overflow-hidden' />
        <Footer />

      </div>
    </div>
  )
}
