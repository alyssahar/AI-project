require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
let accessToken = "BQBvtLXqop_JveJffsgki_Frd2AO2Muoq0kqD7Y_pYfRkNrKBLAZnbNwugIq7CjqlJH3F9K1rWI-gLR1CXPNJZCF4sb263WhB9fobS-17-L8ZBteheo1F5iwHBs-bTLxchVP-WUVhWe-JfiW4LPIp43QzPR76vUEGQd5zqALoapRe99cups4JDKS_UfZQUVl2dPtNNDJzWmzcHvWrJK9dLeSUBH79qVpJUGMGK2_1Z3JBBSPDIx6Z6WzU7Y7wSphLCd2o_ZZwg"; // Store access token
let refreshToken = "AQBNyMbUQK74vzReD90YqD2KAbgQRxeXUxNSfHnjp6TmfaSxgzzE06qBeAWfknJNf225-k1C0bmS93SBjVN9i46nRnMtuqcyzIUk3lEE9LMzrRQVfcf_uFaLfR8t9-2-lHs"; // Store refresh token

// Test route
app.get("/", (req, res) => {
  res.send("AI Playlist API & Weather API are running!");
});

// Spotify authentication route
app.get("/login", (req, res) => {
  const scopes = "user-read-private user-read-email playlist-read-private playlist-modify-public";
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;

  res.redirect(authUrl);
});

// Callback route for authentication
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  console.log("Authorization Code:", code);

  if (!code) {
    return res.send("Error: No authorization code provided.");
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token; // Save refresh token
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    res.send("Successfully authenticated! You can now use the API.");
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.send("Failed to authenticate with Spotify.");
  }
});

// Refresh Access Token (runs automatically every hour)
const refreshAccessToken = async () => {
  if (!refreshToken) {
    console.error("No refresh token available.");
    return;
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    accessToken = response.data.access_token;
    console.log("New Access Token:", accessToken);
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
  }
};

// Auto-refresh token every 55 minutes
cron.schedule("*/55 * * * *", () => {
  console.log("Refreshing Spotify Access Token...");
  refreshAccessToken();
});

// Fetch user playlists
app.get("/playlists", async (req, res) => {
  if (!accessToken) {
    return res.status(401).send("Error: No access token available. Please log in.");
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json(response.data); // Return the playlists
  } catch (error) {
    console.error("Error fetching playlists:", error.response?.data || error.message);

    // If the error is due to an expired token, refresh it and retry
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return res.redirect("/playlists"); // Retry fetching playlists
    }

    res.status(500).send("Failed to fetch playlists.");
  }
});

// Fetch Weather API Data (from api.weather.gov)
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query; // Get latitude and longitude from query params

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  const weatherUrl = `https://api.weather.gov/points/${lat},${lon}`;

  try {
    const response = await axios.get(weatherUrl, {
      headers: { "User-Agent": "AI-Playlist-App" }, // Required by api.weather.gov
    });

    const forecastUrl = response.data.properties.forecast;
    const forecastResponse = await axios.get(forecastUrl, {
      headers: { "User-Agent": "AI-Playlist-App" },
    });

    res.json(forecastResponse.data);
  } catch (error) {
    console.error("Error fetching weather:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
