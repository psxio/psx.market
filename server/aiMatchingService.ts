import type { Builder, Service } from "@shared/schema";

interface MatchingCriteria {
  projectDescription?: string;
  category?: string;
  budget?: string;
  timeline?: string;
  requirements?: string[];
  technicalNeeds?: string[];
}

interface BuilderScore {
  builder: Builder;
  score: number;
  reasoning: string;
  matchedSkills: string[];
  services?: Service[];
}

interface RecommendationResult {
  topMatches: BuilderScore[];
  alternativeMatches: BuilderScore[];
  insights: string;
}

const OPENAI_API_KEY = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";

export class AIMatchingService {
  private async callOpenAI(messages: any[], temperature = 0.7, jsonMode = false): Promise<any> {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async matchBuildersToProject(
    criteria: MatchingCriteria,
    builders: Builder[],
    builderServices: Map<string, Service[]>
  ): Promise<RecommendationResult> {
    const buildersData = builders.map(builder => ({
      id: builder.id,
      name: builder.name,
      category: builder.category,
      headline: builder.headline,
      bio: builder.bio,
      skills: builder.skills,
      rating: builder.rating,
      completedProjects: builder.completedProjects,
      services: builderServices.get(builder.id)?.map(s => ({
        title: s.title,
        description: s.description,
        basicPrice: s.basicPrice,
        standardPrice: s.standardPrice,
        premiumPrice: s.premiumPrice,
        deliveryTime: s.deliveryTime,
      })) || [],
    }));

    const prompt = `You are an expert matchmaking system for a Web3 marketplace connecting clients with builders.

Client's Project Requirements:
${criteria.projectDescription ? `Description: ${criteria.projectDescription}` : ''}
${criteria.category ? `Category: ${criteria.category}` : ''}
${criteria.budget ? `Budget: ${criteria.budget}` : ''}
${criteria.timeline ? `Timeline: ${criteria.timeline}` : ''}
${criteria.requirements ? `Requirements: ${criteria.requirements.join(', ')}` : ''}
${criteria.technicalNeeds ? `Technical Needs: ${criteria.technicalNeeds.join(', ')}` : ''}

Available Builders:
${JSON.stringify(buildersData, null, 2)}

Analyze each builder and provide:
1. A match score (0-100) based on skills, experience, category alignment, and service offerings
2. Reasoning for the score
3. Specific matched skills/services
4. Overall insights about the matching results

Return a JSON object with this structure:
{
  "matches": [
    {
      "builderId": "builder-id",
      "score": 85,
      "reasoning": "explanation",
      "matchedSkills": ["skill1", "skill2"]
    }
  ],
  "insights": "Overall analysis and recommendations"
}

Prioritize builders with relevant category, proven track record (high rating + completed projects), and services that match the requirements.`;

    const response = await this.callOpenAI([
      { role: "system", content: "You are an expert matchmaking AI for a Web3 marketplace." },
      { role: "user", content: prompt }
    ], 0.3, true);

    const aiResult = JSON.parse(response);
    
    const scoredBuilders: BuilderScore[] = aiResult.matches
      .map((match: any) => {
        const builder = builders.find(b => b.id === match.builderId);
        if (!builder) return null;
        
        return {
          builder,
          score: match.score,
          reasoning: match.reasoning,
          matchedSkills: match.matchedSkills || [],
          services: builderServices.get(builder.id) || [],
        };
      })
      .filter((b: any) => b !== null)
      .sort((a: BuilderScore, b: BuilderScore) => b.score - a.score);

    return {
      topMatches: scoredBuilders.slice(0, 5).filter(b => b.score >= 70),
      alternativeMatches: scoredBuilders.slice(5, 10).filter(b => b.score >= 50),
      insights: aiResult.insights,
    };
  }

  async findSimilarBuilders(
    targetBuilder: Builder,
    allBuilders: Builder[],
    limit = 4
  ): Promise<BuilderScore[]> {
    const otherBuilders = allBuilders.filter(b => b.id !== targetBuilder.id);
    
    if (otherBuilders.length === 0) {
      return [];
    }

    const prompt = `Find the most similar builders to the target builder based on category, skills, and services.

Target Builder:
Name: ${targetBuilder.name}
Category: ${targetBuilder.category}
Skills: ${targetBuilder.skills?.join(', ') || 'None listed'}
Headline: ${targetBuilder.headline || 'None'}

Other Builders:
${otherBuilders.map(b => `
ID: ${b.id}
Name: ${b.name}
Category: ${b.category}
Skills: ${b.skills?.join(', ') || 'None'}
Headline: ${b.headline || 'None'}
`).join('\n')}

Return JSON with the top ${limit} most similar builders:
{
  "similarBuilders": [
    {
      "builderId": "id",
      "score": 85,
      "reasoning": "why similar",
      "matchedSkills": ["shared skills"]
    }
  ]
}`;

    const response = await this.callOpenAI([
      { role: "system", content: "You are an expert at finding similar profiles in a marketplace." },
      { role: "user", content: prompt }
    ], 0.3, true);

    const aiResult = JSON.parse(response);
    
    return aiResult.similarBuilders
      .map((match: any) => {
        const builder = otherBuilders.find(b => b.id === match.builderId);
        if (!builder) return null;
        
        return {
          builder,
          score: match.score,
          reasoning: match.reasoning,
          matchedSkills: match.matchedSkills || [],
        };
      })
      .filter((b: any) => b !== null)
      .slice(0, limit);
  }

  async generateServiceRecommendations(
    targetService: Service,
    allServices: Array<{ service: Service; builder: Builder | null }>
  ): Promise<Array<{ service: Service; builder: Builder | null; reasoning: string }>> {
    const otherServices = allServices.filter(s => s.service.id !== targetService.id);
    
    if (otherServices.length === 0) {
      return [];
    }

    const prompt = `Recommend complementary or similar services based on the target service.

Target Service:
Title: ${targetService.title}
Description: ${targetService.description}
Category: ${targetService.category}
Tags: ${targetService.tags?.join(', ') || 'None'}

Other Services:
${otherServices.slice(0, 20).map((item, idx) => `
${idx + 1}. ID: ${item.service.id}
   Title: ${item.service.title}
   Category: ${item.service.category}
   Description: ${item.service.description.substring(0, 150)}...
   Builder: ${item.builder?.name || 'Unknown'}
`).join('\n')}

Return JSON with the top 4 recommended services:
{
  "recommendations": [
    {
      "serviceId": "id",
      "reasoning": "why recommended (complementary/similar/useful)"
    }
  ]
}`;

    const response = await this.callOpenAI([
      { role: "system", content: "You are an expert at recommending complementary services." },
      { role: "user", content: prompt }
    ], 0.4, true);

    const aiResult = JSON.parse(response);
    
    return aiResult.recommendations
      .map((rec: any) => {
        const item = otherServices.find(s => s.service.id === rec.serviceId);
        if (!item) return null;
        
        return {
          service: item.service,
          builder: item.builder,
          reasoning: rec.reasoning,
        };
      })
      .filter((r: any) => r !== null)
      .slice(0, 4);
  }

  async generateQuizQuestions(category?: string): Promise<any[]> {
    const categoryContext = category 
      ? `Focus on ${category} specific questions.` 
      : 'Cover general project needs.';

    const prompt = `Generate 6 smart quiz questions to help match clients with Web3 builders.

Context: ${categoryContext}

Questions should cover:
1. Project type/goal
2. Technical requirements
3. Budget range
4. Timeline
5. Specific features needed
6. Experience level preference

Return JSON array:
[
  {
    "id": "q1",
    "question": "What's your primary goal?",
    "type": "multiple-choice",
    "options": ["option1", "option2", "option3", "option4"]
  }
]

Make questions practical and directly useful for matching.`;

    const response = await this.callOpenAI([
      { role: "system", content: "You are an expert at creating effective questionnaires." },
      { role: "user", content: prompt }
    ], 0.7, true);

    return JSON.parse(response);
  }
}

export const aiMatchingService = new AIMatchingService();
