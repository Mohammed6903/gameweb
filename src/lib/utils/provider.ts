'use server'

import { Provider, ProviderFormData } from "@/components/admin/provider-form";
import { getAllProviders, upsertProvider } from '@/lib/controllers/providers';

// Provider configuration
const PROVIDER_CONFIGS: Record<string, ProviderFormData> = {
  gamepix: {
    name: "GamePix",
    url: "https://games.gamepix.com",
    description: "GamePix Games API Provider",
    is_active: true
  },
  gamemonetize: {
    name: "GameMonetize",
    url: "https://gamemonetize.com",
    description: "GameMonetize Games API Provider",
    is_active: true
  }
};

// Cache for providers to avoid repeated database calls
let providersCache: Provider[] | null = null;
let cacheExpiry: Date | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Updates the cache with a new provider
 * @param provider The provider to add to the cache
 */
function updateCache(provider: Provider) {
  if (!providersCache) {
    providersCache = [provider];
  } else {
    const index = providersCache.findIndex(p => p.url === provider.url);
    if (index >= 0) {
      providersCache[index] = provider;
    } else {
      providersCache.push(provider);
    }
  }
  
  // Reset cache expiry
  cacheExpiry = new Date(new Date().getTime() + CACHE_DURATION);
}

/**
 * Gets or creates a provider and returns its ID
 * @param providerKey The provider key ('gamepix' or 'gamemonetize')
 * @returns The provider's ID
 */
export async function getOrCreateProviderId(providerKey: 'gamepix' | 'gamemonetize'): Promise<string> {
  const currentTime = new Date();
  
  // Refresh cache if it's expired or doesn't exist
  if (!providersCache || !cacheExpiry || currentTime > cacheExpiry) {
    providersCache = await getAllProviders();
    cacheExpiry = new Date(currentTime.getTime() + CACHE_DURATION);
  }
  
  // Check if provider exists in cache
  const providerConfig = PROVIDER_CONFIGS[providerKey];
  const existingProvider = providersCache.find(
    p => p.url.toLowerCase() === providerConfig.url.toLowerCase()
  );
  
  if (existingProvider) {
    return existingProvider.id;
  }
  
  // Provider doesn't exist, create it
  const [newProvider] = await upsertProvider(providerConfig);
  
  // Update cache with new provider
  if (newProvider) {
    updateCache(newProvider);
    return newProvider.id;
  }
  
  throw new Error(`Failed to create provider: ${providerKey}`);
}

/**
 * Gets a provider's full details, creating it if it doesn't exist
 * @param providerKey The provider key ('gamepix' or 'gamemonetize')
 * @returns The provider object
 */
export async function getOrCreateProvider(providerKey: 'gamepix' | 'gamemonetize'): Promise<Provider> {
  const currentTime = new Date();
  
  // Refresh cache if it's expired or doesn't exist
  if (!providersCache || !cacheExpiry || currentTime > cacheExpiry) {
    providersCache = await getAllProviders();
    cacheExpiry = new Date(currentTime.getTime() + CACHE_DURATION);
  }
  
  // Check if provider exists in cache
  const providerConfig = PROVIDER_CONFIGS[providerKey];
  const existingProvider = providersCache.find(
    p => p.url.toLowerCase() === providerConfig.url.toLowerCase()
  );
  
  if (existingProvider) {
    return existingProvider;
  }
  
  // Provider doesn't exist, create it
  const [newProvider] = await upsertProvider(providerConfig);
  
  // Update cache with new provider
  if (newProvider) {
    updateCache(newProvider);
    return newProvider;
  }
  
  throw new Error(`Failed to create provider: ${providerKey}`);
}

/**
 * Clears the providers cache
 */
export async function clearProvidersCache() {
  providersCache = null;
  cacheExpiry = null;
}