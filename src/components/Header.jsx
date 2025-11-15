import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-green-600 text-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">AgriSense</Link>
        <nav className="space-x-4">
          <Link to="/analyze" className="hover:underline">Analyze</Link>
          <Link to="/recommend" className="hover:underline">Recommendations</Link>
        </nav>
      </div>
    </header>
  );
}
