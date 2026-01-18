import { Suspense } from 'react';
import { Metadata } from 'next';
import { getGameBySlug, getRelatedGames } from '@/lib/controllers/games';
import { getAuthenticatedUser } from '@/lib/controllers/users';
import { getAdSettings } from '@/lib/controllers/ads';
import dynamic from 'next/dynamic';
import Loading from './loading';
import { getMeta } from '@/lib/controllers/meta';

const GamePage = dynamic(() => import('./clientPage'), {
  loading: () => <Loading />
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  const metaResult = await getMeta();
  const metaData = metaResult.status === 200 ? metaResult.data || {} : {};
  const siteTitle = metaData.site_name || process.env.NEXT_PUBLIC_SITE_NAME;
  
  return {
    title: `Play ${game.name} | ${siteTitle}`,
    description: game.description,
    openGraph: {
      title: `Play ${game.name} | ${siteTitle}`,
      description: game.description,
      images: [{ url: game.thumbnail_url }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Play ${game.name} | ${siteTitle}`,
      description: game.description,
      images: [game.thumbnail_url],
    },
  };
}

export default async function ServerGamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [game, user, adResponse, relatedGames] = await Promise.all([
    getGameBySlug(slug),
    getAuthenticatedUser(),
    getAdSettings(),
    getRelatedGames(slug, 8)
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <GamePage 
        game={game} 
        user={user} 
        adSetting={adResponse.data}
        relatedGames={relatedGames}
      />
    </Suspense>
  );
}