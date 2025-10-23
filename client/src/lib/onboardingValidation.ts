export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
}

export interface OnboardingFormData {
  name: string;
  email: string;
  walletAddress: string;
  headline: string;
  bio: string;
  category: string;
  skills: string[];
  portfolioLinks: string[];
  twitterHandle: string;
  responseTime: string;
  profileImage?: string;
  [key: string]: any;
}

export function validateStep1(data: OnboardingFormData): ValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
    missingFields.push("name");
  }

  if (!data.email || !data.email.includes("@")) {
    errors.push("Please enter a valid email address");
    missingFields.push("email");
  }

  if (!data.walletAddress) {
    errors.push("Please connect your wallet");
    missingFields.push("walletAddress");
  }

  if (!data.headline || data.headline.trim().length < 10) {
    errors.push("Professional headline must be at least 10 characters");
    missingFields.push("headline");
  }

  if (!data.bio || data.bio.trim().length < 50) {
    errors.push("Bio must be at least 50 characters");
    missingFields.push("bio");
  }

  if (!data.category) {
    errors.push("Please select a category");
    missingFields.push("category");
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingFields,
  };
}

export function validateStep2(data: OnboardingFormData): ValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];

  if (!data.skills || data.skills.length < 3) {
    errors.push("Please add at least 3 skills");
    missingFields.push("skills");
  }

  if (!data.portfolioLinks || data.portfolioLinks.length < 1) {
    errors.push("Please add at least 1 portfolio link");
    missingFields.push("portfolioLinks");
  }

  if (!data.responseTime) {
    errors.push("Please select your typical response time");
    missingFields.push("responseTime");
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingFields,
  };
}

export function validateStep3(data: OnboardingFormData): ValidationResult {
  const errors: string[] = [];
  const missingFields: string[] = [];

  // Category-specific validation
  if (data.category === "kols") {
    // Require at least one social media platform to be connected
    const hasTwitter = data.twitterHandle && data.twitterHandle.trim().length > 0;
    const hasInstagram = data.instagramHandle && data.instagramHandle.trim().length > 0;
    const hasYoutube = data.youtubeChannel && data.youtubeChannel.trim().length > 0;
    
    if (!hasTwitter && !hasInstagram && !hasYoutube) {
      errors.push("Please connect at least one social media platform (Twitter, Instagram, or YouTube)");
      missingFields.push("socialMedia");
    }
    
    // No engagement rate requirement - will be calculated from API data
  } else if (data.category === "3d-artists") {
    if (!data.software3D || data.software3D.length < 1) {
      errors.push("Please list at least one 3D software you use");
      missingFields.push("software3D");
    }
  } else if (data.category === "developers") {
    if (!data.programmingLanguages || data.programmingLanguages.length < 1) {
      errors.push("Please list at least one programming language");
      missingFields.push("programmingLanguages");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingFields,
  };
}

export function getStepEstimatedTime(step: number): number {
  const times = {
    1: 3, // 3 minutes for basic info
    2: 4, // 4 minutes for professional details
    3: 5, // 5 minutes for category-specific info
    4: 2, // 2 minutes for review
  };
  return times[step as keyof typeof times] || 3;
}

export function getTotalTimeRemaining(currentStep: number): number {
  let total = 0;
  for (let i = currentStep; i <= 4; i++) {
    total += getStepEstimatedTime(i);
  }
  return total;
}

export function calculateProfileStrength(data: OnboardingFormData): number {
  let strength = 0;
  const maxPoints = 100;

  // Basic Info (30 points)
  if (data.name) strength += 5;
  if (data.email) strength += 5;
  if (data.walletAddress) strength += 5;
  if (data.headline && data.headline.length >= 20) strength += 5;
  if (data.bio && data.bio.length >= 100) strength += 5;
  if (data.category) strength += 5;

  // Professional Details (30 points)
  if (data.skills && data.skills.length >= 3) strength += 10;
  if (data.skills && data.skills.length >= 5) strength += 5;
  if (data.portfolioLinks && data.portfolioLinks.length >= 2) strength += 10;
  if (data.twitterHandle) strength += 5;

  // Media & Profile (20 points)
  if (data.profileImage) strength += 10;
  if (data.portfolioMedia && data.portfolioMedia.length > 0) strength += 10;

  // Category-Specific (20 points)
  if (data.category === "kols") {
    if (data.twitterFollowers) strength += 5;
    if (data.engagementRate) strength += 5;
    if (data.contentNiches && data.contentNiches.length > 0) strength += 5;
    if (data.brandPartnerships && data.brandPartnerships.length > 0) strength += 5;
  } else if (data.category === "3d-artists") {
    if (data.software3D && data.software3D.length > 0) strength += 10;
    if (data.renderEngines && data.renderEngines.length > 0) strength += 5;
    if (data.styleSpecialties && data.styleSpecialties.length > 0) strength += 5;
  } else if (data.category === "developers") {
    if (data.programmingLanguages && data.programmingLanguages.length > 0) strength += 10;
    if (data.githubProfile) strength += 10;
  }

  return Math.min(strength, maxPoints);
}

export function getProfileStrengthSuggestions(data: OnboardingFormData): string[] {
  const suggestions: string[] = [];

  if (!data.profileImage) {
    suggestions.push("Add a professional profile photo (+10%)");
  }

  if (!data.skills || data.skills.length < 5) {
    suggestions.push("Add more skills (target: 5+) for better visibility");
  }

  if (!data.portfolioLinks || data.portfolioLinks.length < 2) {
    suggestions.push("Add more portfolio links to showcase your work");
  }

  if (data.bio && data.bio.length < 200) {
    suggestions.push("Expand your bio to at least 200 characters");
  }

  if (!data.twitterHandle) {
    suggestions.push("Link your Twitter profile for social proof");
  }

  return suggestions;
}
