import { Resend } from 'resend'

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const TO_EMAIL = process.env.ADMIN_EMAIL || 'tranminhtran83@gmail.com'

export async function notifyContactRequest(data: {
  name: string
  email: string
  message: string
}): Promise<boolean> {
  try {
    const resend = getResend()
    if (!resend) {
      console.warn('Resend API key not configured, skipping email notification')
      return false
    }

    const subject = `📧 New Contact Request from ${data.name}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background-color: #f9fafb; border-radius: 8px; padding: 24px; border: 1px solid #e5e7eb; }
            .header { background-color: #26A69A; color: white; padding: 16px; border-radius: 6px; margin-bottom: 20px; }
            .section { background-color: white; padding: 16px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
            .label { font-weight: 600; color: #6b7280; font-size: 14px; margin-bottom: 4px; }
            .value { color: #111827; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h2 style="margin: 0;">New Contact Request</h2></div>
            <div class="section"><div class="label">From:</div><div class="value">${escapeHtml(data.name)}</div></div>
            <div class="section"><div class="label">Email:</div><div class="value"><a href="mailto:${data.email}">${data.email}</a></div></div>
            <div class="section"><div class="label">Message:</div><div class="value">${escapeHtml(data.message)}</div></div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({ from: FROM_EMAIL, to: TO_EMAIL, subject, html, replyTo: data.email })
    return true
  } catch (error) {
    console.error('Failed to send contact request email:', error)
    return false
  }
}

export async function sendReplyToUser(data: {
  toEmail: string
  toName?: string
  originalMessage: string
  replyContent: string
}): Promise<boolean> {
  try {
    const resend = getResend()
    if (!resend) return false

    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Chào ${escapeHtml(data.toName || 'bạn')},</p>
          <p>Cảm ơn bạn đã liên hệ. Về tin nhắn của bạn:</p>
          <blockquote style="border-left: 4px solid #26A69A; padding-left: 12px; color: #6b7280; font-style: italic;">${escapeHtml(data.originalMessage)}</blockquote>
          <p style="white-space: pre-wrap;">${escapeHtml(data.replyContent)}</p>
          <p>Trân trọng,<br/><strong>Minh Tran</strong></p>
        </body>
      </html>
    `

    await resend.emails.send({ from: FROM_EMAIL, to: data.toEmail, subject: `Re: Your message`, html, replyTo: TO_EMAIL })
    return true
  } catch (error) {
    console.error('Failed to send reply:', error)
    return false
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
