import { getPageContent } from '@/lib/controllers/dynamic-pages';
import { PolicyLayout, SafeHTML } from '@/components/policy-layout'

async function fetchAboutUsContent(): Promise<string> {
  try {
    const res = await getPageContent('about');
    return res.content;
  } catch (error) {
    return `
      <h2>Welcome to ${process.env.NEXT_PUBLIC_SITE_NAME}</h2>
      <p>${process.env.NEXT_PUBLIC_SITE_NAME} is a cutting-edge online gaming platform that brings together gamers from all around the world. Our mission is to provide an immersive and enjoyable gaming experience for players of all skill levels.</p>
      <h3>Our Story</h3>
      <p>Founded in 2023, ${process.env.NEXT_PUBLIC_SITE_NAME} started as a small project by a group of passionate gamers who wanted to create a platform that truly understood and catered to the needs of the gaming community.</p>
      <h3>Our Vision</h3>
      <p>We envision a world where gaming is not just a pastime, but a way to connect, learn, and grow. ${process.env.NEXT_PUBLIC_SITE_NAME} aims to be at the forefront of this revolution, constantly innovating and improving our platform to meet the evolving needs of gamers.</p>
      <h3>Join Us</h3>
      <p>Whether you're a casual gamer or a hardcore enthusiast, ${process.env.NEXT_PUBLIC_SITE_NAME} has something for everyone. Join our community today and be part of the next big thing in online gaming!</p>
    `;
  }
}

export default async function AboutPage() {
  const content = await fetchAboutUsContent();

  return (
    <PolicyLayout title="About Us">
      <div className="prose prose-invert max-w-none">
        <SafeHTML html={content} />
      </div>
    </PolicyLayout>
  )
}