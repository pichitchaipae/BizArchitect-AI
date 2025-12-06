import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessCanvasState, ArchitectResponse, ChatMessage, TechStack, AnalystRole } from "../types";

const STACK_KNOWLEDGE: Record<TechStack, string> = {
  opensource: `
    ACTIVE TECH STACK: "Modern Open Source" (Best for Startups/Portfolios).
    Use these SPECIFIC tools for 'Key Resources' and 'Key Activities':
    - Database (BaaS): "Supabase" (PostgreSQL, real-time, great for analytics/PowerBI) or "Appwrite" (Self-hosted privacy).
    - Frontend: "Next.js 14" (App Router) - The industry standard for SEO and Server Side Rendering.
    - Visualization: "Tremor" (React library for business dashboards).
    - DevOps: "GitHub Actions" (CI/CD built into repo).
    - Hosting: "Vercel" (Deploy Next.js in 1 click).
    - SecOps: "Wazuh" or "Snyk".
    - Why: Best for rapid prototyping and connecting business intelligence tools.
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

const ROLE_PERSONAS: Record<AnalystRole, string> = {
  business_dev: `
    ROLE: "Growth-Obsessed Startup Builder"
    TONE: Energetic, optimistic, action-oriented, focused on MVP and speed.
    KEYWORDS: MVP, Growth Hacking, Viral Loop, Tech Stack, Time-to-Market, User Acquisition, CAC.
    FOCUS: Rapid prototyping, leveraging modern tech (Next.js/Supabase) for speed, and viral growth strategies.
  `,
  mba_consultant: `
    ROLE: "Strategic MBA Consultant"
    TONE: Critical, professional, risk-averse, financially rigorous.
    KEYWORDS: Unit Economics, EBITDA, OpEx/CapEx, Burn Rate, Strategic Moats, Risk Mitigation, Supply Chain.
    FOCUS: Long-term sustainability, financial structure, investors' risk perspective, and operational efficiency.
  `
};

const SYSTEM_INSTRUCTION_TEMPLATE = (stackKnowledge: string, role: AnalystRole) => `
You are "BizArchitect AI".
${ROLE_PERSONAS[role]}

Your goal is to help an entrepreneur build a robust Business Model Canvas (BMC) using the specific tech stack provided below.

${stackKnowledge}

CRITICAL INSTRUCTION:
1. **Key Resources Formatting**: You must categorize the "Key Resources" block into standard MBA categories to show business maturity. Do not just list tools. Use this format:
   - **Intellectual Resources**: [Algorithms, Brand, Data, Patents]
   - **Tech Infrastructure**: [Insert specific tools from the ACTIVE TECH STACK here]
   - **Human Capital**: [Key roles, e.g., DevOps, Sales]
   - **Financial/Physical**: [Funding, Assets]
   
   *Reasoning*: Explain why the specific Tech Infrastructure tools (e.g., Supabase, Next.js) are critical for the business operation (e.g., "Real-time sync for B2B dashboards").

2. **Key Partners Formatting (Strategic Alliances)**:
   - **Acquisition Partners**: (e.g., Gyms/Influencers who lower CAC).
   - **Data Partners**: (e.g., Suppliers providing APIs).
   - **Technology Partners**: (e.g., Vercel/Google Cloud for infrastructure).
   *Logic*: Explain WHY they are strategic (Risk reduction, Resource sharing).

3. **Cost Structure Formatting (Unit Economics)**:
   - **Fixed Costs (OpEx)**: Salaries, Base server fees (Vercel Pro/Supabase Pro).
   - **Variable Costs (COGS)**: AI Token usage (Gemini API), Email sending fees.
   - **Token Optimization**: Explicitly mention how to optimize AI costs (e.g., "Use Flash model for free users").

4. **Key Activities**: Align activities with the chosen stack (e.g., "Deploying via Vercel", "Managing CI/CD with GitHub Actions").

5. **Guide the User**: If a detail is missing, ask a probing question based on your ROLE (Startup Builder asks about growth, MBA Consultant asks about profit).

6. **Suggestion Chips**: ALONG WITH YOUR ANSWER, you must generate 3 "Suggestion Chips". These are short, plausible answers or next steps the user might say.

The user will provide text, audio transcripts, or images.
You must analyze the input and strictly output a JSON object containing three parts:
1. "canvasUpdate": A structured state of the BMC.
    - "strong": User explicitly stated it.
    - "assumed": You inferred it.
    - "missing": Not addressed.
    - For 'Key Resources', 'Key Partners', and 'Cost Structure': AUTO-FILL these blocks using the strict formats defined above.
2. "responseToUser": A conversational response matching your ROLE's tone.
    - Briefly acknowledge the idea.
    - Explain WHY you selected the specific tools/strategies.
    - Ask ONE probing question for a 'missing' section (Red).
3. "suggestions": An array of 3 short string options for the user to reply with.
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
    suggestions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 short, clickable options for the user to answer the question asked." 
    },
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
  required: ["responseToUser", "canvasUpdate", "suggestions"],
};

export const analyzeBusinessIdea = async (
  history: ChatMessage[],
  currentText: string,
  currentImageBase64: string | null,
  currentCanvas: BusinessCanvasState,
  selectedStack: TechStack,
  role: AnalystRole
): Promise<ArchitectResponse> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error("Gemini API Key is missing or invalid. Please check your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelId = "gemini-3-pro-preview";

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

  // Inject the specific knowledge base based on selection and role
  const dynamicInstruction = SYSTEM_INSTRUCTION_TEMPLATE(STACK_KNOWLEDGE[selectedStack], role);

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