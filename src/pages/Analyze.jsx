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

  const API_URL = import.meta.env.VITE_API_URL;

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
    if (!image) {
      setError("Upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData();
    form.append("image", image);

    try {
      const res = await axios.post(`${API_URL}/analyze`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });

      const payload = res.data;
      setResult(payload);
      localStorage.setItem("agrisense_result", JSON.stringify(payload));
    } catch (e) {
      console.error(e);
      setError("Prediction failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a171f] via-[#0c232f] to-[#0e3b2c] pt-28 pb-16 px-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold mb-10 text-center tracking-wide"
        >
          Analyze Your Crop
        </motion.h1>

        {/* 2 Column Layout */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-xl"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <label className="block text-green-200 font-semibold mb-3 text-lg">
              Upload Leaf Image
            </label>

            <input
              id="file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            <div
              onClick={() => document.getElementById("file").click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-white/15 p-8 text-center hover:bg-white/5 transition"
            >
              <p className="text-white/80 text-lg">Click or Drag & Drop image</p>
              <p className="text-sm text-white/60 mt-2">Best results with clear leaf images</p>
            </div>

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-6 w-full rounded-xl object-cover shadow-lg border border-white/10"
              />
            )}

            <button
              onClick={analyze}
              disabled={loading}
              className="mt-7 w-full py-3 rounded-xl text-lg font-semibold bg-emerald-400 text-black hover:scale-[1.02] transition shadow-lg"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {error && (
              <div className="mt-4 text-red-300 bg-red-900/30 p-3 rounded-lg border border-red-700/20">
                {error}
              </div>
            )}
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-xl flex flex-col"
          >
            <h3 className="text-2xl font-semibold text-emerald-300 mb-4">
              Prediction Result
            </h3>

            {!result && (
              <p className="text-white/70 text-lg">
                Upload an image and click Analyze to see the prediction here.
              </p>
            )}

            {result && (
              <div>
                <p className="text-lg mb-2">
                  <span className="text-emerald-300 font-semibold">Disease:</span>{" "}
                  <span className="text-white">{result.label}</span>
                </p>

                <p className="text-lg mb-4">
                  <span className="text-emerald-300 font-semibold">Confidence:</span>{" "}
                  {(result.confidence * 100).toFixed(2)}%
                </p>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {result.recommendation ??
                      "Click 'View Recommendations' for management steps."}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (result) navigate("/recommend");
                else setError("Analyze an image before viewing recommendations.");
              }}
              className="mt-auto w-full py-3 rounded-xl bg-transparent border border-emerald-300 text-emerald-200 font-semibold hover:bg-white/5 transition text-lg"
            >
              View Recommendations
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
