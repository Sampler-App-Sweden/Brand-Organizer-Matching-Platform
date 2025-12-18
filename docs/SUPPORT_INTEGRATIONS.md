# Support System Integration Guide

This guide explains how to integrate the HelpChat component with third-party support tools.

## Current Implementation

The help system currently includes:

- **FAQ System**: Comprehensive knowledge base with 25+ articles across 6 categories
- **Help Center**: Searchable modal with category browsing and related questions
- **Contact Form**: Structured form that sends emails via EmailJS
- **File Uploads**: Support for screenshots and documents (up to 3 files, 10MB each)
- **Smart Matching**: Automatically finds relevant FAQ articles based on user questions
- **Quick Replies**: Category-based quick access buttons

## Integration Options

### 1. Zendesk Integration

Zendesk is a comprehensive customer service platform.

**Installation:**
```bash
npm install @zendesk/web-widget
```

**Implementation in HelpChat.tsx:**

```typescript
// Add to imports
import { useEffect } from 'react'

// Add inside component
useEffect(() => {
  // Load Zendesk Widget
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = `https://static.zdassets.com/ekr/snippet.js?key=${process.env.VITE_ZENDESK_KEY}`
  script.async = true
  document.body.appendChild(script)

  return () => {
    const scriptElement = document.getElementById('ze-snippet')
    if (scriptElement) {
      document.body.removeChild(scriptElement)
    }
  }
}, [])

// Replace sendSupportTicket with Zendesk API
const handleContactFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSending(true)

  try {
    // Zendesk Ticket Creation
    const response = await fetch('https://yourcompany.zendesk.com/api/v2/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_ZENDESK_API_TOKEN}`
      },
      body: JSON.stringify({
        request: {
          requester: {
            name: contactForm.name,
            email: contactForm.email
          },
          subject: `Support Request - ${contactForm.category}`,
          comment: {
            body: contactForm.message
          },
          tags: [contactForm.category]
        }
      })
    })

    if (response.ok) {
      setSubmitStatus('success')
    } else {
      setSubmitStatus('error')
    }
  } catch (error) {
    setSubmitStatus('error')
  }
  setIsSending(false)
}
```

**Environment Variables (.env):**
```
VITE_ZENDESK_KEY=your_zendesk_widget_key
VITE_ZENDESK_API_TOKEN=your_zendesk_api_token
```

---

### 2. Intercom Integration

Intercom provides live chat and customer messaging.

**Installation:**
```bash
npm install react-use-intercom
```

**Implementation:**

```typescript
// src/App.tsx or main layout
import { IntercomProvider } from 'react-use-intercom'

function App() {
  return (
    <IntercomProvider appId={process.env.VITE_INTERCOM_APP_ID}>
      {/* Your app */}
    </IntercomProvider>
  )
}

// In HelpChat.tsx
import { useIntercom } from 'react-use-intercom'

export function HelpChat() {
  const { show, boot, shutdown, update } = useIntercom()

  // Boot Intercom when component mounts
  useEffect(() => {
    if (currentUser) {
      boot({
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.name
      })
    }
    return () => shutdown()
  }, [currentUser])

  // Open Intercom instead of contact form
  const handleOpenContactForm = () => {
    show()
  }

  // Rest of component...
}
```

**Environment Variables (.env):**
```
VITE_INTERCOM_APP_ID=your_intercom_app_id
```

---

### 3. Crisp Chat Integration

Crisp is a lightweight customer messaging platform.

**Installation:**
```bash
npm install crisp-sdk-web
```

**Implementation:**

```typescript
// In HelpChat.tsx or App.tsx
import { Crisp } from 'crisp-sdk-web'

useEffect(() => {
  // Initialize Crisp
  Crisp.configure(process.env.VITE_CRISP_WEBSITE_ID)

  // Set user data if logged in
  if (currentUser) {
    Crisp.user.setEmail(currentUser.email)
    Crisp.user.setNickname(currentUser.name)
  }

  // Hide Crisp by default, show only when needed
  Crisp.chat.hide()
}, [currentUser])

