import axios from 'axios';
import { StravaActivity } from '@/types/strava';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const stravaApi = {
  // Fetch activities from our Express proxy (with pagination)
  fetchActivities: async (accessToken: string, totalActivities = 100): Promise<StravaActivity[]> => {
    try {
      const allActivities: StravaActivity[] = [];
      const perPage = 50; // Max per page allowed by Strava
      let page = 1;
      let hasMore = true;

      while (hasMore && allActivities.length < totalActivities) {
        const response = await axios.get(`${API_URL}/api/activities`, {
          params: {
            access_token: accessToken,
            per_page: perPage,
            page: page
          }
        });

        const activities = response.data;
        
        if (activities.length === 0) {
          hasMore = false;
        } else {
          allActivities.push(...activities);
          page++;
          
          // Stop if we got fewer activities than requested (last page)
          if (activities.length < perPage) {
            hasMore = false;
          }
        }

        // Safety break to avoid infinite loops
        if (page > 20) break; // Max 1000 activities (20 pages × 50)
      }

      console.log(`Fetched ${allActivities.length} activities from Strava`);
      return allActivities;
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