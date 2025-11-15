import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Recommendations() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("agrisense_result");
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#052e1f] to-[#0b3f2b] pt-28 px-6 flex items-center justify-center text-white">
        <div className="max-w-xl text-center glass-card p-8 rounded-2xl">
          <p className="text-lg text-white/80">No analysis found. Please analyze a leaf first.</p>
        </div>
      </div>
    );
  }

  const details = data.details || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1117] via-[#0f2633] to-[#103b29] pt-28 pb-16 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-extrabold mb-4">{data.label}</motion.h1>
        <p className="text-emerald-300 mb-6">Confidence: <strong className="text-white">{(data.confidence * 100).toFixed(2)}%</strong></p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/8">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Cause</h3>
            <p className="text-white/90">{details.cause ?? "AI-generated cause not available."}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/8">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Symptoms</h3>
            <p className="text-white/90">{Array.isArray(details.symptoms) ? details.symptoms.join(", ") : (details.symptoms ?? "No symptom data")}</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/8">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Treatment</h3>
            <ul className="list-disc ml-5 text-white/90">
              {Array.isArray(details.treatment) ? details.treatment.map((t, i) => <li key={i}>{t}</li>) : <li>{details.treatment ?? "General: maintain water, nutrients, check local extension services."}</li>}
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/8">
            <h3 className="text-lg font-semibold text-emerald-200 mb-2">Prevention</h3>
            <ul className="list-disc ml-5 text-white/90">
              {Array.isArray(details.prevention) ? details.prevention.map((p, i) => <li key={i}>{p}</li>) : <li>{details.prevention ?? "Practice crop rotation and sanitation."}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-xl bg-white/6 border border-white/8">
          <h3 className="text-lg font-semibold text-emerald-200 mb-2">AI Quick Recommendation</h3>
          <p className="text-white/90">{data.recommendation ?? "No recommendation available."}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => window.history.back()} className="px-4 py-2 rounded-lg bg-white/7 border border-white/10 text-white">Back</button>
          <button onClick={() => navigator.clipboard.writeText(JSON.stringify(data))} className="px-4 py-2 rounded-lg bg-emerald-400 text-black font-semibold">Copy Report</button>
        </div>
      </div>
    </div>
  );
}
