
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Vite runs in the browser, so `process.env` isn't available.
 *
 * SECURITY NOTE:
 * - Any API key used in a purely client-side app can be extracted.
 * - For production, proxy Gemini requests through a server you control.
 * - For local/internal use, this app supports a key via:
 *   1) localStorage (recommended so you don't bake it into the bundle)
 *   2) Vite env var `VITE_GEMINI_API_KEY` (less safe)
 */
const API_KEY_STORAGE = "latimore.gemini_api_key";

export const getGeminiApiKey = () => {
  const fromStorage = typeof window !== "undefined" ? window.localStorage.getItem(API_KEY_STORAGE) : null;
  const fromEnv = (import.meta as any)?.env?.VITE_GEMINI_API_KEY as string | undefined;
  return (fromStorage?.trim() || fromEnv?.trim() || "").trim();
};

export const setGeminiApiKey = (key: string) => {
  if (typeof window === "undefined") return;
  const v = (key || "").trim();
  if (!v) window.localStorage.removeItem(API_KEY_STORAGE);
  else window.localStorage.setItem(API_KEY_STORAGE, v);
};

const getAI = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Add one in Settings → Integrations.");
  }
  return new GoogleGenAI({ apiKey });
};

// Canonical Brand Metadata from documentation
const BRAND_LOCK = {
  name: "Latimore Life & Legacy LLC",
  founder: "Jackson M. Latimore Sr.",
  region: "Schuylkill, Luzerne, and Northumberland Counties in Pennsylvania",
  tagline: "Protecting Today. Securing Tomorrow.",
  hashtag: "#TheBeatGoesOn",
  mission: "Help families and organizations protect what matters and build legacies that outlive them — using clear education and preparation, never fear-based messaging.",
  origin: "Founder Jackson M. Latimore Sr. survived sudden cardiac arrest in 2010. This story is the official brand origin and should be referenced respectfully, highlighting that preparation becomes legacy.",
  carriers: ["North American", "F&G", "American Equity", "Ethos", "American General"]
};

export const generateSocialContent = async (topic: string, platform: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Brand-Locked Content Engine for ${BRAND_LOCK.name}.
      
      NON-NEGOTIABLES:
      1. Brand Voice: Authentic, personal, community-focused (Central PA), educational, and urgent but NOT fear-based.
      2. No morbid language. Emphasize preparation and love for family.
      3. Include tagline: "${BRAND_LOCK.tagline}"
      4. Include hashtag: "${BRAND_LOCK.hashtag}"
      5. Serving: ${BRAND_LOCK.region}.
      
      Generate 3 post drafts for ${platform} about: "${topic}".`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              draft: { type: Type.STRING },
              platform: { type: Type.STRING }
            },
            required: ["title", "draft", "platform"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const generateContentFromAsset = async (base64Data: string, mimeType: string, platform: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `You are the Brand-Locked Content Engine for ${BRAND_LOCK.name}. 
            
            TASK: Analyze the provided carrier product document (PDF or Image) and extract key features, benefits, and educational points. 
            Then, generate 3 educational social media drafts for ${platform}.
            
            NON-NEGOTIABLES:
            1. Brand Voice: Authentic, Central PA community-focused, educational, urgent but NOT fear-based.
            2. Reference specific benefits from the document (e.g. Living Benefits, Cash Value Growth, etc.).
            3. No morbid language. Emphasize legacy and family protection.
            4. Include tagline: "${BRAND_LOCK.tagline}"
            5. Include hashtag: "${BRAND_LOCK.hashtag}"`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              draft: { type: Type.STRING },
              platform: { type: Type.STRING }
            },
            required: ["title", "draft", "platform"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Asset Analysis Error:", error);
    return [];
  }
};

export const generateBulkCampaign = async (goal: string, persona: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Architect a 4-post strategic "Legacy Campaign" for ${BRAND_LOCK.name}.
      Goal: ${goal}
      Target Persona: ${persona}
      Region: ${BRAND_LOCK.region}
      
      Requirements:
      1. Post 1: Educational Hook (The "Why").
      2. Post 2: Product Solution (Velocity or Depth Engine).
      3. Post 3: Social Proof / Community Story.
      4. Post 4: The Final CTA (Legacy Invitation).
      
      Ensure all posts follow the brand-locked rules: no fear, education-first, include tagline "${BRAND_LOCK.tagline}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              draft: { type: Type.STRING },
              platform: { type: Type.STRING },
              sequenceDay: { type: Type.NUMBER, description: "Day in the sequence (1, 7, 14, 21)" }
            },
            required: ["title", "draft", "platform", "sequenceDay"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Bulk Campaign Error:", error);
    return [];
  }
};

export const generateFunnelStrategy = async (goal: string, persona: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Architect a 3-stage high-conversion "Legacy Funnel" for ${BRAND_LOCK.name}.
      Goal: ${goal}
      Persona: ${persona}
      Region: ${BRAND_LOCK.region}
      
      STAGES:
      1. Awareness (Social Hook): Broad educational awareness to stop the scroll.
      2. Engagement (Lead Magnet): A specific valuable offer (checklist, guide, calculator).
      3. Trust (Nurture Email): A deep-dive educational message to build trust before the ask.
      
      RULES:
      - Education-first, no fear.
      - Plain language (8th grade level).
      - Reference regional needs in Central PA.
      - Brand: ${BRAND_LOCK.name}. Tagline: ${BRAND_LOCK.tagline}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Awareness, Engagement, or Trust" },
              strategy: { type: Type.STRING, description: "The strategic logic for this stage" },
              assetCopy: { type: Type.STRING, description: "The actual headline and body copy for this stage's asset" }
            },
            required: ["name", "strategy", "assetCopy"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Funnel Generation Error:", error);
    return [];
  }
};

export const generateTemplateStructure = async (prompt: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a strategic content architect for ${BRAND_LOCK.name}.
      Based on the user's request: "${prompt}", generate a social media content template.
      Provide a concise name and a structured instructional logic focusing on protection and legacy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            structure: { type: Type.STRING }
          },
          required: ["name", "structure"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Template Generation Error:", error);
    return null;
  }
};

export const generateCanvaSpec = async (params: {
  goal: string;
  audience: string;
  platform: string;
  assetType: string;
}) => {
  const { goal, audience, platform, assetType } = params;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a creative director and brand-locked strategist for ${BRAND_LOCK.name}.

Brand & compliance:
- Voice: authentic, Central PA community-focused, educational, urgent but NOT fear-based.
- Avoid guarantees. No morbid language. Emphasize preparation, love, and legacy.
- Tagline must appear: "${BRAND_LOCK.tagline}"
- Hashtag must appear: "${BRAND_LOCK.hashtag}"
- Serving: ${BRAND_LOCK.region}

Task:
Create a Canva-ready creative specification for:
- Goal: ${goal}
- Audience: ${audience}
- Platform: ${platform}
- Asset type: ${assetType}

Output format (copy/paste, plain text):
1) Size + safe-area notes
2) Creative direction (layout hierarchy)
3) Copy set: Headline, Subheadline, Body, CTA (platform-appropriate)
4) Design notes: imagery ideas, iconography, spacing, accessibility
5) Compliance notes (what to avoid)
6) Include two variations:
   - Version A: Educational
   - Version B: Direct response
`,
    });

    return (response.text || "").trim();
  } catch (error) {
    console.error("Canva Spec Error:", error);
    throw error;
  }
};

