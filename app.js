require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

let accessToken = "your_current_access_token_here";
let refreshToken = "your_current_refresh_token_here";

// Test route
app.get("/", (req, res) => {
  res.send("AI Playlist API & Weather API are running!");
});

// Spotify Login
app.get("/login", (req, res) => {
  const scopes = "user-read-private user-read-email playlist-read-private playlist-modify-public";
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;
  res.redirect(authUrl);
});

// Spotify Callback
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Error: No code provided.");

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      })
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    res.send("Spotify authentication successful!");
  } catch (error) {
    console.error("Error exchanging code:", error);
    res.send("Authentication failed.");
  }
});

// Refresh Spotify Access Token
cron.schedule("*/50 * * * *", async () => {
  try {
    const response = await axios.post("https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      })
    );
    accessToken = response.data.access_token;
    console.log("Access token refreshed");
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
});

// HuggingFace AI Helper Function
const queryHuggingFace = async (model, inputs) => {
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${model}`,
    { inputs },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// 1. Mood Analysis
app.post("/analyze-mood", async (req, res) => {
  const userText = req.body.text;
  const result = await queryHuggingFace("distilbert/distilbert-base-uncased-finetuned-sst-2-english", userText);
  res.json(result);
});

// 2. Generate Playlist Ideas
app.post("/generate-playlist", async (req, res) => {
  const prompt = req.body.prompt;
  const result = await queryHuggingFace("tiiuae/Falcon3-7B-Base", prompt);
  res.json(result);
});

// 3. Genre Classification
app.post("/classify-genre", async (req, res) => {
  const input = req.body.text;
  const result = await queryHuggingFace("microsoft/wavlm-base-plus", input);
  res.json(result);
});

// 4. Emotion Detection
app.post("/detect-emotion", async (req, res) => {
  const userText = req.body.text;
  const result = await queryHuggingFace("bhadresh-savani/distilbert-base-uncased-emotion", userText);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