// Open Crisp chat
const handleOpenContactForm = () => {
  Crisp.chat.show()
  Crisp.chat.open()
}
```

**Environment Variables (.env):**
```
VITE_CRISP_WEBSITE_ID=your_crisp_website_id
```

---

### 4. Freshdesk Integration

Freshdesk is a cloud-based customer support software.

**Implementation:**

```typescript
const handleContactFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSending(true)

  try {
    const response = await fetch('https://yourcompany.freshdesk.com/api/v2/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(process.env.VITE_FRESHDESK_API_KEY + ':X')}`
      },
      body: JSON.stringify({
        name: contactForm.name,
        email: contactForm.email,
        subject: `Support Request - ${contactForm.category}`,
        description: contactForm.message,
        priority: 1,
        status: 2,
        tags: [contactForm.category]
      })
    })

    if (response.ok) {
      setSubmitStatus('success')
    } else {
      setSubmitStatus('error')
    }
  } catch (error) {
    setSubmitStatus('error')
  }
  setIsSending(false)
}
```

**Environment Variables (.env):**
```
VITE_FRESHDESK_API_KEY=your_freshdesk_api_key
```

---

### 5. Help Scout Integration

Help Scout offers email-based customer support.

**Implementation:**

```typescript
const handleContactFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSending(true)

  try {
    const response = await fetch('https://api.helpscout.net/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_HELPSCOUT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        subject: `Support Request - ${contactForm.category}`,
        type: 'email',
        mailboxId: process.env.VITE_HELPSCOUT_MAILBOX_ID,
        customer: {
          email: contactForm.email,
          firstName: contactForm.name.split(' ')[0],
          lastName: contactForm.name.split(' ').slice(1).join(' ')
        },
        threads: [{
          type: 'customer',
          customer: {
            email: contactForm.email
          },
          text: contactForm.message
        }],
        tags: [contactForm.category]
      })
    })

    if (response.ok) {
      setSubmitStatus('success')
    } else {
      setSubmitStatus('error')
    }
  } catch (error) {
    setSubmitStatus('error')
  }
  setIsSending(false)
}
```

**Environment Variables (.env):**
```
VITE_HELPSCOUT_ACCESS_TOKEN=your_helpscout_access_token
VITE_HELPSCOUT_MAILBOX_ID=your_mailbox_id
```

---

## File Upload Handling

For file uploads with third-party services, you'll need a cloud storage solution:

### Using Supabase Storage (Already in your stack)

```typescript
import { supabase } from '../services/supabaseClient'

const handleFileUpload = async (files: File[]) => {
  const uploadedUrls: string[] = []

  for (const file of files) {
    const fileName = `support/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('support-attachments')
      .upload(fileName, file)

    if (data) {
      const { data: urlData } = supabase.storage
        .from('support-attachments')
        .getPublicUrl(fileName)

      uploadedUrls.push(urlData.publicUrl)
    }
  }

  return uploadedUrls
}

// In handleContactFormSubmit
const attachmentUrls = await handleFileUpload(uploadedFiles)
// Include attachmentUrls in your ticket/request
```

---

## Hybrid Approach (Recommended)

You can keep the current FAQ/Help Center for common questions while integrating a third-party tool for live support:

```typescript
export function HelpChat() {
  // ... existing code ...

  const handleOpenContactForm = () => {
    // First, check if FAQ found an answer
    if (/* user hasn't found answer in FAQ */) {
      // Show option to either:
      // 1. Fill contact form (async support via email)
      // 2. Open live chat (Intercom/Crisp/etc)

      setViewMode('contact-form')
    }
  }

  // Add a "Start Live Chat" button in contact form
  const startLiveChat = () => {
    // Open your chosen live chat provider
    // Intercom.show() or Crisp.chat.open() or window.zE('webWidget', 'open')
  }

  return (
    // ... existing JSX ...
    // Add button in contact form:
    <div className='flex gap-2'>
      <Button onClick={handleContactFormSubmit}>Send Email</Button>
      <Button onClick={startLiveChat} variant='secondary'>
        Start Live Chat
      </Button>
    </div>
  )
}
```

---

## Analytics Integration

Track support interactions with your analytics platform:

```typescript
// Google Analytics
const trackSupportEvent = (action: string, category: string) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: 'Support',
      event_label: category
    })
  }
}

// In your handlers
handleQuickReply = (categoryId: string) => {
  trackSupportEvent('quick_reply_clicked', categoryId)
  // ... rest of handler
}

handleContactFormSubmit = async () => {
  trackSupportEvent('contact_form_submitted', contactForm.category)
  // ... rest of handler
}
```

---

## Testing Your Integration

1. **Test EmailJS** (current implementation):
   ```bash
   npm run dev
   # Open browser, click help chat, fill form
   # Check your email inbox
   ```

2. **Test FAQ Search**:
   - Search for "contract", "matching", "payment" etc.
   - Verify correct articles appear

3. **Test File Uploads**:
   - Try uploading 3 small images
   - Try uploading a file >10MB (should show error)
   - Try uploading invalid format (should show error)

4. **Test Third-Party Integration**:
   - Verify widget loads
   - Test creating a ticket
   - Check admin dashboard for created tickets

---

## Recommended Integration Path

1. **Start with current EmailJS implementation** (already working)
2. **Add analytics tracking** to understand usage
3. **Expand FAQ database** based on common questions
4. **Integrate live chat** (Crisp or Intercom) for premium users or complex issues
5. **Keep email backup** for when live agents are offline

---

## Environment Variable Summary

Add these to your `.env` file based on chosen integration:

```bash
# Current Implementation (EmailJS)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CONTACT_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Zendesk (optional)
VITE_ZENDESK_KEY=your_zendesk_key
VITE_ZENDESK_API_TOKEN=your_api_token

# Intercom (optional)
VITE_INTERCOM_APP_ID=your_app_id

# Crisp (optional)
VITE_CRISP_WEBSITE_ID=your_website_id

# Freshdesk (optional)
VITE_FRESHDESK_API_KEY=your_api_key

# Help Scout (optional)
VITE_HELPSCOUT_ACCESS_TOKEN=your_access_token
VITE_HELPSCOUT_MAILBOX_ID=your_mailbox_id
```

---

## Support

For questions about this implementation, contact the development team or open an issue in the project repository.
