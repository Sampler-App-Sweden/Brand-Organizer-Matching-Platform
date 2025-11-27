import emailjs from '@emailjs/browser';
// EmailJS configuration
// Note: In a production environment, these values should be stored securely
const SERVICE_ID = 'default_service'; // Replace with your actual EmailJS service ID
const TEMPLATE_ID = 'data_export'; // Replace with your actual template ID
const PUBLIC_KEY = 'your_public_key'; // Replace with your actual public key
/**
 * Sends data to a specified email address
 * @param emailAddress The recipient's email address
 * @param subject The email subject
 * @param dataType The type of data being sent
 * @param data The data to send (will be stringified)
 * @returns Promise resolving to the EmailJS response
 */
export const sendDataByEmail = async (emailAddress: string, subject: string, dataType: string, data: any): Promise<any> => {
  try {
    const templateParams = {
      to_email: emailAddress,
      subject: subject,
      data_type: dataType,
      data_json: JSON.stringify(data, null, 2),
      timestamp: new Date().toLocaleString()
    };
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
/**
 * Initialize EmailJS
 * Should be called when the application starts
 */
export const initEmailJS = () => {
  emailjs.init(PUBLIC_KEY);
};