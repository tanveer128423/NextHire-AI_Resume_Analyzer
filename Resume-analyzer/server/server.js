require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Loaded HF_API_KEY:", process.env.HF_API_KEY ? "✅ Found" : "❌ Missing");

// Uploads setup
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
app.use("/uploads", express.static(UPLOAD_DIR));

let analyses = [];

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

// Dummy extract route
app.post("/api/extract", (req, res) => {
  const { file_url } = req.body;
  res.json({ status: "success", output: { content: `Extracted content from ${file_url}` } });
});

// Hugging Face - text
async function analyzeText(prompt) {
  const HF_API_URL = `https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english`;

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) throw new Error(`HF text API error: ${await response.text()}`);
  const data = await response.json();
  return data[0][0]; // { label, score }
}

// Hugging Face - image (document classifier)
async function analyzeImage(filePath) {
  const HF_API_URL = `https://api-inference.huggingface.co/models/microsoft/dit-base-finetuned-rvlcdip`;
  const imageBuffer = fs.readFileSync(filePath);

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/octet-stream",
    },
    body: imageBuffer,
  });

  if (!response.ok) throw new Error(`HF image API error: ${await response.text()}`);
  const data = await response.json();

  const best = data[0];
  return { label: best.label.toLowerCase(), score: best.score };
}

// Unified AI scoring route
app.post("/api/invoke-llm", upload.single("file"), async (req, res) => {
  try {
    let overall_score, detailed_scores, recommendations, feedback;

    if (req.file) {
      // Image analysis
      const result = await analyzeImage(req.file.path);

      // Heuristic: Only score if looks like a resume/document
      const isResumeLike =
        result.label.includes("document") ||
        result.label.includes("resume") ||
        result.label.includes("letter") ||
        result.label.includes("form");

      overall_score = isResumeLike ? Math.round(result.score * 100) : 0;

      detailed_scores = {
        visual_quality: overall_score,
        readability: overall_score,
        professionalism: overall_score,
      };

      recommendations = isResumeLike
        ? [`Uploaded image classified as: ${result.label}. Ensure clarity and resolution.`]
        : ["Uploaded image doesn’t look like a resume. Please upload a proper resume file."];

      feedback = result;
    } else if (req.body.prompt) {
      // Text analysis
      const result = await analyzeText(req.body.prompt);
      overall_score =
        result.label === "POSITIVE"
          ? Math.round(result.score * 100)
          : Math.round((1 - result.score) * 100);

      detailed_scores = {
        clarity: overall_score,
        grammar: overall_score,
        professionalism: overall_score,
      };

      recommendations =
        result.label === "POSITIVE"
          ? ["Great resume! Keep it clear and professional."]
          : ["Consider improving clarity, grammar, and presentation."];

      feedback = result;
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
app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
app.get("/", (req, res) =>
  res.send("Backend with Hugging Face Resume Analyzer (text + document image) is running 🚀")
);
