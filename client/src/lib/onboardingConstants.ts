// Dual-Platform Onboarding Constants
// Based on Based Creators specification

export const PORT444_CATEGORIES = [
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "blockchain", label: "Blockchain & Web3" },
  { value: "smart_contracts", label: "Smart Contract Development" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "branding", label: "Branding & Identity" },
  { value: "video_editing", label: "Video Editing" },
  { value: "animation", label: "Animation & Motion" },
  { value: "3d_modeling", label: "3D Modeling" },
  { value: "content_writing", label: "Content Writing" },
  { value: "copywriting", label: "Copywriting" },
  { value: "seo_marketing", label: "SEO & Marketing" },
  { value: "social_media", label: "Social Media Management" },
  { value: "community_management", label: "Community Management" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "data_science", label: "Data Science" },
  { value: "devops", label: "DevOps & Infrastructure" },
  { value: "product_management", label: "Product Management" },
  { value: "consulting", label: "Consulting & Strategy" }
];

export const SKILL_SUGGESTIONS: Record<string, string[]> = {
  web_development: [
    "React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript",
    "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Express", "REST APIs",
    "GraphQL", "Webpack", "Vite", "Responsive Design"
  ],
  mobile_development: [
    "React Native", "Flutter", "Swift", "Kotlin", "iOS Development",
    "Android Development", "Mobile UI/UX", "App Store Optimization",
    "Firebase", "Push Notifications"
  ],
  blockchain: [
    "Web3.js", "Ethers.js", "Viem", "Wagmi", "RainbowKit", "WalletConnect",
    "Smart Contracts", "DeFi", "NFTs", "Blockchain Integration",
    "Ethereum", "Solana", "Base", "Polygon"
  ],
  smart_contracts: [
    "Solidity", "Rust", "Move", "Vyper", "Hardhat", "Foundry",
    "Truffle", "OpenZeppelin", "ERC-20", "ERC-721", "ERC-1155",
    "Smart Contract Auditing", "Gas Optimization", "DeFi Protocols"
  ],
  ui_ux_design: [
    "Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing",
    "User Research", "Usability Testing", "Design Systems", 
    "Mobile-First Design", "Accessibility", "Interaction Design"
  ],
  graphic_design: [
    "Photoshop", "Illustrator", "InDesign", "Affinity Designer",
    "Logo Design", "Brand Identity", "Print Design", "Digital Art",
    "Typography", "Color Theory", "Layout Design"
  ],
  branding: [
    "Brand Strategy", "Visual Identity", "Logo Design", "Brand Guidelines",
    "Style Guides", "Brand Positioning", "Marketing Materials",
    "Packaging Design", "Corporate Identity"
  ],
  video_editing: [
    "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve",
    "After Effects", "Motion Graphics", "Color Grading",
    "Sound Design", "Video Production", "YouTube Editing"
  ],
  animation: [
    "After Effects", "Blender", "Cinema 4D", "Maya", "Motion Graphics",
    "2D Animation", "3D Animation", "Character Animation", "Rigging"
  ],
  "3d_modeling": [
    "Blender", "Cinema 4D", "Maya", "3ds Max", "ZBrush",
    "Substance Painter", "3D Rendering", "Character Modeling",
    "Product Visualization", "Texturing", "UV Mapping"
  ],
  content_writing: [
    "SEO Writing", "Blog Writing", "Technical Writing", "Copywriting",
    "Content Strategy", "Research", "Editing", "Proofreading",
    "Web Content", "Long-form Content"
  ],
  copywriting: [
    "Sales Copy", "Landing Pages", "Email Marketing", "Ad Copy",
    "Product Descriptions", "Brand Voice", "Conversion Copywriting",
    "UX Writing", "Headlines", "Call-to-Actions"
  ],
  seo_marketing: [
    "SEO", "Google Analytics", "Keyword Research", "Link Building",
    "Content Marketing", "On-Page SEO", "Technical SEO",
    "Google Ads", "PPC", "Conversion Optimization"
  ],
  social_media: [
    "Social Media Strategy", "Content Calendar", "Community Engagement",
    "Instagram Marketing", "Twitter Marketing", "TikTok Marketing",
    "LinkedIn Marketing", "Social Media Analytics", "Influencer Marketing"
  ],
  community_management: [
    "Discord Management", "Telegram Management", "Community Building",
    "Moderation", "Engagement Strategies", "Community Growth",
    "Event Planning", "Ambassador Programs"
  ],
  ai_ml: [
    "Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning",
    "Neural Networks", "NLP", "Computer Vision", "Model Training",
    "Data Preprocessing", "OpenAI API", "LLMs"
  ],
  data_science: [
    "Python", "R", "SQL", "Data Analysis", "Data Visualization",
    "Pandas", "NumPy", "Scikit-learn", "Tableau", "Power BI",
    "Statistical Analysis", "A/B Testing"
  ],
  devops: [
    "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD",
    "Jenkins", "GitHub Actions", "Terraform", "Monitoring",
    "Linux", "Shell Scripting", "Infrastructure as Code"
  ],
  product_management: [
    "Product Strategy", "Roadmap Planning", "User Stories", "Agile",
    "Scrum", "Product Analytics", "A/B Testing", "User Research",
    "Stakeholder Management", "Go-to-Market Strategy"
  ],
  consulting: [
    "Business Strategy", "Market Analysis", "Competitive Analysis",
    "Growth Strategy", "Tokenomics", "Go-to-Market", "Pitch Decks",
    "Business Development", "Partnership Strategy"
  ]
};

export const YEARS_OF_EXPERIENCE = [
  { value: "less_than_1", label: "Less than 1 year" },
  { value: "1_2", label: "1-2 years" },
  { value: "3_5", label: "3-5 years" },
  { value: "5_10", label: "5-10 years" },
  { value: "10_plus", label: "10+ years" }
];

export const LANGUAGES = [
  "English", "Spanish", "Mandarin", "French", "German", 
  "Japanese", "Portuguese", "Arabic", "Hindi", "Russian"
];

export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" }
];

export const INDUSTRIES = [
  "Web3 Development",
  "Blockchain Technology",
  "DeFi",
  "NFTs & Digital Art",
  "Software Development",
  "Design & Creative",
  "Marketing & Growth",
  "Consulting",
  "Content Creation",
  "Other"
];
