import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Students from "./components/Students";
import Courses from "./components/Courses";
import Grades from "./components/Grades";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <NavigationBar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route path="/students" element={<Students />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/grades" element={<Grades />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
