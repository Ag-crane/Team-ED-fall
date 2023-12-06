import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Enroll from "./pages/Enroll.js";
import Map from "./pages/Map.js";
import Login from "./pages/Login.js";
import Heart from "./pages/Heart.js";
import Search from "./pages/Search.js";
import Admin from "./pages/Admin.js";
import Kakao from  "./pages/Kakao.js";

function App() {
  return (
    <Router>
      <div id="wrap">
        <Routes>
          {" "}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<Map />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/heart" element={<Heart />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin/:id" element={<Admin />} />
          <Route path="/kakao" element={<Kakao />} />
          {" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
