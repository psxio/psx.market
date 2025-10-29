/**
 * Service for integrating with Based Creators Chapters platform
 * Handles cross-platform account creation and synchronization
 */

interface BasedCreatorsAccountData {
  name: string;
  email: string;
  walletAddress: string;
  region?: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  twitterHandle?: string;
  discordHandle?: string;
  skills?: string[];
}

interface BasedCreatorsResponse {
  success: boolean;
  userId?: string;
  error?: string;
}

export class BasedCreatorsApiService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    // These should be set in environment variables
    this.apiUrl = process.env.BASED_CREATORS_API_URL || 'https://basedcreators.xyz/api';
    this.apiKey = process.env.BASED_CREATORS_API_KEY || '';
  }

  /**
   * Create an account on Based Creators platform
   */
  async createAccount(accountData: BasedCreatorsAccountData): Promise<BasedCreatorsResponse> {
    if (!this.apiKey) {
      console.warn('BASED_CREATORS_API_KEY not configured - skipping chapters account creation');
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/external/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Source-Platform': 'port444',
        },
        body: JSON.stringify({
          name: accountData.name,
          email: accountData.email,
          walletAddress: accountData.walletAddress,
          region: accountData.region,
          role: accountData.role || 'Creator',
          bio: accountData.bio,
          profileImage: accountData.profileImage,
          twitterHandle: accountData.twitterHandle,
          discordHandle: accountData.discordHandle,
          skills: accountData.skills,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Based Creators API error:', error);
        return {
          success: false,
          error: error.error || `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      console.log('Based Creators account created:', data.userId);
      return {
        success: true,
        userId: data.userId,
      };
    } catch (error: any) {
      console.error('Failed to create Based Creators account:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Update an existing account on Based Creators platform
   */
  async updateAccount(userId: string, updates: Partial<BasedCreatorsAccountData>): Promise<BasedCreatorsResponse> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(`${this.apiUrl}/external/update-account/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Source-Platform': 'port444',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        return {
          success: false,
          error: error.error || `HTTP ${response.status}`,
        };
      }

      return { success: true, userId };
    } catch (error: any) {
      console.error('Failed to update Based Creators account:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  /**
   * Check if an account exists on Based Creators by wallet address
   */
  async findAccountByWallet(walletAddress: string): Promise<{ exists: boolean; userId?: string }> {
    if (!this.apiKey) {
      return { exists: false };
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/external/find-account?wallet=${encodeURIComponent(walletAddress)}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'X-Source-Platform': 'port444',
          },
        }
      );

      if (!response.ok) {
        return { exists: false };
      }

      const data = await response.json();
      return {
        exists: data.exists,
        userId: data.userId,
      };
    } catch (error) {
      console.error('Error checking Based Creators account:', error);
      return { exists: false };
    }
  }
}

// Singleton instance
export const basedCreatorsApi = new BasedCreatorsApiService();
