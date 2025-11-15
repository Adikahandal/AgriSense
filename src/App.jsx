import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Recommendations from "./pages/Recommendations";

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/analyze" element={<Analyze/>} />
          <Route path="/recommend" element={<Recommendations/>} />
        </Routes>
    </BrowserRouter>
  );
}
