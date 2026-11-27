import 'server-only'

export const primaryEnquiryRecipient = 'info@eva-tech-studio.com'
const temporaryBackupRecipient = 'stevezuluu@gmail.com'

const requiredEnquiryRecipients = [primaryEnquiryRecipient, temporaryBackupRecipient]

const additionalRecipientsByChannel = {
  contact: [],
  chat: ['support@eva-tech-studio.com'],
  negotiation: [
    'support@eva-tech-studio.com',
    'sales@eva-tech-studio.com',
    'marketing@eva-tech-studio.com',
  ],
}

export type EnquiryEmailChannel = keyof typeof additionalRecipientsByChannel

export function getEnquiryRecipients(channel: EnquiryEmailChannel): string[] {
  return [...requiredEnquiryRecipients, ...additionalRecipientsByChannel[channel]]
}

export function getResendApiKey(): string {
  return process.env.RESEND_EMAIL_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY?.trim() || ''
}
