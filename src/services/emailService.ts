import emailjs from '@emailjs/browser'
import type { EmailJSResponseStatus } from '@emailjs/browser'

// EmailJS configuration - prefer environment variables to avoid hardcoding secrets
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'data_export'
const CONTACT_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'
const DEFAULT_CONTACT_RECIPIENT = 'info@sponsrai.se'

/**
 * Sends data to a specified email address
 * @param emailAddress The recipient's email address
 * @param subject The email subject
 * @param dataType The type of data being sent
 * @param data The data to send (will be stringified)
 * @returns Promise resolving to the EmailJS response
 */
export const sendDataByEmail = async (
  emailAddress: string,
  subject: string,
  dataType: string,
  data: unknown
): Promise<EmailJSResponseStatus> => {
  const templateParams = {
    to_email: emailAddress,
    subject,
    data_type: dataType,
    data_json: JSON.stringify(data, null, 2),
    timestamp: new Date().toLocaleString()
  }
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
}

export const sendContactEmail = async (params: {
  name: string
  email: string
  message: string
  toEmail?: string
}): Promise<EmailJSResponseStatus> => {
  const { name, email, message, toEmail = DEFAULT_CONTACT_RECIPIENT } = params
  const templateParams = {
    from_name: name,
    reply_to: email,
    message,
    to_email: toEmail,
    timestamp: new Date().toLocaleString()
  }
  return emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  )
}

/**
 * Initialize EmailJS
 * Should be called when the application starts
 */
export const initEmailJS = () => {
  emailjs.init(PUBLIC_KEY)
}