export const generateClientSnapshot = async (notes: string, household: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Latimore Life Hub Intelligence Engine. 
      Analyze these notes for a family/client in ${BRAND_LOCK.region}.
      Notes: "${notes}"
      Household: "${household}"
      
      Tasks:
      1. Who they are (Persona: Accumulator, Protector, or Income Seeker).
      2. Family & local context.
      3. Financial picture.
      4. Goals.
      5. Risk/Opportunity themes (e.g., mortgage protection, IUL for tax-free growth).
      6. Summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whoTheyAre: { type: Type.STRING },
            familyContext: { type: Type.ARRAY, items: { type: Type.STRING } },
            financialPicture: { type: Type.ARRAY, items: { type: Type.STRING } },
            topGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["whoTheyAre", "familyContext", "financialPicture", "topGoals", "riskThemes", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Snapshot Error:", error);
    return null;
  }
};

export const generateReviewScript = async (clientData: any) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Latimore Legacy Strategic Review Engine. 
      Jackson M. Latimore Sr. is preparing for an annual review call with a client.
      
      CLIENT DATA:
      - Name: ${clientData.name}
      - County: ${clientData.county}
      - Household: ${clientData.household}
      - Current Product: ${clientData.productInterest}
      - Premium: ${clientData.monthlyPremium}
      - Notes: ${clientData.notes}
      
      TASK: Generate a "Legacy Review Script".
      1. Gratitude & Connection (Reference Central PA community roots).
      2. Policy Health Check (Confirm current protection).
      3. Life Changes Discovery (Ask about new kids, grandkids, or mortgage status).
      4. Strategic Opportunity (Suggest the next logical step—e.g., if they have Term, talk IUL. If they have IUL, mention FIA or Final Expense for parents).
      5. Closing with Tagline: "${BRAND_LOCK.tagline}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opening: { type: Type.STRING },
            discoveryQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicPivot: { type: Type.STRING },
            closing: { type: Type.STRING }
          },
          required: ["opening", "discoveryQuestions", "strategicPivot", "closing"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Review Script Error:", error);
    return null;
  }
};

export const chatWithGemini = async (message: string, history: any[]) => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the Latimore Legacy Business Co-Pilot.
        
        CANONICAL CONTEXT:
        - Brand: ${BRAND_LOCK.name}
        - Founder: ${BRAND_LOCK.founder} (Sudden cardiac arrest survivor)
        - Mission: ${BRAND_LOCK.mission}
        - Region: ${BRAND_LOCK.region}
        - Strategy: Dual-Engine Framework (Velocity via Ethos, Depth via IUL/FIA).
        
        YOUR ROLE:
        - Assist Jackson in managing ${BRAND_LOCK.region} clients.
        - Suggest content that follows "Brand-Locked" rules (no fear-based messaging).
        - Help with the 10-stage pipeline (New Lead to In Force).
        - Use the "Three Rules of Money" (Rule of 72, Growing Money, Tax Buckets).
        
        If asked about financial news, use Google Search tool.`,
        tools: [{ googleSearch: {} }]
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Jackson, I'm having a connection issue. Let's stay focused on the mission—how else can I help you protect our PA families?";
  }
};
