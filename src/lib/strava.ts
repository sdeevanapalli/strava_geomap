import axios from 'axios';
import { StravaActivity } from '@/types/strava';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const stravaApi = {
  // Fetch activities from our Express proxy
  fetchActivities: async (accessToken: string, perPage = 30): Promise<StravaActivity[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/activities`, {
        params: {
          access_token: accessToken,
          per_page: perPage,
          page: 1
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  // Get Strava authorization URL
  getAuthUrl: (): string => {
    return `${API_URL}/auth/strava`;
  }
};