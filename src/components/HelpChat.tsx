import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquareIcon,
  XIcon,
  SendIcon,
  BookOpenIcon,
  MailIcon,
  ImageIcon,
  FileIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react'
import { Button } from './ui'
import { sendSupportTicket } from '../services/emailService'
import { findBestMatchingFAQ, faqCategories } from '../data/faqData'
import { useAuth } from '../context'

type ViewMode = 'chat' | 'contact-form'

interface Message {
  text: string
  fromUser: boolean
  timestamp: Date
  isQuickReply?: boolean
  faqId?: string
}

interface ContactFormData {
  name: string
  email: string
  category: string
  message: string
}

const SUPPORT_CATEGORIES = [
  { id: 'contracts', label: 'Contracts & Agreements' },
  { id: 'matching', label: 'Matching' },
  { id: 'profile', label: 'Profile & Account' },
  { id: 'payment', label: 'Payment' },
  { id: 'events', label: 'Events & Sampling' },
  { id: 'technical', label: 'Technical Support' },
  { id: 'other', label: 'Other' }
]

const QUICK_REPLIES = [
  { id: 'contracts', label: 'Contracts', icon: '📄' },
  { id: 'matching', label: 'Matching', icon: '🤝' },
  { id: 'payment', label: 'Payment', icon: '💳' },
  { id: 'technical', label: 'Technical Help', icon: '🔧' }
]

