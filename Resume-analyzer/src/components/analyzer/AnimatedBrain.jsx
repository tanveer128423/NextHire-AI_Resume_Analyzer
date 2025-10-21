import React from "react";
import { motion } from "framer-motion";

const ParticleOrb = ({ delay, size, x, y, duration }) => (
  <motion.div
    className="absolute bg--500/30 rounded-full blur-sm"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const NeuralConnection = ({ delay, startX, startY, endX, endY }) => (
  <motion.svg className="absolute inset-0 pointer-events-none" style={{ overflow: "visible" }}>
    <motion.path
      d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 20} ${endX} ${endY}`}
      fill="none"
      stroke="rgba(99,102,241,0.25)"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);

export default function AnimatedBrain() {
  const particles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 2,
    size: Math.random() * 1 + 10,
    x: `${Math.random() * 80 + 10}%`,
    y: `${Math.random() * 80 + 10}%`,
    duration: Math.random() * 3 + 2,
  }));

  const connections = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 100,
    startX: Math.random() * 220 + 20,
    startY: Math.random() * 220 + 20,
    endX: Math.random() * 220 + 20,
    endY: Math.random() * 220 + 20,
  }));

  return (
    <div className="relative w-full h-80">
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity }}>
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-1 border-2 border-blue-200/10 rounded-full" />
          {particles.map((p) => <ParticleOrb key={p.id} {...p} />)}
          {connections.map((c) => <NeuralConnection key={c.id} {...c} />)}
          <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full" animate={{ scale: [1, 2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        </div>
      </motion.div>

      <motion.div className="absolute top-6 left-6 text-sm text-blue-400/40" animate={{ y: [-8, 8, -8] }} transition={{ duration: 3, repeat: Infinity }}>
        start analyzing...
      </motion.div>
    </div>
  );
}
