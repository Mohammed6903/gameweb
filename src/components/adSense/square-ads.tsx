"use client";
declare global {
    interface Window {
        adsbygoogle?: any[];
    }
}

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleAdProps {
    adClient: string;
    adSlot: string;
    adFormat?: string;
    fullWidthResponsive?: boolean;
    className?: string;
}

const SquareAd: React.FC<GoogleAdProps> = ({
    adClient, 
    adSlot, 
    adFormat = 'auto', 
    fullWidthResponsive = true,
    className
}) => {
    useEffect(() => {
        try {
        // Ensure window is defined (client-side only)
            if (typeof window !== 'undefined') {
                // Push the ad configuration when the component mounts
                // (window.adsbygoogle = window.adsbygoogle || []).push({});
                const adsbygoogle = window.adsbygoogle || []
                adsbygoogle.push({})
            }
        } catch (error) {
            console.error('Error pushing ad configuration:', error);
        }
    }, [adClient]);

    return (
        <div key={`client-${adClient}`}>
            {/* Google AdSense Script */}
            <Script 
                async 
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`} 
                crossOrigin="anonymous"
            />
            
            {/* Ad Unit */}
            <ins 
                className={`adsbygoogle ${className || ''}`}
                key={`ad-${adSlot}`} 
                style={{ display: 'block' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
            <Script
                id={`adsbygoogle-init-${adSlot}`}
                strategy="afterInteractive"
            >
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </div>
    );
};

export default SquareAd;

// Usage Example:
// <GoogleAd 
//   adClient="ca-pub-xxxxxxxxx" 
//   adSlot="9772612530" 
//   className="my-custom-ad-class"
// />