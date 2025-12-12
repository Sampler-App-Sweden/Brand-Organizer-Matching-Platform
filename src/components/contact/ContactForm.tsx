import { useState } from 'react'
import { sendContactEmail } from '../../services/emailService'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setStatus('loading')
    setError(null)
    try {
      await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        message
      })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      const msg =
        err &&
        typeof err === 'object' &&
        'text' in err &&
        typeof err.text === 'string'
          ? err.text
          : err instanceof Error
          ? err.message
          : 'Failed to send message'
      setError(msg)
      setStatus('error')
    }
  }

  return (
    <form
      className='w-full p-0 bg-white border-none shadow-none rounded-none sm:p-6 sm:shadow-md sm:border sm:rounded-lg'
      onSubmit={handleSubmit}
    >
      <h2 className='text-2xl font-bold mb-6 text-left'>Send us an email</h2>
      <div className='mb-4'>
        <label htmlFor='name' className='block text-gray-700 font-medium mb-2'>
          Name
        </label>
        <input
          type='text'
          id='name'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Your Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='email' className='block text-gray-700 font-medium mb-2'>
          Email
        </label>
        <input
          type='email'
          id='email'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='example@email.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='mb-4'>
        <label
          htmlFor='message'
          className='block text-gray-700 font-medium mb-2'
        >
          Message
        </label>
        <textarea
          id='message'
          rows={5}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          placeholder='Your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>
      {status === 'success' && (
        <p className='text-sm text-green-600 mb-3'>
          Thanks! Your message was sent.
        </p>
      )}
      {status === 'error' && error && (
        <p className='text-sm text-red-600 mb-3'>{error}</p>
      )}
      <button
        type='submit'
        disabled={status === 'loading'}
        className='w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
