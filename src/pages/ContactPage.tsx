import { ContactForm } from '../components/contact/ContactForm'
import { Layout } from '../components/layout/Layout'

export function ContactPage() {
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-3xl font-extrabold text-gray-900 mb-6'>
            Contact Us
          </h1>
          <ContactForm />
        </div>
      </div>
    </Layout>
  )
}
