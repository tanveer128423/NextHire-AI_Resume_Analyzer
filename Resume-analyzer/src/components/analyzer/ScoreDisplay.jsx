import React, { useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import {
  Target,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Sparkles
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Target,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Sparkles,
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

function AnimatedScore({ score }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "circOut" });
    const controls = animate(count, score, { duration: 1.5, ease: "circOut" });
    return controls.stop;
  }, [score, count]);

  return <motion.span>{rounded}</motion.span>;

  return <motion.span>{rounded}</motion.span>;
}

export default function ScoreDisplay({ analysis }) {
  if (!analysis) return null;

  const getScoreTheme = (score) => {
    if (score >= 80) return { color: "text-emerald-400", bg: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/30", gradient: "from-emerald-500 to-teal-400" };
    if (score >= 60) return { color: "text-amber-400", bg: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/30", gradient: "from-amber-500 to-orange-400" };
    return { color: "text-rose-400", bg: "from-rose-500/20 to-rose-600/5", border: "border-rose-500/30", gradient: "from-rose-500 to-red-500" };
  const getScoreTheme = (score) => {
    if (score >= 80)
      return {
        color: "text-emerald-400",
        bg: "from-emerald-500/20 to-emerald-600/5",
        border: "border-emerald-500/30",
        gradient: "from-emerald-500 to-teal-400",
      };
    if (score >= 60)
      return {
        color: "text-amber-400",
        bg: "from-amber-500/20 to-amber-600/5",
        border: "border-amber-500/30",
        gradient: "from-amber-500 to-orange-400",
      };
    return {
      color: "text-rose-400",
      bg: "from-rose-500/20 to-rose-600/5",
      border: "border-rose-500/30",
      gradient: "from-rose-500 to-red-500",
    };
  };

  const theme = getScoreTheme(analysis.overall_score);

  const theme = getScoreTheme(analysis.overall_score);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-slate-900/40 backdrop-blur-xl border-slate-800 shadow-2xl rounded-3xl">
        {/* Header Section with Radial Glow */}
        <CardHeader className="relative items-center justify-center pt-12 pb-8 border-b border-slate-800/50">
          <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${theme.bg} opacity-50 blur-3xl`} />
          
          <div className="relative group">
            {/* Pulsing outer ring */}
            <div className={`absolute -inset-4 rounded-full bg-gradient-to-r ${theme.gradient} opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
            
            <div className={`w-36 h-36 rounded-full bg-slate-950 flex items-center justify-center border-2 ${theme.border} relative z-10 shadow-inner`}>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden bg-slate-900/40 backdrop-blur-xl border-slate-800 shadow-2xl rounded-3xl">
        {/* Header Section with Radial Glow */}
        <CardHeader className="relative items-center justify-center pt-12 pb-8 border-b border-slate-800/50">
          <div
            className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${theme.bg} opacity-50 blur-3xl`}
          />

          <div className="relative group">
            {/* Pulsing outer ring */}
            <div
              className={`absolute -inset-4 rounded-full bg-gradient-to-r ${theme.gradient} opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
            />

            <div
              className={`w-36 h-36 rounded-full bg-slate-950 flex items-center justify-center border-2 ${theme.border} relative z-10 shadow-inner`}
            >
              <div className="text-center">
                <div className={`text-5xl font-black tracking-tighter ${theme.color} flex items-baseline justify-center`}>
                <div
                  className={`text-5xl font-black tracking-tighter ${theme.color} flex items-baseline justify-center`}
                >
                  <AnimatedScore score={analysis.overall_score} />
                  <span className="text-xl text-slate-500 ml-1">/100</span>
                  <span className="text-xl text-slate-500 ml-1">/100</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                  Quality Score
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Quality Score</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center z-10">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Analysis Results
            </CardTitle>
            <Badge variant="outline" className="mt-3 px-4 py-1 border-slate-700 bg-slate-800/50 text-slate-300 backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-2 text-blue-400" />
              {analysis.analysis_type}
            </Badge>
          </div>

          <div className="mt-6 text-center z-10">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Analysis Results
            </CardTitle>
            <Badge
              variant="outline"
              className="mt-3 px-4 py-1 border-slate-700 bg-slate-800/50 text-slate-300 backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3 mr-2 text-blue-400" />
              {analysis.analysis_type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-10">
          {/* Executive Summary */}
          <motion.div variants={itemVariants} className="relative">
             <p className="text-lg leading-relaxed text-slate-300 italic font-medium">
              "{analysis.feedback}"
            </p>
          </motion.div>
        <CardContent className="p-8 space-y-10">
          {/* Executive Summary */}
          <motion.div variants={itemVariants} className="relative">
            <p className="text-lg leading-relaxed text-slate-300 italic font-medium">
              "{analysis.feedback}"
            </p>
          </motion.div>

          {/* Breakdown Grid */}
          {/* Breakdown Grid */}
          {analysis.detailed_scores && (
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                <Target className="w-4 h-4 text-blue-500" />
                Performance Metrics
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysis.detailed_scores).map(([k, v]) => {
                  const metricTheme = getScoreTheme(v);
                  return (
                    <div key={k} className="space-y-2 group">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-400 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className={`text-sm font-bold ${metricTheme.color}`}>{v}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${v}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${metricTheme.gradient}`}
                        />
                      </div>
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                <Target className="w-4 h-4 text-blue-500" />
                Performance Metrics
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysis.detailed_scores).map(([k, v]) => {
                  const metricTheme = getScoreTheme(v);
                  return (
                    <div key={k} className="space-y-2 group">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-400 capitalize">
                          {k.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-sm font-bold ${metricTheme.color}`}
                        >
                          {v}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${v}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${metricTheme.gradient}`}
                        />
                      </div>
                    </div>
                  );
                })}
                  );
                })}
              </div>
            </motion.div>
            </motion.div>
          )}

          {/* Actionable Recommendations */}
          {Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Strategic Improvements
              </div>
              <div className="grid gap-3">
                {analysis.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className="group p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl border border-slate-800 transition-all flex items-start gap-4"
                  >
                    <div className="mt-1 p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Actionable Recommendations */}
          {Array.isArray(analysis.recommendations) &&
            analysis.recommendations.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Strategic Improvements
                </div>
                <div className="grid gap-3">
                  {analysis.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="group p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-2xl border border-slate-800 transition-all flex items-start gap-4"
                    >
                      <div className="mt-1 p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">
                        {rec}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}