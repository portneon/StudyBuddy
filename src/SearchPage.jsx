import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import './SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";

  const [Data, setData] = useState(query); 
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mcqAnswers, setMcqAnswers] = useState({});

  const fetchData = async (searchQuery) => {
    if (!searchQuery) return;

    const prompt = `You are an AI educational assistant. Generate structured study material for the topic ${searchQuery}. Return the result in the following JSON format:

    {
      "topic": "Topic Name",
      "summary": "...",
      "mind_map": {
        "summary": "...",
        "branches": [
          { "title": "Branch 1", "subpoints": ["Subpoint 1", "Subpoint 2"] },
          { "title": "Branch 2", "subpoints": ["Subpoint 1", "Subpoint 2"] }
        ]
      },
      "flashcards": [
        { "question": "...", "answer": "..." }
      ],
      "questions_and_answers": [
        { "question": "...", "answer": "..." }
      ],
      "mcqs": [
        {
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "correct_option": "B",
          "explanation": "..."
        }
      ],
      "real_life_examples": ["..."],
      "visual_tips": ["..."],
      "mnemonics": ["..."]
    }

    Respond only in valid JSON format.`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCy2loH0H2FOM-9lHjwLfmlnRLhiiDuUgw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError("Error fetching data");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchData(query);
  }, [query]);

  const formatResponse = (response) => {
    const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) return null;

    let parsed;
    try {
      const jsonMatch = content.match(/```json([\s\S]*?)```/) || content.match(/{[\s\S]*}/);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : null;
      if (!jsonString) throw new Error("No JSON found in response");

      parsed = JSON.parse(jsonString.trim());
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return <p style={{ color: "red" }}>Invalid JSON format received</p>;
    }

    return (
      <div className="response-card">
        <h2>{parsed.topic}</h2>
        <p className="summary">{parsed.summary}</p>

        <div className="section">
          <h3>🧠 Mind Map</h3>
          <p>{parsed.mind_map.summary}</p>
          <ul>
            {parsed.mind_map.branches.map((branch, i) => (
              <li key={i}>
                <strong>{branch.title}</strong>
                <ul>
                  {branch.subpoints.map((sp, j) => <li key={j}>{sp}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>📚 Flashcards</h3>
          {parsed.flashcards.map((card, i) => (
            <div key={i} className="flashcard">
              <p><strong>Q:</strong> {card.question}</p>
              <p><strong>A:</strong> {card.answer}</p>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>❓Q&A</h3>
          {parsed.questions_and_answers.map((qa, i) => (
            <div key={i}>
              <p><strong>Q:</strong> {qa.question}</p>
              <p><strong>A:</strong> {qa.answer}</p>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>MCQs</h3>
          {parsed.mcqs.map((mcq, i) => {
            const handleOptionClick = (opt) => {
              setMcqAnswers((prev) => ({
                ...prev,
                [i]: { selectedOption: opt, isAnswered: true },
              }));
            };

            const isCorrect = mcqAnswers[i]?.selectedOption === mcq.correct_option;
            const answerState = mcqAnswers[i];

            return (
              <div key={i} className="mcq">
                <p>{mcq.question}</p>
                <ul>
                  {mcq.options.map((opt, j) => (
                    <li 
                      key={j}
                      onClick={() => handleOptionClick(opt)}
                      style={{
                        fontWeight: mcqAnswers[i]?.selectedOption === opt ? "bold" : "normal",
                        color: mcqAnswers[i]?.selectedOption === opt
                          ? isCorrect
                            ? "green"
                            : "red"
                          : "white",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                {answerState?.isAnswered && !isCorrect && (
                  <p style={{ color: "red" }}><em>{mcq.explanation}</em></p>
                )}
                {answerState?.isAnswered && isCorrect && (
                  <p style={{ color: "green" }}><em>{`Correct! ${mcq.explanation}`}</em></p>
                )}
              </div>
            );
          })}
        </div>

        <div className="section">
          <h3>🌍 Real-Life Examples</h3>
          <ul>{parsed.real_life_examples.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
        </div>

        <div className="section">
          <h3>🖼️ Visual Tips</h3>
          <ul>{parsed.visual_tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
        </div>

        <div className="section">
          <h3>🧠 Mnemonics</h3>
          <pre><ul>{parsed.mnemonics.map((mne, i) => <li key={i}>{mne}</li>)}</ul></pre>
        </div>
      </div>
    );
  };

  return (
    <div className="search-page">
    
 
      <div className="input-container">
      
      
        <input
          
          className="input-section-1"
          type="text"
          value={Data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter a topic (e.g., Photosynthesis)"
        />
        <button
          className="buttontosearch"
          onClick={() => {
            const searchParams = new URLSearchParams();
            searchParams.set("query", Data);
            window.history.pushState({}, "", `?${searchParams.toString()}`);
            fetchData(Data); 
          }}
          disabled={loading || !Data || query === Data}
        >
          {loading ? "Loading..." : "Search"}
          </button>
          </div>
   

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-message">Hold On, we are making your notes...</div>
      ) : (
        response && formatResponse(response)
      )}
    </div>
  );
};

export default SearchPage;
