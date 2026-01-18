import {create} from 'zustand';

interface MetadataState {
  siteName: string;
  setSiteName: (siteName: string) => void;
}

export const useMetadataStore = create<MetadataState>((set) => ({
  siteName: 'Game Web',
  setSiteName: (siteName) => set({ siteName }),
}));
