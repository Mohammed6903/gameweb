import { PolicyLayout, SafeHTML } from '@/components/policy-layout'
import { getPageContent } from '@/lib/controllers/dynamic-pages';

interface CookiesPolicyContent {
  content: string
}

async function getCookiesPolicyContent(): Promise<string> {
  // This is a placeholder. In a real application, you would fetch this data from your API
  try {
    const res = await getPageContent('cookies');
    return res.content;
  } catch (error) {
    return `
        <h2>Cookies Policy</h2>
        <p>This Cookies Policy explains what cookies are and how we use them on our website. We recommend that you read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies and how that information is used, and how to control your cookie preferences.</p>
        <h3>What are cookies?</h3>
        <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.</p>
        <h3>How do we use cookies?</h3>
        <p>As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.</p>
        <h3>Types of cookies we use</h3>
        <ul>
          <li><strong>Necessary cookies:</strong> These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.</li>
          <li><strong>Preferences cookies:</strong> Also known as "functionality cookies," these cookies allow a website to remember choices you have made in the past.</li>
          <li><strong>Statistics cookies:</strong> Also known as "performance cookies," these cookies collect information about how you use a website.</li>
          <li><strong>Marketing cookies:</strong> These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.</li>
        </ul>
        <h3>How to manage cookies</h3>
        <p>You can change your cookie preferences at any time by clicking on the 'Cookie Settings' button at the bottom of our website. You can then adjust the available sliders to 'On' or 'Off', then clicking 'Save and close'. You may need to refresh your page for your settings to take effect.</p>
      `
  }
}

export default async function CookiesPolicyPage() {
  const content = await getCookiesPolicyContent()

  return (
    <PolicyLayout title="Cookies Policy">
      <div className="prose prose-invert max-w-none">
        <SafeHTML html={content} />
      </div>
    </PolicyLayout>
  )
}