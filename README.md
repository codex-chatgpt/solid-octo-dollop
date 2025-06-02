# AI Interviewer App

This project contains a simple full stack application demonstrating how to build an AI interviewer using React, Express, MongoDB and Google's Gemini API. Voice input and output are supported via the Web Speech API.

## Structure

- `server/` – Express API server using Mongoose for MongoDB and calling the Gemini API.
- `client/` – React front‑end with voice capture and speech synthesis.

## Setup

1. Copy `server/.env.example` to `server/.env` and fill in your MongoDB connection string and Gemini API key.
2. Install dependencies for server and client:

```bash
cd server && npm install
cd ../client && npm install
```

3. Start the server:

```bash
cd ../server && npm start
```

4. In another terminal start the React client:

```bash
cd client && npm start
```

The client expects the API server to run on port `5000`. Adjust the proxy in `client/package.json` or configure your web server as needed.
