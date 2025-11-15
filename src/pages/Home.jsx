import { useNavigate } from "react-router-dom";
import farmer from "../assets/farmer.jpg";
import crop from "../assets/farm.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-section px-8 py-20  text-white">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

        {/* LEFT CONTENT */}
        <div className="flex-1">
          <span className="px-4 py-1 bg-white/20 text-sm rounded-full">
            Sustaining Earth
          </span>

          <h1 className="text-5xl font-extrabold mt-4 leading-tight">
            Grow the Future with{" "}
            <span className="text-emerald-400">Sustainable Agriculture</span>
          </h1>

          <p className="text-lg text-gray-300 mt-4 max-w-lg">
            We empower farmers with eco-friendly methods, modern tools, and a
            shared mission to nourish the planet — naturally and responsibly.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/analyze")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-full text-lg font-semibold shadow-lg transition"
            >
              Analyze Crop
            </button>

            <button
              onClick={() => navigate("/recommend")}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-lg font-semibold shadow-lg transition"
            >
              Recommendations
            </button>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex-1 flex gap-6">
          <img src={farmer} className="hero-img w-1/2 rounded-2xl shadow-lg" />
          <img src={crop} className="hero-img w-1/2 rounded-2xl shadow-lg" />
        </div>
      </div>

    </div>
  );
}
