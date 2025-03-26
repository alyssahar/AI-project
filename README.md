
Smart AI Playlist - README

Overview

This project provides a **Smart AI Playlist** that generates dynamic playlists based on user mood or weather conditions. It integrates with the **Spotify API** to retrieve user playlists and also uses the **Weather API** to adjust recommendations based on location-specific weather data.

---

Table of Contents

- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Code Structure](#code-structure)

---

Technologies Used

- **Node.js**: JavaScript runtime used for the backend.
- **Express.js**: Web framework for Node.js, used to create API routes.
- **Axios**: HTTP client to make requests to external APIs (Spotify, Weather).
- **Node-Cron**: Used for scheduling tasks like token refreshing.
- **React.js**: Frontend JavaScript framework for building interactive UIs.
- **Spotify API**: Used for interacting with Spotify to get user playlists and manage music data.
- **Weather API (Weather.gov)**: Used to get real-time weather data to adjust playlist recommendations.
- **dotenv**: To securely store environment variables like API keys.

---

## Setup Instructions

1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-ai-playlist.git
cd smart-ai-playlist
```

2. Install Dependencies

- Install backend dependencies:

```bash
npm install
```

- Install frontend dependencies (in the frontend folder, if applicable):

```bash
cd frontend
npm install
```

3. Create a `.env` File

Create a `.env` file in the root of the project and add your Spotify API credentials:

```plaintext
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://localhost:5001/callback
```

4. Run the Backend Server

Start the backend server:

```bash
npm start
```

This will start the server on `http://localhost:5001`. The server handles routes for Spotify authentication, playlist retrieval, and weather-based playlist generation.

### 5. Run the Frontend Server (if applicable)

If you have a frontend React application, navigate to the `frontend` directory and start the React development server:

```bash
cd frontend
npm start
```

The frontend should now be running on `http://localhost:3000`.

---

API Endpoints

 `/login`
- **Method**: `GET`
- **Description**: Initiates the login process for Spotify authentication.
- **Example**: Redirects to Spotify's login page.

`/callback`
- **Method**: `GET`
- **Description**: Handles the callback from Spotify after successful login. Exchanges the authorization code for an access token and a refresh token.
- **Query Parameter**: `code` (Authorization code returned from Spotify).
- **Example**: `/callback?code=authCodeFromSpotify`

`/playlists`
- **Method**: `GET`
- **Description**: Fetches the user's Spotify playlists after successful authentication.
- **Headers**: `Authorization: Bearer <access_token>`
- **Example Response**:
  ```json
  {
    "items": [
      {
        "name": "My Playlist",
        "id": "playlist-id",
        "tracks": {
          "total": 50
        }
      }
    ]
  }
  ```

 `/weather`
- **Method**: `GET`
- **Description**: Fetches the weather data for a given latitude and longitude.
- **Query Parameters**: `lat`, `lon` (Latitude and Longitude).
- **Example**: `/weather?lat=37.7749&lon=-122.4194`

 `/refresh-token`
- **Method**: `POST`
- **Description**: Refreshes the Spotify access token using the stored refresh token.
- **Example Response**:
  ```json
  {
    "access_token": "new-access-token"
  }
  ```

---

Code Structure

Backend (Node.js + Express)

- `server.js`: Main server file that sets up routes for authentication, playlists, and weather API interaction.
- `auth.js`: Handles Spotify authentication logic.
- `weather.js`: Interacts with the Weather API to retrieve weather data.
- `cron.js`: Handles the automatic refresh of the Spotify access token using `node-cron`.

Frontend (React)

- `src/App.js`: The main React component that ties together the UI for playlist generation and interaction.
- `src/components/Playlist.js`: Component to display user playlists.
- `src/components/WeatherInput.js`: Component to take user input for location and weather-based playlist generation.

---

Running the Tests

For backend, you can run tests using Jest or Mocha (whichever you're using). Install the testing libraries:

```bash
npm install --save-dev jest mocha
```

Then, run your tests:

```bash
npm test
```
