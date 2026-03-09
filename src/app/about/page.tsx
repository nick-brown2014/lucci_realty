'use client'

import { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function AboutPage() {
  const [parallaxOffset, setParallaxOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
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
          src='/mountaincity.webp'
          alt='Mountain city landscape'
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

        {/* Hero Section */}
        <div className='relative w-full h-screen flex items-center justify-center'>
          <div className='text-center px-6 max-w-4xl'>
            <h1 className='text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 uppercase'>
              Chris Lucci
            </h1>
            <p className='text-white text-xl md:text-2xl tracking-wide'>
              Making Home Buying Easy
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <div className='relative bg-white'>
          <div className='max-w-4xl mx-auto px-6 py-16 lg:py-24'>
            <div className='flex flex-col lg:flex-row gap-12 items-center'>
              <div className='w-full lg:w-1/2 flex justify-center'>
                <img
                  src='/IMG_1834.jpg'
                  alt='Chris Lucci'
                  className='w-full max-w-md rounded-lg shadow-xl object-cover'
                />
              </div>
              <div className='w-full lg:w-1/2'>
                <h2 className='text-3xl lg:text-4xl tracking-wide mb-4'>
                  Meet Chris
                </h2>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  Buying a home can feel overwhelming. The paperwork, the negotiations, the uncertainty &mdash;
                  it&apos;s a lot. Chris Lucci gets it. He understands that for most people, purchasing a home is one
                  of the biggest decisions they&apos;ll ever make, and it can be downright scary.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parallax Gap - Shows hero background */}
        <div className='relative h-64 overflow-hidden' />

        {/* Promise Section */}
        <div className='relative z-20 bg-white'>
          <div className='max-w-4xl mx-auto px-6 py-16 lg:py-24'>
            <div className='flex flex-col lg:flex-row-reverse gap-12 items-center'>
              <div className='w-full lg:w-1/2 flex justify-center'>
                <img
                  src='/IMG_1525.jpg'
                  alt='Chris Lucci'
                  className='w-full max-w-md rounded-lg shadow-xl object-cover'
                />
              </div>
              <div className='w-full lg:w-1/2'>
                <h2 className='text-3xl lg:text-4xl tracking-wide mb-4'>
                  The Lucci Promise
                </h2>
                <p className='text-lg text-gray-700 leading-relaxed mb-6'>
                  Chris believes that buying a home should never feel like a burden. That&apos;s why he&apos;s built
                  his entire approach around making the process simple, transparent, and &mdash; believe it or not &mdash;
                  actually fun.
                </p>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  When you work with Chris, you&apos;re guaranteed an experience that takes the stress out of
                  home buying. He handles the hard stuff so you can focus on the exciting part: finding the
                  place you&apos;ll call home.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parallax Gap - Shows hero background */}
        <div className='relative h-64 overflow-hidden' />

        {/* CTA Section */}
        <div className='relative z-20 bg-white'>
          <div className='max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center'>
            <h2 className='text-3xl lg:text-5xl tracking-wide mb-4'>
              Ready to Get Started?
            </h2>
            <p className='text-lg lg:text-xl tracking-wide text-primary mb-8'>
              Let&apos;s make your home buying experience one you&apos;ll actually enjoy.
            </p>
            <a
              href='/contact'
              className='inline-block bg-primary text-white px-12 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:opacity-90 transform hover:scale-105'
            >
              Get in Touch
            </a>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
