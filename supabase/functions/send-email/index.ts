// Supabase Edge Function for sending emails
// This handles all email notifications (match notifications, welcome emails, etc.)

import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  to: string
  subject: string
  template: 'welcome' | 'new_match' | 'match_accepted' | 'support_ticket' | 'custom'
  data?: Record<string, any>
  html?: string // For custom template
}

// Email templates
function getEmailTemplate(template: string, data: Record<string, any>): string {
  switch (template) {
    case 'welcome':
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Brand Organizer Matching Platform!</h1>
              </div>
              <div class="content">
                <h2>Hi ${data.name || 'there'}!</h2>
                <p>Thanks for joining our platform. We're excited to help you find the perfect ${data.userType === 'brand' ? 'event partnerships' : 'brand sponsors'}.</p>
                <p>Get started by completing your profile and exploring potential matches.</p>
                <a href="${data.dashboardUrl || 'https://your-platform.com/dashboard'}" class="button">Go to Dashboard</a>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The BOMP Team</p>
              </div>
            </div>
          </body>
        </html>
      `

    case 'new_match':
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #10B981; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .match-score { font-size: 48px; font-weight: bold; color: #10B981; text-align: center; margin: 20px 0; }
              .reasons { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
              .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 New Match Found!</h1>
              </div>
              <div class="content">
                <h2>Hi ${data.recipientName}!</h2>
                <p>We found a great match for you:</p>
                <h3>${data.matchName}</h3>
                <div class="match-score">${data.score}% Match</div>
                <div class="reasons">
                  <h4>Why this is a good match:</h4>
                  <ul>
                    ${data.reasons?.map((reason: string) => `<li>${reason}</li>`).join('') || ''}
                  </ul>
                </div>
                <a href="${data.matchUrl || 'https://your-platform.com/matches'}" class="button">View Match Details</a>
                <p>Best regards,<br>The BOMP Team</p>
              </div>
            </div>
          </body>
        </html>
      `

    case 'match_accepted':
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .button { display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🤝 Match Accepted!</h1>
              </div>
              <div class="content">
                <h2>Hi ${data.recipientName}!</h2>
                <p><strong>${data.matchName}</strong> has accepted your match!</p>
                <p>You can now start a conversation and begin planning your partnership.</p>
                <a href="${data.chatUrl || 'https://your-platform.com/chat'}" class="button">Start Conversation</a>
                <p>Best regards,<br>The BOMP Team</p>
              </div>
            </div>
          </body>
        </html>
      `

    case 'support_ticket':
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Support Ticket Received</h1>
              </div>
              <div class="content">
                <h2>Hi ${data.name}!</h2>
                <p>We've received your support ticket and our team will respond within 24 hours.</p>
                <p><strong>Ticket ID:</strong> ${data.ticketId}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p>Thank you for your patience!</p>
                <p>Best regards,<br>The BOMP Support Team</p>
              </div>
            </div>
          </body>
        </html>
      `

    default:
      return data.html || '<p>No template available</p>'
  }
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailRequest: EmailRequest = await req.json()
    const { to, subject, template, data, html } = emailRequest

    if (!to || !subject) {
      throw new Error('Missing required fields: to, subject')
    }

    // Get HTML content
    const htmlContent = template === 'custom' && html
      ? html
      : getEmailTemplate(template, data || {})

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, we'll use Resend as an example
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email would be sent to:', to)
      // In development, just log the email
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Email service not configured (development mode)',
          preview: { to, subject, template }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'BOMP <noreply@your-domain.com>',
        to: [to],
        subject: subject,
        html: htmlContent
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Email service error: ${JSON.stringify(result)}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: result.id,
        message: 'Email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
