import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MyComplaints from "./pages/MyComplaints";
import CreateComplaint from "./pages/CreateComplaint";
import AllComplaints from "./pages/AllComplaints";
import Analytics from "./pages/Analytics";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ ADD THESE TWO */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Existing routes (unchanged) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/create-complaint" element={<CreateComplaint />} />
        <Route path="/all-complaints" element={<AllComplaints />} />
        <Route path="/analytics" element={<Analytics />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;