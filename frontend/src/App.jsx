import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const sanitizeJSON = (input) => {
    return input
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
  };

  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async () => {
    try {
      // Parse and sanitize input JSON
      const sanitizedInput = sanitizeJSON(jsonInput);
      const parsedInput = JSON.parse(sanitizedInput);

      // Make API call
      const res = await axios.post("http://localhost:5000/bfhl", parsedInput);
      setResponse(res.data);
    } catch (error) {
      console.log("Error:", error);
      alert("Invalid JSON format or error in API call!");
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;
    let output = {};

    if (selectedOptions.includes("Numbers")) output.numbers = numbers;
    if (selectedOptions.includes("Alphabets")) output.alphabets = alphabets;
    if (selectedOptions.includes("Highest Lowercase Alphabet"))
      output.highest_lowercase_alphabet = highest_lowercase_alphabet;

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Filtered Response</h3>
        <pre
          style={{
            backgroundColor: "#f7f7f7",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>
        Solution of Bajaj by Yash Sharma
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <h3>API Input</h3>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here, e.g., { "data": ["M", "1", "334", "4", "B"] }'
          style={{
            width: "100%",
            height: "100px",
            fontSize: "16px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>

      {response && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Multi Filter</h3>
          <div>
            <label style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                value="Numbers"
                onChange={(e) =>
                  setSelectedOptions((prev) =>
                    prev.includes(e.target.value)
                      ? prev.filter((opt) => opt !== e.target.value)
                      : [...prev, e.target.value]
                  )
                }
              />{" "}
              Numbers
            </label>

            <label style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={(e) =>
                  setSelectedOptions((prev) =>
                    prev.includes(e.target.value)
                      ? prev.filter((opt) => opt !== e.target.value)
                      : [...prev, e.target.value]
                  )
                }
              />{" "}
              Alphabets
            </label>

            <label style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                value="Highest Lowercase Alphabet"
                onChange={(e) =>
                  setSelectedOptions((prev) =>
                    prev.includes(e.target.value)
                      ? prev.filter((opt) => opt !== e.target.value)
                      : [...prev, e.target.value]
                  )
                }
              />{" "}
              Highest Lowercase Alphabet
            </label>
          </div>
        </div>
      )}

      {renderResponse()}
    </div>
  );
};

export default App;
