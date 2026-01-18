'use client';

import { getAdSettings } from '@/lib/controllers/ads';
import React, { useEffect, useState } from 'react';

interface GamePageAdProps {
  adSlot: string;
  adFormat: string;
  dataFullWidthResponsive: boolean;
  className?: string;
}

export const GamePageAd: React.FC<GamePageAdProps> = ({
  adSlot,
  adFormat,
  dataFullWidthResponsive,
  className = '',
}) => {
  const [pubId, setPubId] = useState();
  useEffect(() => {
    try {
      const fetchAndSet = async () => {
        const {data, error} = await getAdSettings();
        if (data) {
          setPubId(data.google_client_id);
          console.log(pubId);
        }
      }
      fetchAndSet();
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('Ad loading error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
};