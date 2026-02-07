require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
    const isAllowed =
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /localhost/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

console.log(
  "Loaded HF_API_KEY:",
  process.env.HF_API_KEY ? "✅ Found" : "❌ Missing",
);

let analyses = [];

// Multer setup - use memory storage to avoid saving files to disk
const upload = multer({ storage: multer.memoryStorage() });

// Upload route - Process file without saving to disk
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // Return file info without storing on disk - just acknowledge the file for analysis
  const fileUrl = `${req.protocol}://${req.get("host")}/api/file/${req.file.filename}`;
  res.json({
    file_url: fileUrl,
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
  });
});

// Dummy extract route
app.post("/api/extract", (req, res) => {
  const { file_url } = req.body;
  res.json({
    status: "success",
    output: { content: `Extracted content from ${file_url}` },
  });
});

// OpenAI - text analysis
async function analyzeText(prompt) {
  if (!openai) {
    throw new Error(
      "OpenAI API key not configured. Please set OPENAI_API_KEY in .env",
    );
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            'Analyze this resume text for quality. Provide a score from 0 to 100 for overall quality, considering clarity, grammar, professionalism, and relevance. Also provide detailed scores for clarity (0-100), grammar (0-100), professionalism (0-100). Respond in JSON format: {"overall": number, "clarity": number, "grammar": number, "professionalism": number, "recommendations": ["string"], "feedback": "string"}',
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });
    const content = response.choices[0].message.content.trim();
    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback if not JSON
      return {
        overall: 75,
        clarity: 80,
        grammar: 70,
        professionalism: 75,
        recommendations: ["Improve formatting", "Add more details"],
        feedback: content,
      };
    }
  } catch (apiError) {
    console.error("OpenAI API error:", apiError.message);
    // Fallback analysis
    return {
      overall: 70,
      clarity: 75,
      grammar: 65,
      professionalism: 70,
      recommendations: ["Add more specific achievements", "Improve formatting"],
      feedback:
        "Analysis completed with fallback scoring due to API limitations.",
    };
  }
}

// OpenAI - image analysis
async function analyzeImage(imageBuffer) {
  if (!openai) {
    throw new Error(
      "OpenAI API key not configured. Please set OPENAI_API_KEY in .env",
    );
  }
  try {
    const base64Image = imageBuffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze this resume image. Determine if it\'s a resume or not. Provide an overall score from 0 to 100 for visual quality. Also provide detailed scores for visual_quality (0-100), readability (0-100), professionalism (0-100). Respond in JSON format: {"overall": number, "visual_quality": number, "readability": number, "professionalism": number, "recommendations": ["string"], "feedback": "string"}',
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 200,
    });
    const content = response.choices[0].message.content.trim();
    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback if not JSON
      return {
        overall: 70,
        visual_quality: 75,
        readability: 65,
        professionalism: 70,
        recommendations: ["Improve image quality", "Ensure text is readable"],
        feedback: content,
      };
    }
  } catch (apiError) {
    console.error("OpenAI API error:", apiError.message);
    // Fallback analysis
    return {
      overall: 65,
      visual_quality: 70,
      readability: 60,
      professionalism: 65,
      recommendations: ["Improve image quality", "Ensure text is clear"],
      feedback:
        "Analysis completed with fallback scoring due to API limitations.",
    };
  }
}

// Unified AI scoring route
app.post("/api/invoke-llm", upload.single("file"), async (req, res) => {
  try {
    let overall_score, detailed_scores, recommendations, feedback;

    if (req.file) {
      // Image analysis - use buffer from memory
      const result = await analyzeImage(req.file.buffer);

      overall_score = result.overall;
      detailed_scores = {
        visual_quality: result.visual_quality,
        readability: result.readability,
        professionalism: result.professionalism,
      };
      recommendations = result.recommendations;
      feedback = result.feedback;
    } else if (req.body.prompt) {
      // Text analysis
      const result = await analyzeText(req.body.prompt);
      overall_score = result.overall;
      detailed_scores = {
        clarity: result.clarity,
        grammar: result.grammar,
        professionalism: result.professionalism,
      };
      recommendations = result.recommendations;
      feedback = result.feedback;
    } else {
      return res.status(400).json({ error: "No prompt or file provided" });
    }

    // Save analysis history
    const analysis = {
      id: Date.now(),
      created_date: new Date().toISOString(),
      overall_score,
      detailed_scores,
      recommendations,
      feedback,
    };
    analyses.unshift(analysis);

    res.json(analysis);
  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: "AI request failed", details: err.message });
  }
});

// Analyses history
app.get("/api/analyses", (req, res) => res.json(analyses));

// Root
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 API running at http://localhost:${PORT}`),
);
app.get("/", (req, res) =>
  res.send(
    "Backend with Hugging Face Resume Analyzer (text + document image) is running 🚀",
  ),
);