export function HelpChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('chat')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [hasNotification, setHasNotification] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadError, setUploadError] = useState<string>('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    category: '',
    message: ''
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: 'Hi! How can I help you today? You can choose a topic below or ask a question directly.',
          fromUser: false,
          timestamp: new Date()
        }
      ])
      setShowQuickReplies(true)
    }
    if (isOpen && hasNotification) {
      setHasNotification(false)
    }
  }, [isOpen, messages.length, hasNotification])

  // Simulate receiving a help notification after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true)
      }
    }, 30000)
    return () => clearTimeout(timer)
  }, [isOpen])

  const handleQuickReply = (categoryId: string) => {
    setShowQuickReplies(false)

    // Add user message
    const categoryLabel =
      QUICK_REPLIES.find((q) => q.id === categoryId)?.label || categoryId
    const userMessage: Message = {
      text: `I need help with: ${categoryLabel}`,
      fromUser: true,
      timestamp: new Date(),
      isQuickReply: true
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate response
    setTimeout(() => {
      const category = faqCategories.find((c) => c.id === categoryId)
      const responseText = category
        ? `I see you need help with ${category.name.toLowerCase()}. You can:\n\n1. Browse our help center for common questions\n2. Tell me more about your specific issue\n3. Contact our support directly\n\nWhat would you like to do?`
        : 'What specifically can I help you with?'

      const botResponse: Message = {
        text: responseText,
        fromUser: false,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    // Add user message
    const userMessage: Message = {
      text: message,
      fromUser: true,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setShowQuickReplies(false)
    setMessage('')
    setIsSending(true)

    // Try to find matching FAQ
    const matchingFAQ = findBestMatchingFAQ(message)

    setTimeout(() => {
      setIsSending(false)
      let responseText = ''

      if (matchingFAQ) {
        // FAQ found
        responseText = `${matchingFAQ.answer}\n\nWas this answer helpful? You can also open the help center for more information or contact our support.`
      } else {
        // No FAQ match - suggest contact form
        responseText =
          'I could not find a direct answer to your question in our knowledge base. I recommend that you either:\n\n1. Open the help center and search for similar questions\n2. Fill out the contact form and we will get back to you\n\nWould you like to fill out the contact form?'
      }

      const botResponse: Message = {
        text: responseText,
        fromUser: false,
        timestamp: new Date(),
        faqId: matchingFAQ?.id
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadError('')

    // Validate files
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

    const invalidFiles = files.filter(
      (file) => file.size > maxSize || !allowedTypes.includes(file.type)
    )

    if (invalidFiles.length > 0) {
      setUploadError(
        'Some files are too large (max 10MB) or have invalid format (allowed: JPG, PNG, GIF, PDF)'
      )
      return
    }

    if (uploadedFiles.length + files.length > 3) {
      setUploadError('You can upload a maximum of 3 files')
      return
    }

    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setSubmitStatus('idle')

    try {
      // Convert files to base64 strings for email (simplified - in production use proper file upload)
      const attachmentNames = uploadedFiles.map((file) => file.name)

      await sendSupportTicket({
        name: contactForm.name,
        email: contactForm.email,
        category: contactForm.category,
        message: contactForm.message,
        attachments: attachmentNames
      })

      setSubmitStatus('success')
      setIsSending(false)

      // Show success message in chat
      setTimeout(() => {
        setViewMode('chat')
        setMessages((prev) => [
          ...prev,
          {
            text: 'Thank you for your message! We have sent your request to our support team. You will receive a response within 24 hours.',
            fromUser: false,
            timestamp: new Date()
          }
        ])
        // Reset form
        setContactForm({
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          category: '',
          message: ''
        })
        setUploadedFiles([])
      }, 2000)
    } catch (error) {
      console.error('Error sending support ticket:', error)
      setSubmitStatus('error')
      setIsSending(false)
    }
  }

  const handleOpenContactForm = () => {
    setViewMode('contact-form')
    setContactForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      category: '',
      message: message || ''
    })
  }

  const handleOpenHelpCenter = () => {
    setIsOpen(false) // Close the chat widget
    navigate('/help') // Navigate to the Help Center page
  }

  const renderChatView = () => (
    <>
      <div className='flex-1 overflow-y-auto p-3 space-y-3'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.fromUser
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className='text-sm whitespace-pre-line'>{msg.text}</p>
              <div
                className={`text-xs mt-1 text-right ${
                  msg.fromUser ? 'text-indigo-100' : 'text-gray-500'
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className='flex justify-start'>
            <div className='bg-gray-100 text-gray-800 rounded-lg p-3'>
              <div className='flex gap-1'>
                <span className='inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce' />
                <span
                  className='inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className='inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
        {showQuickReplies && (
          <div className='flex flex-wrap gap-2 justify-center py-2'>
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply.id)}
                className='bg-white border-2 border-indigo-200 text-indigo-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-colors'
              >
                {reply.icon} {reply.label}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className='border-t p-3'>
        <div className='flex gap-2 mb-2'>
          <button
            onClick={handleOpenHelpCenter}
            className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors'
          >
            <BookOpenIcon className='h-4 w-4' />
            Help Center
          </button>
          <button
            onClick={handleOpenContactForm}
            className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors'
          >
            <MailIcon className='h-4 w-4' />
            Contact Us
          </button>
        </div>
        <form onSubmit={handleSendMessage} className='flex gap-2'>
          <input
            type='text'
            placeholder='Type a message...'
            className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />
          <Button
            type='submit'
            variant='primary'
            disabled={isSending || !message.trim()}
          >
            {isSending ? (
              <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <SendIcon className='h-4 w-4' />
            )}
          </Button>
        </form>
      </div>
    </>
  )

  const renderContactForm = () => (
    <>
      <div className='flex-1 overflow-y-auto p-4'>
        <button
          onClick={() => setViewMode('chat')}
          className='text-indigo-600 hover:text-indigo-700 font-medium mb-4 flex items-center gap-1'
        >
          ← Back to chat
        </button>

        {submitStatus === 'success' ? (
          <div className='text-center py-8'>
            <CheckCircleIcon className='h-16 w-16 text-green-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Message sent!
            </h3>
            <p className='text-gray-600'>
              We have received your request and will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactFormSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Name *
              </label>
              <input
                type='text'
                id='name'
                required
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email *
              </label>
              <input
                type='email'
                id='email'
                required
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='category'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Category *
              </label>
              <select
                id='category'
                required
                value={contactForm.category}
                onChange={(e) =>
                  setContactForm({ ...contactForm, category: e.target.value })
                }
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              >
                <option value=''>Select category...</option>
                {SUPPORT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Message *
              </label>
              <textarea
                id='message'
                required
                rows={4}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                className='w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Describe your problem or question...'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Attach files (optional)
              </label>
              <div className='space-y-2'>
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors flex flex-col items-center gap-2 text-gray-600 hover:text-indigo-600'
                >
                  <ImageIcon className='h-8 w-8' />
                  <span className='text-sm'>
                    Click to upload screenshots or files
                  </span>
                  <span className='text-xs text-gray-500'>
                    Max 3 files, 10MB each (JPG, PNG, GIF, PDF)
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/jpeg,image/png,image/gif,application/pdf'
                  onChange={handleFileUpload}
                  className='hidden'
                />

                {uploadError && (
                  <div className='flex items-center gap-2 text-red-600 text-sm'>
                    <AlertCircleIcon className='h-4 w-4' />
                    {uploadError}
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className='space-y-2'>
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between bg-gray-50 p-2 rounded'
                      >
                        <div className='flex items-center gap-2'>
                          <FileIcon className='h-4 w-4 text-gray-500' />
                          <span className='text-sm text-gray-700'>
                            {file.name}
                          </span>
                          <span className='text-xs text-gray-500'>
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => handleRemoveFile(index)}
                          className='text-red-500 hover:text-red-700'
                        >
                          <XIcon className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {submitStatus === 'error' && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700'>
                <AlertCircleIcon className='h-5 w-5' />
                <span className='text-sm'>
                  An error occurred while sending the message. Please try again.
                </span>
              </div>
            )}

            <Button
              type='submit'
              variant='primary'
              disabled={isSending}
              className='w-full'
            >
              {isSending ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Sending...
                </span>
              ) : (
                'Send message'
              )}
            </Button>
          </form>
        )}
      </div>
    </>
  )

  return (
    <>
      <div className='fixed bottom-4 right-4 z-50'>
        {isOpen ? (
          <div
            className='bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col'
            style={{ height: '500px' }}
          >
            <div className='bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center'>
              <h3 className='font-medium'>
                {viewMode === 'chat' ? 'Support' : 'Contact Support'}
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setViewMode('chat')
                  setSubmitStatus('idle')
                }}
                className='text-white hover:text-indigo-100'
              >
                <XIcon className='h-5 w-5' />
              </button>
            </div>

            {viewMode === 'chat' ? renderChatView() : renderContactForm()}
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className='bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 relative group'
          >
            <MessageSquareIcon className='h-6 w-6' />
            {hasNotification && (
              <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs'>
                1
              </span>
            )}
            <span className='absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
              Need help?
            </span>
          </button>
        )}
      </div>

    </>
  )
}
