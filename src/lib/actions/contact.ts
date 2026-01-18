'use server'

import { Resend } from 'resend'
import { redirect } from 'next/navigation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const honeypot = String(formData.get('website') || '').trim()

  if (honeypot) {
    redirect('/pages/contacts?success=true')
  }

  if (!name || !email || !message) {
    redirect('/pages/contacts?error=missing_fields')
  }

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: [process.env.RESEND_TO!],
    subject: `New contact form message from ${name}`,
    replyTo: email,
    text: `Name: ${name}
Email: ${email}
Company: ${company || '-'}

Message:
${message}`,
  })

  if (error) {
    console.error('Resend error:', error)
    redirect('/pages/contacts?error=send_failed')
  }

  redirect('/pages/contacts?success=true')
}