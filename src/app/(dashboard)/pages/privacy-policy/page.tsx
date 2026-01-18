import { PolicyLayout, SafeHTML } from '@/components/policy-layout'
import { getPageContent } from '@/lib/controllers/dynamic-pages';

interface PrivacyPolicyContent {
  content: string
}

async function getPrivacyPolicyContent(): Promise<PrivacyPolicyContent> {
  try {
    const res = await getPageContent('privacy');
    return res;
  } catch (error) {
    return {
      content: `
        <h2>Privacy Policy</h2>
        <p>At ${process.env.NEXT_PUBLIC_SITE_NAME}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website and services.</p>
        
        <h3>1. Information We Collect</h3>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Such as your name, email address, and phone number when you create an account or contact us.</li>
          <li><strong>Usage Data:</strong> Information on how you use our website, including your browsing history, game preferences, and interaction with other users.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information, and other technical details when you access our platform.</li>
        </ul>
  
        <h3>2. How We Use Your Information</h3>
        <p>We use the collected information for various purposes, including:</p>
        <ul>
          <li>Providing and maintaining our services</li>
          <li>Improving and personalizing user experience</li>
          <li>Analyzing usage patterns and trends</li>
          <li>Communicating with you about updates, offers, and support</li>
          <li>Ensuring the security and integrity of our platform</li>
        </ul>
  
        <h3>3. Data Sharing and Disclosure</h3>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers who assist us in operating our platform</li>
          <li>Law enforcement or regulatory bodies when required by law</li>
          <li>Other users, but only information you choose to make public on our platform</li>
        </ul>
  
        <h3>4. Data Security</h3>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
  
        <h3>5. Your Rights</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify any inaccurate or incomplete personal information</li>
          <li>Request erasure of your personal data</li>
          <li>Object to or restrict the processing of your personal data</li>
          <li>Data portability</li>
        </ul>
  
        <h3>6. Cookies and Tracking Technologies</h3>
        <p>We use cookies and similar tracking technologies to enhance your browsing experience and collect usage data. You can manage your cookie preferences through your browser settings.</p>
  
        <h3>7. Changes to This Privacy Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
  
        <h3>8. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          ${process.env.NEXT_PUBLIC_SITE_NAME} Inc.<br>
          123 Gaming Street, Pixel City, 12345<br>
          Email: privacy@${process.env.NEXT_PUBLIC_SITE_NAME}.com<br>
          Phone: +1 (555) 123-4567
        </p>
  
        <p><strong>Last updated:</strong> [Current Date]</p>
      `
    }
  }
}

export default async function PrivacyPolicyPage() {
  const { content } = await getPrivacyPolicyContent()

  return (
    <PolicyLayout title="Privacy Policy">
      <div className="prose prose-invert max-w-none">
        <SafeHTML html={content} />
      </div>
    </PolicyLayout>
  )
}