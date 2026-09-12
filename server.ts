import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (genAiClient) return genAiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    return genAiClient;
  } catch (err) {
    console.warn("Failed to initialize Gemini client:", err);
    return null;
  }
}

// Fallback categorizer if API key is not present or offline
function fallbackCategorize(input: string) {
  const lower = (input || "").toLowerCase();
  
  if (lower.includes("spark") || lower.includes("breaker") || lower.includes("wire") || lower.includes("electric") || lower.includes("switch") || lower.includes("fuse") || lower.includes("short circuit") || lower.includes("shock") || lower.includes("light") || lower.includes("fan")) {
    return {
      category: "electrician",
      priority: lower.includes("spark") || lower.includes("fire") || lower.includes("smoke") || lower.includes("breaker") ? "High Priority" : "Normal",
      budgetTier: lower.includes("spark") || lower.includes("rewiring") ? "tier-2" : "tier-1",
      summary: "Sparking switchboard, breaker trip or electrical fault detected",
      matchedIssues: ["Switch replacement", "Power outage", "Appliance short circuit"],
      recommendedPro: "Master Certified Electrician",
      confidence: 98,
    };
  }

  if (lower.includes("pipe") || lower.includes("leak") || lower.includes("tap") || lower.includes("sink") || lower.includes("clog") || lower.includes("drain") || lower.includes("flush") || lower.includes("plumb") || lower.includes("water")) {
    return {
      category: "plumber",
      priority: lower.includes("flood") || lower.includes("burst") ? "High Priority" : "Normal",
      budgetTier: "tier-2",
      summary: "Water plumbing leak or drainage obstruction",
      matchedIssues: ["Pipe leak repair", "Faucet replacement", "Drain unclogging"],
      recommendedPro: "Licensed Master Plumber",
      confidence: 96,
    };
  }

  if (lower.includes("ac") || lower.includes("cooling") || lower.includes("air condition") || lower.includes("compressor") || lower.includes("freon") || lower.includes("filter")) {
    return {
      category: "ac-repair",
      priority: "Normal",
      budgetTier: "tier-2",
      summary: "AC cooling efficiency or compressor tune-up required",
      matchedIssues: ["Gas refill & checkup", "Deep coil cleaning", "Thermostat repair"],
      recommendedPro: "HVAC Certified Technician",
      confidence: 97,
    };
  }

  if (lower.includes("paint") || lower.includes("wall") || lower.includes("stain") || lower.includes("damp") || lower.includes("color")) {
    return {
      category: "painter",
      priority: "Normal",
      budgetTier: "tier-3",
      summary: "Interior wall restoration, putty & weatherproofing",
      matchedIssues: ["Touch-up painting", "Waterproofing primer", "Full room refresh"],
      recommendedPro: "Interior Surface Finish Specialist",
      confidence: 94,
    };
  }

  if (lower.includes("washer") || lower.includes("fridge") || lower.includes("refrigerator") || lower.includes("oven") || lower.includes("microwave") || lower.includes("appliance")) {
    return {
      category: "appliance",
      priority: "Normal",
      budgetTier: "tier-2",
      summary: "Major home appliance motor or sensor diagnostic",
      matchedIssues: ["Drum noise diagnosis", "Cooling thermostat", "PCB board check"],
      recommendedPro: "Brand Certified Appliance Engineer",
      confidence: 95,
    };
  }

  if (lower.includes("clean") || lower.includes("sanitize") || lower.includes("dust") || lower.includes("kitchen deep") || lower.includes("sofa")) {
    return {
      category: "cleaning",
      priority: "Normal",
      budgetTier: "tier-2",
      summary: "Deep sanitization and intense dust extraction",
      matchedIssues: ["Full home deep sanitization", "Kitchen degreasing", "Bathroom descaling"],
      recommendedPro: "Trained Sanitization Crew",
      confidence: 95,
    };
  }

  if (lower.includes("door") || lower.includes("wood") || lower.includes("shelf") || lower.includes("lock") || lower.includes("hinge") || lower.includes("cabinet") || lower.includes("furniture")) {
    return {
      category: "carpenter",
      priority: "Normal",
      budgetTier: "tier-2",
      summary: "Custom carpentry woodwork and precision hinge alignment",
      matchedIssues: ["Door latch replacement", "Shelf mount installation", "Hinge realignment"],
      recommendedPro: "Master Woodcraft Artisan",
      confidence: 96,
    };
  }

  return {
    category: "general",
    priority: "Normal",
    budgetTier: "tier-1",
    summary: "General handyman inspection and diagnostic visit",
    matchedIssues: ["General inspection", "Hardware tightening", "Multi-point diagnostic"],
    recommendedPro: "Certified All-Round Handyman",
    confidence: 92,
  };
}

