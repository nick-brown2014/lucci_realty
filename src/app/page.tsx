'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from './components/Footer'
import Nav from './components/Nav'

export default function NewHome() {
  const router = useRouter()
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
          src='/home-header.jpg'
          alt='Hero background'
          className='absolute w-full min-h-screen object-cover'
          style={{
            top: 0,
            transform: `translateY(-${parallaxOffset}px)`,
            height: 'calc(100vh + 400px)'
          }}
        />
        <div className='absolute inset-0 bg-black' style={{ opacity: 0.6 }} />
      </div>

      {/* Content Container */}
      <div className='relative z-10'>
        <Nav />

        {/* Hero Content Section */}
        <div className='relative w-full h-screen flex items-center justify-center'>
          <div className='text-center px-6'>
          <h1 className='text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 uppercase'>
            Lucci | Signature Homes
          </h1>
          <p className='text-white text-xl md:text-2xl mb-12 tracking-wide'>
            It&apos;s all Lucci!
          </p>

          {/* Search Button */}
          <button
            onClick={() => router.push('/search')}
            className='cursor-pointer bg-transparent border-2 border-white hover:bg-white hover:border-white text-white hover:text-primary px-12 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105'
          >
            Start Your Search
          </button>
          </div>
        </div>

        {/* Realtor Section */}
        <div className='relative bg-white'>
        <div className='max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center'>
          {/* Section Header */}
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            Section One
          </h2>
          <h2 className='text-lg lg:text-xl tracking-wide text-primary mt-2'>
            Content here
          </h2>
          <div className='w-full min-h-64 flex flex-col items-center lg:items-stretch lg:flex-row max-w-4xl mt-8'>
            
          </div>

        </div>
      </div>

      {/* Parallax Gap Section - Shows hero background */}
      <div className='relative h-64 overflow-hidden' />


      {/* Cities Section with Parallax Effect */}
      <div className='relative z-20 bg-white'>
        <div className='max-w-9xl mx-auto py-16 lg:py-12 flex flex-col items-center'>
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            Explore Communities
          </h2>
          <h2 className='text-lg lg:text-xl tracking-wide text-primary mt-2'>
            Location of Communities
          </h2>
          <div className='flex flex-col md:flex-row w-full mt-12 gap-1'>
            <div
              className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer border-2 border-gray-200'
              onClick={() => router.push('search?location=fort-collins')}>
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Location One
                </h3>
              </div>
            </div>

            <div
              className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer border-2 border-gray-200'
              onClick={() => router.push('search?location=denver')}>
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Location Two
                </h3>
              </div>
            </div>

            <div
            className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer border-2 border-gray-200'
            onClick={() => router.push('search?location=boulder')}>
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Location Three
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax Gap Section - Shows hero background */}
      <div className='relative h-64 overflow-hidden' />

      <div className='relative z-20 bg-white'>
        <div className='max-w-9xl mx-auto py-16 lg:py-12 flex flex-col items-center min-h-92'>
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            Section Three
          </h2>
        </div>
        <Footer />
      </div>

      </div>
    </div>
  )
}
