import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full h-1/5 bg-[#0f1a23]/95 backdrop-blur-lg shadow-lg py-5 px-8 flex items-center justify-between">
      
      {/* Brand Title */}
      <h1 className="text-4xl font-extrabold text-white tracking-wide font-navFancy">
        AgriSense
      </h1>

      {/* Menu */}
      <div className="flex items-center space-x-10 text-lg font-semibold text-gray-200">
        <Link to="/" className="hover:text-green-400 transition-all">Home</Link>
        <Link to="/analyze" className="hover:text-green-400 transition-all">Analyze Crop</Link>
        <Link to="/recommend" className="hover:text-green-400 transition-all">Recommendations</Link>
      </div>

    </nav>
  );
}
