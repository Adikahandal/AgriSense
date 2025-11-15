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
      <div className="min-h-screen bg-gradient-to-b from-[#10241c] to-[#0b3f2b] flex items-center justify-center text-white px-6">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-lg max-w-lg text-center">
          <p className="text-lg text-white/80">
            No analysis found. Please upload and analyze a leaf image first.
          </p>
        </div>
      </div>
    );
  }

  const details = data.details || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a171f] via-[#0c232f] to-[#0e3b2c] pt-28 pb-16 px-6 text-white">
      <div className="max-w-5xl mx-auto">

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold mb-3 tracking-wide"
        >
          {data.label}
        </motion.h1>

        <p className="text-emerald-300 text-lg mb-10">
          Confidence:{" "}
          <strong className="text-white">
            {(data.confidence * 100).toFixed(2)}%
          </strong>
        </p>

        {/* GRID SECTIONS */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Cause */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-emerald-300 mb-2">
              Cause
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {details.cause ?? "AI could not determine a specific cause."}
            </p>
          </div>

          {/* Symptoms */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-emerald-300 mb-2">
              Symptoms
            </h3>
            <p className="text-white/90 text-sm">
              {Array.isArray(details.symptoms)
                ? details.symptoms.join(", ")
                : details.symptoms ?? "No symptom data available."}
            </p>
          </div>

          {/* Treatment */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-emerald-300 mb-2">
              Treatment
            </h3>
            <ul className="list-disc ml-5 text-white/90 text-sm leading-relaxed">
              {Array.isArray(details.treatment)
                ? details.treatment.map((t, i) => <li key={i}>{t}</li>)
                : <li>{details.treatment ?? "General: Apply fungicide, remove infected leaves, improve airflow."}</li>}
            </ul>
          </div>

          {/* Prevention */}
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-emerald-300 mb-2">
              Prevention
            </h3>
            <ul className="list-disc ml-5 text-white/90 text-sm leading-relaxed">
              {Array.isArray(details.prevention)
                ? details.prevention.map((p, i) => <li key={i}>{p}</li>)
                : <li>{details.prevention ?? "General: Maintain soil health, avoid overhead irrigation, rotate crops."}</li>}
            </ul>
          </div>
        </div>

        {/* AI QUICK ADVICE */}
        <div className="mt-10 bg-white/10 border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
          <h3 className="text-xl font-semibold text-emerald-300 mb-3">
            AI Quick Recommendation
          </h3>
          <p className="text-white/90 leading-relaxed">
            {data.recommendation ?? "No recommendation available."}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
          >
            Back
          </button>

          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            className="px-5 py-3 rounded-xl bg-emerald-400 text-black font-semibold hover:scale-[1.02] transition"
          >
            Copy Report
          </button>
        </div>
      </div>
    </div>
  );
}
