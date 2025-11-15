import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Analyze() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (!image) { setError("Upload an image first."); return; }
    setLoading(true); setError(""); setResult(null);

    const form = new FormData(); form.append("image", image);
    try {
      const res = await axios.post("http://localhost:5000/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000
      });
      const payload = res.data;
      setResult(payload);
      localStorage.setItem("agrisense_result", JSON.stringify(payload));
    } catch (e) {
      console.error(e);
      setError("Prediction failed — check server.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1117] via-[#0f2633] to-[#103b29] pt-28 pb-16 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <motion.h1 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-extrabold mb-6">Analyze Crop</motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Card */}
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <label className="block text-green-200 font-semibold mb-2">Upload Leaf Image</label>

            <input id="file" type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <div onClick={() => document.getElementById("file").click()} className="cursor-pointer rounded-lg border-dashed border-2 border-white/10 p-6 text-center hover:bg-white/3 transition">
              <p className="text-white/80">Click or drag & drop an image here</p>
              <p className="text-sm text-white/60 mt-2">Clear leaf photos with visible spots/areas work best</p>
            </div>

            {preview && <img src={preview} alt="preview" className="mt-6 w-full rounded-lg object-cover shadow-inner border border-white/5" />}

            <button onClick={analyze} disabled={loading} className="mt-6 w-full py-3 rounded-lg bg-emerald-400 text-black font-semibold shadow hover:scale-[1.02] transition">
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {error && <div className="mt-4 text-red-200 bg-red-900/20 p-3 rounded">{error}</div>}
          </div>

          {/* Result Card */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-emerald-200 mb-3">Prediction</h3>

              {!result && <p className="text-white/70">Upload an image and click Analyze to see the prediction here.</p>}

              {result && (
                <>
                  <p className="text-lg"><strong className="text-emerald-300">Disease:</strong> <span className="text-white">{result.label}</span></p>
                  <p className="mt-2 text-lg"><strong className="text-emerald-300">Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>

                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/6">
                    <p className="text-sm text-white/90">{result.recommendation ?? "Click View Recommendations for full management steps."}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <button onClick={() => {
                if (result) window.location.href = "/recommend";
                else setError("No prediction saved. Please analyze first.");
              }} className="w-full py-3 rounded-lg bg-transparent border border-emerald-300 text-emerald-200 font-semibold hover:bg-white/5 transition">
                View Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
