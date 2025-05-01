import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Home.css";

function Home() {
  const [data, setData] = useState('');
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSearch = () => {
    if (data) {
      // Navigate to the SearchPage with the query parameter
      navigate(`/search?query=${data}`);
    }
  };

  return (
    <>
      <div className="main-containerz">
        <div className="info-section">
          <div className="purpose">
            <p>
              Boost your learning with AI-powered tools to instantly generate
              short notes, mind maps, flashcards, and questions — perfect for
              quick revision, deeper understanding, and smarter studying.
            </p>
          </div>
        </div>
        <div className="details-section-one">
          <div className="input-container">
            <input
              type="text"
              className="input-section"
              placeholder="Search the topic name..."
              value={data}
              onChange={(e) => { setData(e.target.value); }} // Ensure the input is controlled
            />
            <button className="buttontosearch" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="details-section">
          <div className="details-section-two"></div>
          <div className="Logo-section">
            <h1 className="Logo">
              {"STUDIFY".split("").map((char, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {char}
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className="rest-details">
          <div className="rest1">
            <p>&copy; {currentYear} Studify. All rights reserved</p>
          </div>
          <div className="rest2">
            <h5>Linkedin</h5>
            <h5>Instagram</h5>
            <h5>Twitter</h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
