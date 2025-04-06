# Smart AI Playlist

## Overview
Smart AI Playlist is a dynamic playlist generator that personalizes Spotify playlists based on your current mood or local weather conditions.

The app integrates with:
- Spotify API — for accessing user playlists and music data  
- Weather API (Weather.gov) — for real-time weather data  
- Hugging Face API — for AI-generated playlist names and descriptions  

The backend automatically refreshes access tokens so users stay logged in without interruptions.

---

## Table of Contents
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Notes](#notes)

---

## Technologies Used
- Node.js — Backend runtime
- Express.js — API routing
- Axios — API requests
- Node-Cron — Automated background tasks
- React.js — Frontend (Optional)
- Spotify API — Music data + user playlists
- Weather API (Weather.gov) — Weather-based playlist logic
- Hugging Face API — AI-generated playlist names/descriptions
- dotenv — Environment variable management

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-ai-playlist.git
cd smart-ai-playlist
```

---

### 2. Install Dependencies

#### Backend:
```bash
npm install
```

#### Frontend (if applicable):
```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory and add:

```env
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:5001/callback
HUGGINGFACE_API_TOKEN=your-huggingface-api-token
```

---

## Running the App

### Start Backend Server
```bash
npm start
```
> Runs on: `http://localhost:5001`

---

### Start Frontend (Optional)
```bash
cd frontend
npm start
```
> Runs on: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint        | Description                                               |
|--------|-----------------|-----------------------------------------------------------|
| GET    | `/`             | Test route to verify server is running                   |
| GET    | `/login`        | Redirects user to Spotify login                          |
| GET    | `/callback`     | Handles Spotify redirect after login                     |
| GET    | `/refresh-token`| Refreshes Spotify access token manually                  |
| GET    | `/playlists`    | Retrieves user playlists                                 |
| GET    | `/generate`     | Generates a new playlist based on mood/weather           |

---

## Project Structure

smart-ai-playlist/
│
├── frontend/                 # React Frontend (Optional)
│
├── routes/                   # Express Routes
│   ├── auth.js              # Spotify Authentication Routes
│   ├── playlist.js         # Playlist Generation Routes
│
├── utils/                    # Helper Functions
│   ├── spotify.js          # Spotify API Requests
│   ├── weather.js          # Weather API Requests
│   ├── huggingface.js      # Hugging Face API Requests
│
├── .env                      # Environment Variables
├── server.js                 # Main Backend Entry Point
├── package.json
└── README.md
```

---

## Notes
- Spotify Client Credentials can be created at: https://developer.spotify.com/dashboard  
- Hugging Face API Token available at: https://huggingface.co/settings/tokens  
- Weather API used: https://api.weather.gov  

---


