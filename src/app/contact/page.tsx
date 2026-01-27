'use client'

import { useMemo, useState } from 'react'
import Footer from '../components/Footer'
import SearchNav from '../components/SearchNav'

const ContactPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isEmailValid = useMemo(() => {
    const trimmed = email.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }, [email])

  const isPhoneValid = useMemo(() => {
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 10
  }, [phone])

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && isEmailValid && isPhoneValid && !loading
  }, [name, isEmailValid, isPhoneValid, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!canSubmit) return

    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          details: details.trim() || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || 'Something went wrong')
        return
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setPhone('')
      setDetails('')
    } catch (err) {
      console.error('Contact form submit error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <SearchNav />
      <div className='flex-1 bg-gray-50 px-4 pt-42 pb-16'>
        <div className='max-w-2xl mx-auto'>
          <div className='bg-white shadow-lg rounded-lg p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Contact</h1>
            <p className='text-sm text-gray-600 mb-6'>
              Reuired fields are marked with *
            </p>

            {success && (
              <div className='mb-6 bg-green-50 border border-green-200 rounded-md p-4'>
                <p className='text-sm text-green-800'>Message sent successfully.</p>
              </div>
            )}

            {error && (
              <div className='mb-6 p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Name *
                </label>
                <input
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='Your name'
                  required
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email Address *
                </label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    email.length === 0 || isEmailValid
                      ? 'border-gray-300 focus:ring-primary'
                      : 'border-red-500 focus:ring-red-500'
                  }`}
                  placeholder='you@example.com'
                  required
                />
              </div>

              <div>
                <label htmlFor='phone' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone Number *
                </label>
                <input
                  id='phone'
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    phone.length === 0 || isPhoneValid
                      ? 'border-gray-300 focus:ring-primary'
                      : 'border-red-500 focus:ring-red-500'
                  }`}
                  placeholder='(555) 555-5555'
                  required
                />
              </div>

              <div>
                <label htmlFor='details' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Additional Details (Optional)
                </label>
                <textarea
                  id='details'
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-32'
                  placeholder='What can we help with?'
                />
              </div>

              <button
                type='submit'
                disabled={!canSubmit}
                className='w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactPage
