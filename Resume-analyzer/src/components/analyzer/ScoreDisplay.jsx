import React, { useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Target, Lightbulb, CheckCircle } from "lucide-react";

function AnimatedScore({ score }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(count, score, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);
  return <motion.div>{rounded}</motion.div>;
}

export default function ScoreDisplay({ analysis }) {
  if (!analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-amber-600";
    if (score >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-600";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="bg-slate-900/60 border border-slate-700 rounded-2xl">
        <CardHeader className="text-center border-b border-slate-700 p-6">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getScoreGradient(analysis.overall_score)} p-1 mx-auto mb-4`}>
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  <AnimatedScore score={analysis.overall_score} />
                </div>
                <div className="text-slate-400 text-sm">/ 100</div>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Overall Score</CardTitle>
          <Badge className="mt-2">{analysis.analysis_type}</Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-slate-300">{analysis.feedback}</div>

          {analysis.detailed_scores && (
            <div>
              <div className="text-white font-semibold mb-3 flex items-center gap-2"><Target className="w-5 h-5 text-blue-400" /> Detailed Breakdown</div>
              <div className="space-y-3">
                {Object.entries(analysis.detailed_scores).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between">
                      <div className="capitalize text-slate-300">{k.replace(/_/g, " ")}</div>
                      <div className={`font-bold ${v >= 80 ? "text-green-400" : v >= 60 ? "text-yellow-400" : v >= 40 ? "text-orange-400" : "text-red-400"}`}>{v}/100</div>
                    </div>
                    <div className="mt-2"><Progress value={v} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
            <div>
              <div className="text-white font-semibold mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> Recommendations</div>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-slate-800/50 rounded border border-slate-700 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-1" />
                    <div className="text-slate-300">{rec}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
