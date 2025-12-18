import React, { useState, useMemo } from 'react'
import {
  SearchIcon,
  FileTextIcon,
  UsersIcon,
  UserIcon,
  CreditCardIcon,
  CalendarIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon
} from 'lucide-react'
import { Navbar } from './layout/Navbar'
import { Button } from './ui'
import {
  faqCategories,
  faqData,
  searchFAQ,
  getFAQByCategory,
  type FAQItem,
  type FAQCategory
} from '../data/faqData'

interface HelpCenterProps {
  onContactSupport?: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  FileText: <FileTextIcon className='h-6 w-6' />,
  Users: <UsersIcon className='h-6 w-6' />,
  User: <UserIcon className='h-6 w-6' />,
  CreditCard: <CreditCardIcon className='h-6 w-6' />,
  Calendar: <CalendarIcon className='h-6 w-6' />,
  Settings: <SettingsIcon className='h-6 w-6' />
}

export function HelpCenter({ onContactSupport }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = useMemo(() => {
    if (searchQuery) {
      return searchFAQ(searchQuery)
    }
    if (selectedCategory) {
      return getFAQByCategory(selectedCategory)
    }
    return faqData
  }, [searchQuery, selectedCategory])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    setSearchQuery('')
    setExpandedFAQ(null)
  }

  const handleFAQClick = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setSelectedCategory(null)
    setExpandedFAQ(null)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSearchQuery('')
    setExpandedFAQ(null)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Header */}
          <div className='bg-indigo-600 text-white p-6'>
            <div className='flex items-center gap-3'>
              <BookOpenIcon className='h-8 w-8' />
              <h1 className='text-3xl font-bold'>Help Center</h1>
            </div>
            <p className='mt-2 text-indigo-100'>
              Find answers to common questions or contact our support team
            </p>
          </div>

          {/* Search Bar */}
          <div className='p-6 border-b'>
            <div className='relative'>
              <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <input
                type='text'
                placeholder='Search for help...'
                value={searchQuery}
                onChange={handleSearchChange}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </div>

          {/* Content */}
          <div className='p-6 min-h-[500px]'>
            {!selectedCategory && !searchQuery ? (
              // Category Grid
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Choose a category
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className='flex flex-col items-start p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all text-left group'
                    >
                      <div className='text-indigo-600 mb-2 group-hover:scale-110 transition-transform'>
                        {categoryIcons[category.icon]}
                      </div>
                      <h4 className='font-semibold text-gray-900 mb-1'>
                        {category.name}
                      </h4>
                      <p className='text-sm text-gray-600'>{category.description}</p>
                      <div className='mt-2 text-sm text-indigo-600 font-medium'>
                        {getFAQByCategory(category.id).length} questions →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // FAQ List
              <div>
                {selectedCategory && (
                  <button
                    onClick={handleBackToCategories}
                    className='mb-4 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1'
                  >
                    ← Back to categories
                  </button>
                )}

                {searchQuery && (
                  <p className='mb-4 text-gray-600'>
                    Showing {filteredFAQs.length} results for "{searchQuery}"
                  </p>
                )}

                {filteredFAQs.length === 0 ? (
                  <div className='text-center py-12'>
                    <p className='text-gray-600 mb-4'>
                      No answers found for your question.
                    </p>
                    {onContactSupport && (
                      <Button onClick={onContactSupport} variant='primary'>
                        Contact support
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className='border border-gray-200 rounded-lg overflow-hidden'
                      >
                        <button
                          onClick={() => handleFAQClick(faq.id)}
                          className='w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors text-left'
                        >
                          <span className='font-medium text-gray-900'>
                            {faq.question}
                          </span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUpIcon className='h-5 w-5 text-gray-500 flex-shrink-0' />
                          ) : (
                            <ChevronDownIcon className='h-5 w-5 text-gray-500 flex-shrink-0' />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className='px-4 py-3 bg-gray-50 border-t border-gray-200'>
                            <p className='text-gray-700 whitespace-pre-line'>
                              {faq.answer}
                            </p>
                            {faq.relatedQuestions &&
                              faq.relatedQuestions.length > 0 && (
                                <div className='mt-4 pt-4 border-t border-gray-200'>
                                  <p className='text-sm font-medium text-gray-900 mb-2'>
                                    Related questions:
                                  </p>
                                  <div className='space-y-1'>
                                    {faq.relatedQuestions.map((relatedId) => {
                                      const relatedFAQ = faqData.find(
                                        (f) => f.id === relatedId
                                      )
                                      return relatedFAQ ? (
                                        <button
                                          key={relatedId}
                                          onClick={() => handleFAQClick(relatedId)}
                                          className='block text-sm text-indigo-600 hover:text-indigo-700 hover:underline'
                                        >
                                          • {relatedFAQ.question}
                                        </button>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='p-6 border-t bg-gray-50'>
            <p className='text-sm text-gray-600 text-center mb-3'>
              Couldn't find the answer to your question?
            </p>
            {onContactSupport && (
              <Button
                onClick={onContactSupport}
                variant='primary'
                className='w-full'
              >
                Contact support
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
