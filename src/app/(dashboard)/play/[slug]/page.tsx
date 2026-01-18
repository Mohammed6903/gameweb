import { Suspense } from 'react';
import { Metadata } from 'next';
import { getGameBySlug } from '@/lib/controllers/games';
import { getAuthenticatedUser } from '@/lib/controllers/users';
import { getAdSettings } from '@/lib/controllers/ads';
import dynamic from 'next/dynamic';
import Loading from './loading';
import { getMeta } from '@/lib/controllers/meta';

const GamePage = dynamic(() => import('./clientPage'), {
  loading: () => <Loading />
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await getGameBySlug(params.slug);
  const metaResult = await getMeta();
  const metaData = metaResult.status === 200 ? metaResult.data || {} : {};
  const siteTitle = metaData.site_name || "Game Web";
  
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

export default async function ServerGamePage({ params }: { params: { slug: string } }) {
  const [game, user, adResponse] = await Promise.all([
    getGameBySlug(params.slug),
    getAuthenticatedUser(),
    getAdSettings()
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <GamePage 
        game={game} 
        user={user} 
        adSetting={adResponse.data}
      />
    </Suspense>
  );
}