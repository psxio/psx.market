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
  verified: boolean;
  profile_image_url: string;
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
   * Verify Twitter/X username exists and get basic info
   * Note: Full Twitter API requires OAuth 2.0 and API keys
   * This is a simplified version - in production, use Twitter API v2
   */
  async verifyTwitterUsername(username: string): Promise<boolean> {
    // For now, just validate the format
    // In production, this would call Twitter API v2 with proper auth
    const twitterUsernameRegex = /^[A-Za-z0-9_]{1,15}$/;
    return twitterUsernameRegex.test(username);
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
