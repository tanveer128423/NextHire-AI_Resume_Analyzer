import React, { useState, useEffect, useMemo } from "react";
import { Analysis } from "../entities/Analysis";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Eye, FileText, Link2, Type, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import ScoreDisplay from "../components/analyzer/ScoreDisplay";
import Layout from "../entities/Layout";

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await Analysis.list();
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error loading analyses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAnalyses = useMemo(() => {
    if (!searchTerm) return analyses;
    return analyses.filter((analysis) =>
      (analysis.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (analysis.analysis_type || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [analyses, searchTerm]);

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "text": return <Type className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "url": return <Link2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreIcon = (score) => {
    if (score >= 70) return <TrendingUp className="w-4 h-4" />;
    if (score >= 40) return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  if (selectedAnalysis) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={() => setSelectedAnalysis(null)} className="bg-slate-800 border border-slate-700 text-white px-3 py-2">← Back</Button>
            <h1 className="text-2xl font-bold">Analysis Details</h1>
          </div>
          <ScoreDisplay analysis={selectedAnalysis} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analysis History</h1>
            <p className="text-slate-400">Review previous AI content analyses</p>
          </div>
          <div className="w-full max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search analyses..." className="pl-10" />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-slate-800/40 border border-slate-700 p-4 animate-pulse">
                <CardContent className="p-4">
                  <div className="h-8 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">{searchTerm ? "No Matching Analyses" : "No Analyses Yet"}</h3>
            <p className="text-slate-500">{searchTerm ? "Try a different search term." : "Start analyzing content to build history."}</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div key={analysis.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                <Card className="bg-slate-800/60 border border-slate-700 rounded-2xl cursor-pointer" onClick={() => setSelectedAnalysis(analysis)}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(analysis.content_type)}
                        <span className="text-white font-medium">
                          {analysis.content_type === "document" ? analysis.content : (analysis.content?.length > 60 ? analysis.content.substring(0, 60) + "..." : analysis.content)}
                        </span>
                      </div>
                      <Badge className="ml-3">{analysis.analysis_type}</Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)} flex items-center gap-1`}>
                          {getScoreIcon(analysis.overall_score)} {analysis.overall_score}
                        </div>
                        <div className="text-slate-400 text-sm">/ 100</div>
                      </div>
                      <Button onClick={() => setSelectedAnalysis(analysis)} className="bg-slate-700 px-3 py-2">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
