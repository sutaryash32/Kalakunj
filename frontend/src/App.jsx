import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlipbookUI from './components/FlipbookUI.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

// Two completely separate surfaces, two separate URLs:
//   /        -> public flipbook catalogue (read-only, GET /catalogue)
//   /admin   -> login-gated dashboard (POST/DELETE /catalogue, POST /upload)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlipbookUI />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
