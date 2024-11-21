const express = require("express");
const bodyParser = require("body-parser");
const atob = require("atob");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  bodyParser.json({
    strict: true, // Only accepts valid JSON
  })
);

app.use(
  cors({
    origin: "https://solution1ofbj-frontend.onrender.com", // Replace this with your frontend's URL
    methods: ["GET", "POST"], // Allow specific methods
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

const PORT = process.env.PORT || 5000;

// Utility Functions
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const processData = (data) => {
  const numbers = [];
  const alphabets = [];
  let highestLowercaseAlphabet = null;
  let primeFound = false;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(Number(item))) primeFound = true;
    } else if (typeof item === "string" && /^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
      if (
        item === item.toLowerCase() &&
        (!highestLowercaseAlphabet || item > highestLowercaseAlphabet)
      ) {
        highestLowercaseAlphabet = item;
      }
    }
  });

  return { numbers, alphabets, highestLowercaseAlphabet, primeFound };
};

// Routes
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;
    const userId = "john_doe_17091999";
    const email = "john@xyz.com";
    const rollNumber = "ABCD123";

    // Process input data
    const { numbers, alphabets, highestLowercaseAlphabet, primeFound } =
      processData(data);

    // Handle file
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, "base64");
        fileSizeKb = (fileBuffer.length / 1024).toFixed(2);
        fileMimeType = "unknown";
        fileValid = true;
      } catch {
        fileValid = false;
      }
    }

    res.status(200).json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet
        ? [highestLowercaseAlphabet]
        : [],
      is_prime_found: primeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    });
  } catch (error) {
    res.status(500).json({ is_success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
