import { PolicyLayout, SafeHTML } from '@/components/policy-layout'
import { getPageContent } from '@/lib/controllers/dynamic-pages';

interface TermsOfServiceContent {
  content: string
}

async function getTermsOfServiceContent(): Promise<TermsOfServiceContent> {
    try {
    const res = await getPageContent('terms');
    return res;
  } catch (error) {
    return {
      content: `
        <h2>Terms of Service</h2>
        <p>Welcome to ${process.env.NEXT_PUBLIC_SITE_NAME}. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully before using our platform.</p>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using the ${process.env.NEXT_PUBLIC_SITE_NAME} platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
        <h3>2. User Accounts</h3>
        <p>To access certain features of the platform, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.</p>
        <h3>3. User Conduct</h3>
        <p>You agree to use ${process.env.NEXT_PUBLIC_SITE_NAME} for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our services.</p>
        <h3>4. Intellectual Property</h3>
        <p>The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution, use, or publication by you of any such parts of this site is strictly prohibited.</p>
        <h3>5. Limitation of Liability</h3>
        <p>${process.env.NEXT_PUBLIC_SITE_NAME} shall not be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the platform or services.</p>
        <h3>6. Changes to Terms</h3>
        <p>${process.env.NEXT_PUBLIC_SITE_NAME} reserves the right to modify these terms at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.</p>
        <h3>7. Governing Law</h3>
        <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of [Your Country/State].</p>
        <h3>Contact Information</h3>
        <p>If you have any questions about these Terms, please contact us at legal@${process.env.NEXT_PUBLIC_SITE_NAME}.com.</p>
      `
    }
  }
}

export default async function TermsOfServicePage() {
  const { content } = await getTermsOfServiceContent()

  return (
    <PolicyLayout title="Terms of Service">
      <div className="prose prose-invert max-w-none">
        <SafeHTML html={content} />
      </div>
    </PolicyLayout>
  )
}