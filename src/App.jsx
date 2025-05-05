import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./Home";
import SearchPage from "./SearchPage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchPage />} /> 
      
      </Routes>
    </Router>
  );
};

export default App;
