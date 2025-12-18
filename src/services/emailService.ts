import emailjs from '@emailjs/browser'
import type { EmailJSResponseStatus } from '@emailjs/browser'
import { saveSupportTicket } from './supportTicketService'

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
 * Sends a support ticket email and saves it to Supabase
 * @param params Support ticket parameters
 * @returns Promise resolving to the EmailJS response
 */
export const sendSupportTicket = async (params: {
  name: string
  email: string
  category: string
  message: string
  attachments?: string[]
  userAgent?: string
  timestamp?: string
}): Promise<EmailJSResponseStatus> => {
  const {
    name,
    email,
    category,
    message,
    attachments = [],
    userAgent = navigator.userAgent,
    timestamp = new Date().toLocaleString()
  } = params

  // Save ticket to Supabase (don't await to avoid blocking email send)
  saveSupportTicket({
    name,
    email,
    category,
    message,
    attachments,
    user_agent: userAgent
  }).catch((error) => {
    console.error('Failed to save support ticket to database:', error)
  })

  const templateParams = {
    from_name: name,
    reply_to: email,
    category,
    message,
    attachments: attachments.length > 0 ? attachments.join('\n') : 'None',
    user_agent: userAgent,
    timestamp,
    to_email: DEFAULT_CONTACT_RECIPIENT
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
