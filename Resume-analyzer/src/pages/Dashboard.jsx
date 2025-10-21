import React, { useState, useEffect } from "react";
import { Analysis } from "../entities/Analysis";
import { UploadFile, ExtractDataFromUploadedFile } from "../integrations/Core";
import ContentInput from "../components/analyzer/ContentInput";
import ScoreDisplay from "../components/analyzer/ScoreDisplay";
import AnimatedBrain from "../components/analyzer/AnimatedBrain";
import Layout from "../entities/Layout";
import { motion, AnimatePresence } from "framer-motion";

const loadingSteps = [
  "Initializing AI core...",
  "Parsing content structure...",
  "Evaluating semantic context...",
  "Analyzing linguistic patterns...",
  "Calculating detailed scores...",
  "Generating feedback and recommendations...",
  "Finalizing analysis report...",
];

// 🔎 Simple resume content check
const isResumeText = (text) => {
  const keywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "contact",
    "summary",
    "career",
    "professional",
    "work",
  ];
  const lowerText = text.toLowerCase();
  return keywords.some((kw) => lowerText.includes(kw));
};

export default function Dashboard() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingSteps.length;
        setLoadingText(loadingSteps[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const analyzeContent = async (inputData) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      let contentToAnalyze = "";
      let fileUrl = null;

      if (inputData.content_type === "text") {
        contentToAnalyze = inputData.content;
      } else if (inputData.content_type === "url") {
        contentToAnalyze = `Please analyze the content from this URL: ${inputData.content}`;
      } else if (inputData.content_type === "document" && inputData.file) {
        const uploadResult = await UploadFile({ file: inputData.file });
        fileUrl = uploadResult.file_url;

        if (inputData.file.type.startsWith("image/")) {
          // OCR for images using Tesseract.js
          const { createWorker } = await import("tesseract.js");
          const worker = createWorker();
          await worker.load();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          const {
            data: { text },
          } = await worker.recognize(fileUrl);
          await worker.terminate();

          if (!text.trim() || !isResumeText(text)) {
            // No text OR not resume-like, return 0 score
            const zeroAnalysis = {
              content_type: "image",
              content: inputData.file.name,
              analysis_type: inputData.analysis_type,
              overall_score: 0,
              detailed_scores: {},
              feedback:
                "Uploaded image does not look like a resume. Please upload a valid resume with readable text.",
              recommendations: ["Upload a clear image of your resume."],
              analysis_duration: 0,
              file_url: fileUrl,
              created_date: new Date().toISOString(),
            };
            setCurrentAnalysis(zeroAnalysis);
            setIsLoading(false);
            return;
          }

          contentToAnalyze = text;
        } else {
          // PDF or text extraction
          const extractResult = await ExtractDataFromUploadedFile({
            file_url: fileUrl,
            json_schema: {},
          });
          if (extractResult.status === "success") {
            contentToAnalyze = extractResult.output.content;
          } else {
            throw new Error("Could not extract content from the document");
          }
        }
      }

      const analysisPrompts = {
        quality: "Analyze the overall quality of this content...",
        sentiment: "Perform a sentiment analysis of this content...",
        clarity: "Evaluate the clarity and readability of this content...",
        professionalism: "Assess the professionalism of this content...",
        creativity: "Evaluate the creativity and originality of this content...",
        technical: "Analyze the technical accuracy and depth of this content...",
      };

      const prompt = `${analysisPrompts[inputData.analysis_type]}

Content to analyze:
"""
${contentToAnalyze}
"""

Provide a comprehensive analysis with:
1. An overall score from 0-100
2. Detailed breakdown scores for 4-6 relevant sub-criteria (each 0-100)
3. Detailed feedback explaining the strengths and weaknesses
4. 3-5 specific, actionable recommendations for improvement
`;

      // Call backend API
      const aiResponse = await fetch("http://localhost:4000/api/invoke-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }).then((res) => res.json());

      const analysisDuration = (Date.now() - startTime) / 1000;

      const feedbackStr = aiResponse.feedback?.label
        ? `${aiResponse.feedback.label} (score: ${Math.round(
            aiResponse.feedback.score * 100
          )}%)`
        : JSON.stringify(aiResponse.feedback);

      const analysisData = {
        content_type: inputData.content_type,
        content:
          inputData.content_type === "document"
            ? inputData.file.name
            : inputData.content,
        analysis_type: inputData.analysis_type,
        overall_score: aiResponse.overall_score,
        detailed_scores: aiResponse.detailed_scores,
        feedback: feedbackStr,
        recommendations: aiResponse.recommendations,
        analysis_duration: analysisDuration,
        file_url: fileUrl,
        created_date: new Date().toISOString(),
      };

      setCurrentAnalysis(analysisData);
      await Analysis.create(analysisData).catch((err) =>
        console.warn("Failed to save analysis:", err)
      );
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
            Next Hire
          </h1>
          <p className="text-slate-400 mt-2 ">
            Get detailed AI-powered insights for your content
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ContentInput onAnalyze={analyzeContent} isLoading={isLoading} />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-900/50 border border-slate-700 rounded-2xl p-8"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Analyzing Content...
                  </h3>
                  <motion.p
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-400 text-center max-w-sm"
                  >
                    {loadingText}
                  </motion.p>
                </motion.div>
              ) : currentAnalysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ScoreDisplay analysis={currentAnalysis} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-900/30 border-2 border-dashed border-slate-600 rounded-2xl"
                >
                  <AnimatedBrain />
                  <div className="z-10 text-center p-4">
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                      Ready for Analysis
                    </h3>
                    <p className="text-slate-500 text-center max-w-sm">
                      Your AI assistant is awaiting instructions. Input your
                      content to begin.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
