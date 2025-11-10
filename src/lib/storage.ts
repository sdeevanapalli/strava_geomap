import { StravaTokens } from '@/types/strava';

const STORAGE_KEY = 'strava_tokens';

export const storage = {
  saveTokens: (tokens: StravaTokens): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  },

  getTokens: (): StravaTokens | null => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clearTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  isTokenExpired: (expiresAt: number): boolean => {
    return Date.now() / 1000 > expiresAt;
  }
};