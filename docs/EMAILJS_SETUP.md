# EmailJS Setup Guide for Support Tickets

This guide will help you configure EmailJS to send support ticket emails.

## Step 1: Create EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up or log in to your account

## Step 2: Create Email Service

1. In the EmailJS Dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_3nm8pga`)

### Gmail Setup (Recommended)
- Select **Gmail**
- Click **Connect Account** and authorize EmailJS
- Your service will be created automatically

## Step 3: Create Email Template for Support Tickets

1. Go to **Email Templates** in the EmailJS Dashboard
2. Click **Create New Template**
3. Set Template Name: `Support Ticket Notification`
4. Set Template ID: `template_contactForm` (must match your .env file)

### Template Configuration

**Subject:**
```
New Support Ticket - {{category}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: white;
            padding: 20px;
            margin-top: 20px;
            border-radius: 5px;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            color: #4F46E5;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Support Ticket Received</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">From:</span> {{from_name}}
            </div>
            <div class="field">
                <span class="label">Email:</span> {{reply_to}}
            </div>
            <div class="field">
                <span class="label">Category:</span> {{category}}
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <p>{{message}}</p>
            </div>
            <div class="field">
                <span class="label">Attachments:</span> {{attachments}}
            </div>
            <div class="field">
                <span class="label">User Agent:</span> {{user_agent}}
            </div>
            <div class="field">
                <span class="label">Timestamp:</span> {{timestamp}}
            </div>
        </div>
        <div class="footer">
            <p>This is an automated message from your support system.</p>
            <p>Reply to this email to respond to the customer.</p>
        </div>
    </div>
</body>
</html>
```

### Template Variables
Make sure these variables are configured in your template:
- `from_name` - Customer's name
- `reply_to` - Customer's email address
- `category` - Support ticket category
- `message` - Customer's message
- `attachments` - List of attachments
- `user_agent` - Browser information
- `timestamp` - When the ticket was created
- `to_email` - Your support email (info@sponsrai.se)

### Template Settings
1. **To Email**: Set to `{{to_email}}` (this will be populated from the code)
2. **From Name**: Set to `Sponsrai Support` or your brand name
3. **Reply To**: Set to `{{reply_to}}` (customer's email)
4. **Subject**: `New Support Ticket - {{category}}`

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `64rSK856jKPEHoJ8t`)
3. Copy this key

## Step 5: Update Environment Variables

Your `.env` file should already have these variables. Verify they match your EmailJS settings:

```env
VITE_EMAILJS_SERVICE_ID=service_3nm8pga
VITE_EMAILJS_TEMPLATE_ID=template_l82uwvy
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_contactForm
VITE_EMAILJS_PUBLIC_KEY=64rSK856jKPEHoJ8t
```

**Update these if needed:**
- `VITE_EMAILJS_SERVICE_ID` - Your service ID from Step 2
- `VITE_EMAILJS_CONTACT_TEMPLATE_ID` - Must be `template_contactForm` or update the template ID in EmailJS
- `VITE_EMAILJS_PUBLIC_KEY` - Your public key from Step 4

## Step 6: Configure Email Limits (Optional)

EmailJS free tier includes:
- 200 emails per month
- Rate limit protection

For production use:
1. Go to **Account** → **Pricing**
2. Consider upgrading if you expect more than 200 support tickets/month
3. Enable email quota notifications

## Step 7: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Open your application
3. Click the Help/Support button
4. Fill out the support form with test data
5. Submit the form
6. Check your email inbox (info@sponsrai.se) for the test ticket

### Testing Checklist
- ✅ Email arrives at the correct address
- ✅ All template variables are populated correctly
- ✅ Reply-to address is set to customer's email
- ✅ Email formatting looks good
- ✅ No console errors in browser

## Step 8: Apply Supabase RLS Fix

Run this SQL in your Supabase SQL Editor to allow both anonymous and authenticated users to create tickets:

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Go to **SQL Editor**
3. Run this SQL:

```sql
-- Fix Support Tickets RLS Policy to allow both anonymous and authenticated users
DROP POLICY IF EXISTS "Allow anyone to create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Allow authenticated users to create support tickets" ON public.support_tickets;

CREATE POLICY "Allow anyone to create support tickets"
  ON public.support_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

4. Verify the policy:
```sql
SELECT policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'support_tickets' AND cmd = 'INSERT';
```

You should see: `{anon,authenticated}` in the roles column.

**Note:** This allows anyone (logged in or not) to submit support tickets. If you want to restrict to only logged-in users, change `TO anon, authenticated` to `TO authenticated`.

## Troubleshooting

### Error: "The template ID not found"
- **Solution**: Make sure the template ID in EmailJS matches `VITE_EMAILJS_CONTACT_TEMPLATE_ID`
- Go to EmailJS Dashboard → Email Templates
- Edit your template and set the ID to `template_contactForm`

### Error: "new row violates row-level security policy"
- **Solution**: Run the RLS fix SQL from Step 8
- Make sure the policy includes `TO anon, authenticated`

### Error: "Failed to send email"
- **Solution**: Check your EmailJS service is connected
- Verify your public key is correct
- Check EmailJS dashboard for error logs

### Error: "Service ID not found"
- **Solution**: Verify `VITE_EMAILJS_SERVICE_ID` matches your EmailJS service
- Check the service is active in EmailJS dashboard

### Emails not arriving
- **Solution**: Check spam folder
- Verify the `to_email` variable in template settings
- Check EmailJS dashboard → History for delivery status

## Advanced Configuration

### Custom Auto-Reply Template

Create a second template for auto-replies to customers:

1. Template ID: `template_autoReply`
2. Subject: `We received your support request`
3. Content:
```html
<p>Hi {{from_name}},</p>
<p>Thank you for contacting Sponsrai support. We've received your message and will respond within 24 hours.</p>
<p><strong>Your request details:</strong></p>
<p>Category: {{category}}<br>
Ticket ID: {{ticket_id}}</p>
<p>Best regards,<br>Sponsrai Support Team</p>
```

### Add to emailService.ts:
```typescript
// Send auto-reply to customer
export const sendAutoReply = async (params: {
  name: string
  email: string
  category: string
  ticketId: string
}): Promise<EmailJSResponseStatus> => {
  const templateParams = {
    from_name: params.name,
    to_email: params.email,
    category: params.category,
    ticket_id: params.ticketId,
    timestamp: new Date().toLocaleString()
  }
  return emailjs.send(
    SERVICE_ID,
    'template_autoReply',
    templateParams,
    PUBLIC_KEY
  )
}
```

## Production Checklist

Before going live:
- ✅ EmailJS service connected and tested
- ✅ Template configured with correct variables
- ✅ RLS policy updated in Supabase
- ✅ Environment variables set correctly
- ✅ Test email sent and received successfully
- ✅ Email quota configured based on expected volume
- ✅ Monitoring set up for failed emails
- ✅ Auto-reply template configured (optional)

## Support

If you encounter issues:
1. Check EmailJS Dashboard → History for delivery logs
2. Check browser console for error messages
3. Verify Supabase RLS policies in SQL Editor
4. Review EmailJS documentation: https://www.emailjs.com/docs/

## Next Steps

After EmailJS is working:
- Set up email notifications for admins when new tickets arrive
- Create email templates for ticket status updates
- Implement ticket assignment notifications
- Add SLA tracking and alerts
