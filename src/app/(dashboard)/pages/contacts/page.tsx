import { PolicyLayout, SafeHTML } from '@/components/policy-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getContactInfo } from '@/lib/controllers/dynamic-pages'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react'

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

export default async function ContactPage() {
  const contactInfo = await getContacts()

  return (
    <PolicyLayout title="Contact Us">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{contactInfo.formTitle}</h2>
          <p className="mb-4">{contactInfo.formDescription}</p>
          <form className="space-y-4">
            <Input placeholder="Your Name" className="bg-white/5 border-purple-700 focus:border-purple-500" />
            <Input type="email" placeholder="Your Email" className="bg-white/5 border-purple-700 focus:border-purple-500" />
            <Textarea placeholder="Your Message" className="bg-white/5 border-purple-700 focus:border-purple-500 min-h-[150px]" />
            <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">Send Message</Button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">{contactInfo.title}</h2>
          <SafeHTML html={contactInfo.description} />
          <div className="space-y-4 mt-4">
            <p><strong>Address:</strong> {contactInfo.address}</p>
            <p><strong>Email:</strong> {contactInfo.email}</p>
            <p><strong>Phone:</strong> {contactInfo.phone}</p>
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
                  className="text-white hover:text-purple-400 transition-colors"
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