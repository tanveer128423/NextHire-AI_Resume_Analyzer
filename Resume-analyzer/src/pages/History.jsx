import React, { useState, useEffect, useMemo } from "react";
import { Analysis } from "../entities/Analysis";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  FileText,
  Link2,
  Type,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Calendar,
  ChevronRight,
  ArrowLeft,
  History as HistoryIcon,
} from "lucide-react";
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
    return analyses.filter(
      (a) =>
        (a.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.analysis_type || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [analyses, searchTerm]);

  const stats = useMemo(() => {
    if (!analyses.length) return { avg: 0, count: 0 };
    const sum = analyses.reduce((acc, curr) => acc + curr.overall_score, 0);
    return { avg: Math.round(sum / analyses.length), count: analyses.length };
  }, [analyses]);

  const getContentTypeIcon = (type) => {
    const props = { className: "w-4 h-4 text-slate-400" };
    switch (type) {
      case "text":
        return <Type {...props} />;
      case "document":
        return <FileText {...props} />;
      case "url":
        return <Link2 {...props} />;
      default:
        return <FileText {...props} />;
    }
  };

  if (selectedAnalysis) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedAnalysis(null)}
              className="mb-6 text-slate-400 hover:text-white hover:bg-slate-800 transition-all gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to History
            </Button>
          </motion.div>
          <ScoreDisplay analysis={selectedAnalysis} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header & Stats Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <HistoryIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Analysis History
              </h1>
            </div>
            <p className="text-slate-400 text-lg">
              Track and manage your AI-generated insights.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl min-w-[120px]">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {stats.count}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl min-w-[120px]">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Avg Score
              </div>
              <div
                className={`text-2xl font-mono font-bold ${stats.avg >= 70 ? "text-emerald-400" : "text-amber-400"}`}
              >
                {stats.avg}%
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by content or type..."
            className="pl-12 h-12 bg-slate-900/40 border-slate-800 rounded-xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* History List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-800/20 border border-slate-800 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <div className="text-slate-600 mb-4 flex justify-center">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-medium text-slate-400">
                No results found
              </h3>
            </div>
          ) : (
            <AnimatePresence>
              {filteredAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005, x: 5 }}
                  className="group"
                >
                  <Card
                    className="bg-slate-900/40 hover:bg-slate-800/40 border-slate-800 hover:border-slate-700 transition-all cursor-pointer rounded-2xl overflow-hidden"
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center">
                        {/* Score Indicator Column */}
                        <div
                          className={`w-2 md:w-1.5 self-stretch ${analysis.overall_score >= 80 ? "bg-emerald-500" : analysis.overall_score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                        />

                        <div className="flex-1 p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                          {/* Content Info */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                              {getContentTypeIcon(analysis.content_type)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold truncate text-lg">
                                  {analysis.content_type === "document"
                                    ? analysis.content
                                    : analysis.content?.substring(0, 50)}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-800 text-slate-400 font-normal border-none"
                                >
                                  {analysis.analysis_type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(), {
                                    addSuffix: true,
                                  })}
                                </span>
                                <span className="hidden md:inline truncate italic opacity-70">
                                  {analysis.feedback?.substring(0, 80)}...
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Score & Action */}
                          <div className="flex items-center gap-8 pl-4 border-l border-slate-800/50">
                            <div className="text-right">
                              <div
                                className={`text-3xl font-black font-mono tracking-tighter ${
                                  analysis.overall_score >= 80
                                    ? "text-emerald-400"
                                    : analysis.overall_score >= 50
                                      ? "text-amber-400"
                                      : "text-rose-400"
                                }`}
                              >
                                {analysis.overall_score}
                                <span className="text-xs text-slate-600 ml-0.5">
                                  %
                                </span>
                              </div>
                              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                                Overall
                              </div>
                            </div>
                            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 group-hover:bg-blue-600 transition-all text-slate-400 group-hover:text-white">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
}