// API Routes
app.post("/api/ai/categorize", async (req, res) => {
  const { input } = req.body;
  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "Input text or transcription is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = fallbackCategorize(input);
    return res.json({ ...fallback, source: "heuristic" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are an expert home repair diagnostics AI for HomeCare Pro.
Analyze the homeowner's stated issue and output JSON matching the exact schema.

Allowed category values: "electrician", "plumber", "ac-repair", "painter", "appliance", "cleaning", "carpenter", "general".
Allowed budgetTier values: "tier-1" (₹500-₹1,000 for minor), "tier-2" (₹1,000-₹2,500 for standard), "tier-3" (₹2,500-₹5,000 for complex), "tier-4" (₹5,000+ for overhaul).
Allowed priority: "High Priority" or "Normal".

Homeowner's issue: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "One of: electrician, plumber, ac-repair, painter, appliance, cleaning, carpenter, general",
            },
            priority: {
              type: Type.STRING,
              description: "Either 'High Priority' or 'Normal'",
            },
            budgetTier: {
              type: Type.STRING,
              description: "One of: tier-1, tier-2, tier-3, tier-4",
            },
            summary: {
              type: Type.STRING,
              description: "One sentence concise summary of the problem",
            },
            matchedIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Up to 4 specific sub-issues or tags",
            },
            recommendedPro: {
              type: Type.STRING,
              description: "Title of the professional, e.g. Master Certified Electrician",
            },
            confidence: {
              type: Type.INTEGER,
              description: "Match score percentage, e.g. 98",
            },
          },
          required: ["category", "priority", "budgetTier", "summary", "matchedIssues", "recommendedPro", "confidence"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ ...parsed, source: "gemini" });
  } catch (err) {
    console.error("Gemini categorize error, using fallback:", err);
    const fallback = fallbackCategorize(input);
    return res.json({ ...fallback, source: "heuristic" });
  }
});

// Support AI Chat assistant endpoint
app.post("/api/ai/support-chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      reply: `Thanks for reaching out to HomeCare Pro Support! Regarding "${message.slice(0, 40)}...", all our technicians are 100% background checked and verified. If you need urgent assistance, our emergency dispatch is available 24/7. Would you like to schedule an instant inspection?`,
      source: "fallback",
    });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        systemInstruction: "You are the friendly, reassuring, expert virtual customer care assistant for HomeCare Pro, a premium on-demand verified home services platform. Answer user questions about electrical, plumbing, AC, appliances, carpentry, pricing guarantees, technician safety checks, and warranty. Keep answers concise, helpful, and under 3-4 sentences.",
      },
    });

    const response = await chat.sendMessage({
      message,
    });

    return res.json({ reply: response.text, source: "gemini" });
  } catch (err) {
    console.error("Gemini support chat error:", err);
    return res.json({
      reply: "All HomeCare Pro professionals undergo rigorous background checks, identity verification, and skill certification. Your booking is protected with our fixed quote guarantee and zero upfront deposit policy.",
      source: "fallback",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HomeCare Pro server running on http://localhost:${PORT}`);
  });
}

startServer();
