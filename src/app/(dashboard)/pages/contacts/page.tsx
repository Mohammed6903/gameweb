import { PolicyLayout, SafeHTML } from '@/components/policy-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { sendContactEmail } from '@/lib/actions/contact'
import { getContactInfo } from '@/lib/controllers/dynamic-pages'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, CheckCircle, XCircle } from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
}

export interface ContactInfo {
  id: number,
  title: string
  description: string
  address: string
  email: string
  phone: string
  formTitle: string
  formDescription: string
  socialTitle: string
  socialLinks: SocialLink[]
}

async function getContacts(): Promise<ContactInfo> {
  try {
      const contact = await getContactInfo();
      return contact;
    } catch (error) {
      return {
        id: 1,
        title: "Contact Information",
        description: "Get in touch with us using the information below.",
        address: '123 Gaming Street, Pixel City, 12345',
        email: 'support@gamegrid.com',
        phone: '+1 (555) 123-4567',
        formTitle: "Get in Touch",
        formDescription: "We'd love to hear from you. Please fill out this form and we'll get back to you as soon as possible.",
        socialTitle: "Follow Us",
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com/gamegrid' },
          { platform: 'twitter', url: 'https://twitter.com/gamegrid' },
          { platform: 'instagram', url: 'https://instagram.com/gamegrid' },
        ]
      }
    }
}

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook className="w-6 h-6" />;
    case 'twitter': return <Twitter className="w-6 h-6" />;
    case 'instagram': return <Instagram className="w-6 h-6" />;
    case 'linkedin': return <Linkedin className="w-6 h-6" />;
    case 'youtube': return <Youtube className="w-6 h-6" />;
    case 'github': return <Github className="w-6 h-6" />;
    default: return null;
  }
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const contactInfo = await getContacts()
  const params = await searchParams
  const success = params.success === 'true'
  const error = params.error

  const errorMessages: Record<string, string> = {
    missing_fields: 'Please fill in all required fields.',
    send_failed: 'Failed to send email. Please try again.',
    unknown: 'An unexpected error occurred. Please try again.',
  }

  return (
    <PolicyLayout title="Contact Us">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{contactInfo.formTitle}</h2>
          <p className="mb-4 text-muted-foreground">{contactInfo.formDescription}</p>
          
          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-500 text-sm">
                Thank you for your message! We'll get back to you soon.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">
                {errorMessages[error] || 'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          <form className="space-y-4" action={sendContactEmail}>            
            <Input
              name="name"
              placeholder="Your Name"
              required
              className="bg-background/60 border-border/60 focus-visible:ring-ring"
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              className="bg-background/60 border-border/60 focus-visible:ring-ring"
            />
            <Input
              name="company"
              placeholder="Company (optional)"
              className="bg-background/60 border-border/60 focus-visible:ring-ring"
            />
            {/* Honeypot field for bots */}
            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            <Textarea
              name="message"
              placeholder="Your Message"
              required
              className="bg-background/60 border-border/60 focus-visible:ring-ring min-h-[150px]"
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Send Message
            </Button>
          </form>
        </div>
        
        {/* Right Column (Contact Details) */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">{contactInfo.title}</h2>
          <p className="text-foreground mb-4">{contactInfo.description}</p>
          <div className="space-y-4 mt-4 text-muted-foreground">
            <p><strong className="text-foreground">Address:</strong> {contactInfo.address}</p>
            <p><strong className="text-foreground">Email:</strong> {contactInfo.email}</p>
            <p><strong className="text-foreground">Phone:</strong> {contactInfo.phone}</p>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{contactInfo.socialTitle}</h3>
            <div className="flex space-x-4">
              {contactInfo.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PolicyLayout>
  )
}