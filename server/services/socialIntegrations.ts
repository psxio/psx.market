/**
 * Social Media Integration Service
 * Handles real data fetching from X/Twitter, GitHub, Instagram, YouTube
 */

interface GitHubProfile {
  login: string;
  name: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  bio: string;
  company: string | null;
  location: string | null;
  blog: string | null;
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  verified: boolean;
  verified_type?: string;
  profile_image_url: string;
  description?: string;
  location?: string;
  url?: string;
  created_at?: string;
}

interface YouTubeChannel {
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
}

export class SocialIntegrationService {
  
  /**
   * Fetch real GitHub profile data
   * No authentication required for public profiles
   */
  async getGitHubProfile(username: string): Promise<GitHubProfile | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CreatePSX-Platform'
        }
      });

      if (!response.ok) {
        console.error(`GitHub API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return {
        login: data.login,
        name: data.name,
        followers: data.followers,
        public_repos: data.public_repos,
        avatar_url: data.avatar_url,
        bio: data.bio,
        company: data.company,
        location: data.location,
        blog: data.blog
      };
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      return null;
    }
  }

  /**
   * Fetch GitHub repository stats
   */
  async getGitHubRepoStats(username: string): Promise<{ totalStars: number; totalForks: number } | null> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CreatePSX-Platform'
        }
      });

      if (!response.ok) {
        return null;
      }

      const repos = await response.json();
      const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
      const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

      return { totalStars, totalForks };
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      return null;
    }
  }

  /**
   * Get Twitter/X user profile data using API v2
   * Requires X_API_BEARER_TOKEN in environment
   */
  async getTwitterProfile(username: string): Promise<TwitterUser | null> {
    try {
      const bearerToken = process.env.X_API_BEARER_TOKEN;
      
      if (!bearerToken) {
        console.error('X_API_BEARER_TOKEN not configured');
        return null;
      }

      // Remove @ if present
      const cleanUsername = username.replace(/^@/, '');

      // Twitter API v2 - Get user by username
      const response = await fetch(
        `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=id,name,username,verified,verified_type,profile_image_url,description,location,url,public_metrics,created_at`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'User-Agent': 'port444-marketplace/1.0'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Twitter API error (${response.status}):`, errorText);
        return null;
      }

      const data = await response.json();
      
      if (!data.data) {
        console.error('Twitter user not found:', username);
        return null;
      }

      const user = data.data;
      const metrics = user.public_metrics || {};

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        followers_count: metrics.followers_count || 0,
        following_count: metrics.following_count || 0,
        tweet_count: metrics.tweet_count || 0,
        verified: user.verified || false,
        verified_type: user.verified_type,
        profile_image_url: user.profile_image_url?.replace('_normal', '_400x400') || '',
        description: user.description,
        location: user.location,
        url: user.url,
        created_at: user.created_at
      };
    } catch (error) {
      console.error('Error fetching Twitter profile:', error);
      return null;
    }
  }

  /**
   * Verify Twitter/X username exists
   */
  async verifyTwitterUsername(username: string): Promise<boolean> {
    const profile = await this.getTwitterProfile(username);
    return profile !== null;
  }

  /**
   * Extract username from Twitter URL
   */
  extractTwitterUsername(input: string): string | null {
    // Handle full URLs
    const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,15})/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Handle @username format
    const atMatch = input.match(/^@?([A-Za-z0-9_]{1,15})$/);
    if (atMatch) {
      return atMatch[1];
    }

    return null;
  }

  /**
   * Extract YouTube channel ID from URL
   */
  extractYouTubeChannelId(url: string): string | null {
    const patterns = [
      /youtube\.com\/channel\/([A-Za-z0-9_-]+)/,
      /youtube\.com\/c\/([A-Za-z0-9_-]+)/,
      /youtube\.com\/@([A-Za-z0-9_-]+)/,
      /youtube\.com\/user\/([A-Za-z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Validate Instagram username
   */
  validateInstagramUsername(username: string): boolean {
    const instagramUsernameRegex = /^[A-Za-z0-9._]{1,30}$/;
    return instagramUsernameRegex.test(username);
  }

  /**
   * Extract Instagram username from URL or handle
   */
  extractInstagramUsername(input: string): string | null {
    // Handle full URLs
    const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Handle @username format
    const atMatch = input.match(/^@?([A-Za-z0-9._]{1,30})$/);
    if (atMatch && this.validateInstagramUsername(atMatch[1])) {
      return atMatch[1];
    }

    return null;
  }

  /**
   * Extract Telegram handle
   */
  extractTelegramHandle(input: string): string | null {
    // Handle full URLs
    const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{5,32})/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Handle @username format
    const atMatch = input.match(/^@?([A-Za-z0-9_]{5,32})$/);
    if (atMatch) {
      return atMatch[1];
    }

    return null;
  }
}

export const socialIntegrationService = new SocialIntegrationService();
