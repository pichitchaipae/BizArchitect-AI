import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessCanvasState, ArchitectResponse, ChatMessage, TechStack } from "../types";

const STACK_KNOWLEDGE: Record<TechStack, string> = {
  opensource: `
    ACTIVE TECH STACK: "Modern Open Source" (Best for Startups/Portfolios).
    Use these SPECIFIC tools for 'Key Resources' and 'Key Activities':
    - Database (BaaS): "Supabase" (PostgreSQL, real-time, great for analytics/PowerBI) or "Appwrite" (Self-hosted privacy).
    - Frontend: "Next.js" (React) - The industry standard for SEO and data fetching.
    - DevOps: "GitHub Actions" (CI/CD built into repo).
    - Hosting: "Vercel" (for Next.js) or "Coolify" (Self-hosted Heroku alternative).
    - SecOps: "Wazuh" (Open-source threat detection) or "Snyk" (Vulnerability scanning).
    - Why: This stack replaces managed services with open tools giving more control and lower cost.
  `,
  enterprise: `
    ACTIVE TECH STACK: "The Enterprise Stack" (Microsoft Ecosystem).
    Use these SPECIFIC tools for 'Key Resources' and 'Key Activities':
    - Database: "Microsoft SQL Server" (Gold standard for business data) or "Azure Cosmos DB".
    - DevOps: "Azure DevOps" (Integrated boards, pipelines, and repos).
    - SecOps: "Microsoft Sentinel" (AI-powered security analytics).
    - Context: Target Banks, Oil & Gas, Large Retail.
    - Integration: Mention "Power BI", "Excel", and "Outlook" integration as a Key Advantage.
  `,
  aws: `
    ACTIVE TECH STACK: "Cloud Native" (AWS Ecosystem).
    Use these SPECIFIC tools for 'Key Resources' and 'Key Activities':
    - Database: "AWS Amplify" (Cognito + DynamoDB) for rapid backend.
    - DevOps: "GitLab CI/CD" (Preferred by pure engineering teams).
    - SecOps: "CrowdStrike Falcon" or "Splunk" (Log analysis).
    - Context: Global Tech Giants, Standard Cloud Native flows.
  `,
  google: `
    ACTIVE TECH STACK: "100% Google Cloud".
    Use these SPECIFIC tools for 'Key Resources' and 'Key Activities':
    - Database: "Cloud SQL", "AlloyDB" (High perf Postgres), or "Cloud Spanner" (Global).
    - DevOps: "Infrastructure Manager" (Terraform), "Cloud Build", "Cloud Deploy".
    - Hosting: "Cloud Run".
    - SecOps: "Google Security Operations" (Chronicle), "Security Command Center".
  `
};

const SYSTEM_INSTRUCTION_TEMPLATE = (stackKnowledge: string) => `
You are "BizArchitect AI", a Solutions Architect specializing in the specific tech stack provided below.
Your goal is to help an entrepreneur build a robust Business Model Canvas (BMC).

${stackKnowledge}

CRITICAL INSTRUCTION:
When analyzing the "Key Resources" and "Key Activities" blocks, you must ONLY recommend technologies from the ACTIVE TECH STACK above.
Do not recommend Google tools if the Active Stack is Open Source.
Do not recommend AWS tools if the Active Stack is Enterprise.

The user will provide text, audio transcripts, or images.
You must analyze the input and strictly output a JSON object containing two parts:
1. "canvasUpdate": A structured state of the BMC.
    - "strong": User explicitly stated it.
    - "assumed": You inferred it.
    - "missing": Not addressed.
    - For 'Key Resources'/'Key Activities': AUTO-FILL these based on the ACTIVE TECH STACK. 
      (e.g., If 'opensource', automatically list 'Supabase' and 'Next.js' as resources for a web app idea).

2. "responseToUser": A conversational response.
    - Briefly acknowledge the idea.
    - Explain WHY you selected the specific tools from the Active Stack (e.g., "I've selected Supabase for your database because it allows direct PowerBI connection...").
    - Ask ONE probing question for a 'missing' section (Red).
`;

const canvasItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: { type: Type.STRING, description: "The content of this canvas block. Keep it bulleted or concise." },
    status: { type: Type.STRING, enum: ["strong", "assumed", "missing"], description: "Validation status of this block." },
    reasoning: { type: Type.STRING, description: "Internal reasoning or the question that needs to be answered for this block." },
  },
  required: ["content", "status", "reasoning"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    responseToUser: { type: Type.STRING, description: "The chat message to display to the user." },
    canvasUpdate: {
      type: Type.OBJECT,
      properties: {
        valueProposition: canvasItemSchema,
        customerSegments: canvasItemSchema,
        channels: canvasItemSchema,
        customerRelationships: canvasItemSchema,
        revenueStreams: canvasItemSchema,
        keyResources: canvasItemSchema,
        keyActivities: canvasItemSchema,
        keyPartners: canvasItemSchema,
        costStructure: canvasItemSchema,
      },
      required: [
        "valueProposition", "customerSegments", "channels", "customerRelationships", 
        "revenueStreams", "keyResources", "keyActivities", "keyPartners", "costStructure"
      ],
    },
  },
  required: ["responseToUser", "canvasUpdate"],
};

export const analyzeBusinessIdea = async (
  history: ChatMessage[],
  currentText: string,
  currentImageBase64: string | null,
  currentCanvas: BusinessCanvasState,
  selectedStack: TechStack
): Promise<ArchitectResponse> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-2.5-flash";

  const historyParts = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const parts: any[] = [];
  
  const contextPrompt = `
  Current Canvas State (JSON):
  ${JSON.stringify(currentCanvas)}
  
  User Input:
  ${currentText}
  `;
  
  parts.push({ text: contextPrompt });

  if (currentImageBase64) {
    const base64Data = currentImageBase64.split(',')[1] || currentImageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  // Inject the specific knowledge base based on selection
  const dynamicInstruction = SYSTEM_INSTRUCTION_TEMPLATE(STACK_KNOWLEDGE[selectedStack]);

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...historyParts,
        { role: 'user', parts: parts }
      ],
      config: {
        systemInstruction: dynamicInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText) as ArchitectResponse;
    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};