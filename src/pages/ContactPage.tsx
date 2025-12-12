import { ContactForm } from '../components/contact/ContactForm'
import { Layout } from '../components/layout/Layout'

export function ContactPage() {
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-8'>
        <div className='w-full max-w-3xl mx-auto flex flex-col md:flex-row md:gap-8'>
          {/* Contact Details */}
          <div className='flex-1 mb-8 md:mb-0 md:mr-4'>
            <h1 className='text-3xl font-extrabold text-gray-900 mb-4'>
              Contact Us
            </h1>
            <div className='text-gray-700 space-y-2'>
              <div>
                <span className='font-semibold'>Email:</span> info@sponsrai.se
              </div>
              <div>
                <span className='font-semibold'>Phone:</span> +46 70 123 45 67
              </div>
              <div>
                <span className='font-semibold'>Address:</span> Storgatan 1, 111
                22 Stockholm
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className='flex-1'>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}
