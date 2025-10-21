import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Upload, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ContentInput({ onAnalyze, isLoading }) {
  const [inputType, setInputType] = useState("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState("quality");

  const handleSubmit = () => {
    const inputData = {
      content_type: inputType,
      content:
        inputType === "text"
          ? content
          : inputType === "url"
          ? url
          : file?.name || "",
      analysis_type: analysisType,
      file: inputType === "document" ? file : null,
    };
    onAnalyze(inputData);
  };

  const isValid = () => {
    if (inputType === "text" && content.trim().length > 0) return true;
    if (inputType === "url" && url.trim().length > 0) return true;
    if (inputType === "document" && file) return true;
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-300 dark:border-slate-700/60 shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="border-b border-slate-200 dark:border-slate-800/70 pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-white">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Content Analysis
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 text-sm pt-2 pl-1">
            Choose a content type and analysis method below
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-8 space-y-10">
          {/* Analysis Type */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-blue-600 dark:text-blue-400">
              Analysis Type
            </Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 hover:border-blue-500/50 transition-colors text-slate-800 dark:text-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center">
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900/90 backdrop-blur-lg border border-slate-300 dark:border-slate-700 rounded-xl">
                <SelectItem value="quality">Quality Assessment</SelectItem>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                <SelectItem value="clarity">Clarity & Readability</SelectItem>
                <SelectItem value="professionalism">Professionalism</SelectItem>
                <SelectItem value="creativity">Creativity Score</SelectItem>
                <SelectItem value="technical">Technical Accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs with Aura Effect */}
          <Tabs value={inputType} onValueChange={setInputType} className="w-full">
            <TabsList className="grid grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-800/40 p-2 rounded-xl">
              {/* Text Tab */}
              <TabsTrigger
                value="text"
                className="px-4 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300 
                hover:text-slate-900 dark:hover:text-slate-100 
                data-[state=active]:bg-blue-600 data-[state=active]:text-white
                data-[state=active]:shadow-[0_0_12px_rgba(37,99,235,0.6)]
                data-[state=active]:ring-2 data-[state=active]:ring-blue-400"
              >
                Text
              </TabsTrigger>

              {/* Document Tab */}
              <TabsTrigger
                value="document"
                className="px-4 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300 
                hover:text-slate-900 dark:hover:text-slate-100 
                data-[state=active]:bg-green-600 data-[state=active]:text-white
                data-[state=active]:shadow-[0_0_12px_rgba(34,197,94,0.6)]
                data-[state=active]:ring-2 data-[state=active]:ring-green-400"
              >
                Document
              </TabsTrigger>

              {/* URL Tab */}
              <TabsTrigger
                value="url"
                className="px-4 py-2 rounded-lg transition-colors text-slate-700 dark:text-slate-300 
                hover:text-slate-900 dark:hover:text-slate-100 
                data-[state=active]:bg-purple-600 data-[state=active]:text-white
                data-[state=active]:shadow-[0_0_12px_rgba(147,51,234,0.6)]
                data-[state=active]:ring-2 data-[state=active]:ring-purple-400"
              >
                URL
              </TabsTrigger>
            </TabsList>

            {/* Text Input */}
            <TabsContent value="text" className="mt-6 space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">
                Enter your text
              </Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste resume text..."
                className="bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                {content.length} characters
              </div>
            </TabsContent>

            {/* Document Upload */}
            <TabsContent value="document" className="mt-6">
              <Label className="text-slate-700 dark:text-slate-300 mb-4">
                Upload a document
              </Label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500/50 transition">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <Upload className="w-10 h-10 mx-auto text-slate-400 hover:text-blue-500 transition" />
                  <div className="mt-2 text-slate-600 dark:text-slate-300">
                    Click here to upload
                  </div>
                </label>
                {file && (
                  <div className="mt-4 text-slate-700 dark:text-slate-200 text-sm font-medium">
                    {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                )}
              </div>
            </TabsContent>

            {/* URL Input */}
            <TabsContent value="url" className="mt-6 space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">
                Enter URL to analyze
              </Label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
              />
            </TabsContent>
          </Tabs>

          {/* Button */}
          <div>
            <Button
              onClick={handleSubmit}
              disabled={!isValid() || isLoading}
              className={`w-full py-4 text-lg font-semibold rounded-xl shadow-md transition ${
                isLoading
                  ? "opacity-70 cursor-not-allowed bg-slate-400 dark:bg-slate-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              }`}
            >
              {isLoading ? "Analyzing..." : "Start AI Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
