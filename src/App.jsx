import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./Home";
import SearchPage from "./SearchPage"; // Ensure you have SearchPage defined


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to /home */}
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} /> {/* Add the SearchPage route */}
      
      </Routes>
    </Router>
  );
};

export default App;
