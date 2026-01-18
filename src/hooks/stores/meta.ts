import {create} from 'zustand';

interface MetadataState {
  siteName: string;
  setSiteName: (siteName: string) => void;
}

export const useMetadataStore = create<MetadataState>((set) => ({
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Game Web",
  setSiteName: (siteName) => set({ siteName }),
}));
