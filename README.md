# HandShake App

A production-ready React Native application featuring an **Asynchronous-to-Synchronous Player Handshake**. This system allows players to challenge each other, wake each other up via push notifications or sockets, and transition into a live, synchronous gaming state.

## Features

- **Async-to-Sync Handshake**: Seamlessly transition from an offline/background state to a live active session.
- **Real-time Notifications**: Uses Socket.io for active users and Expo Push Notifications for background/offline users.
- **Dynamic UI States**:
  - **Home Screen**: Send challenges to other players.
  - **Incoming Call Screen**: "Wake-up" UI for receiving challenges (Accept/Decline).
  - **Active State Screen**: Live session environment once both players are connected.
- **Presence Tracking**: Real-time monitoring of user connection status.

## Tech Stack

- **Frontend**: React Native, Expo, TypeScript, Socket.io-client, Axios.
- **Backend**: Node.js, Express, Socket.io, Expo Server SDK (for push notifications).

## Project Structure

```text
.
├── backend/              # Node.js server
│   ├── src/              # Backend source code
│   ├── push.js           # Push notification logic
│   └── server.js         # Socket.io and API endpoints
├── frontend/             # React Native (Expo) app
│   ├── src/
│   │   ├── api/          # Axios client configuration
│   │   ├── screens/      # App screens (Home, Incoming, Active)
│   │   ├── socket/       # Socket.io client setup
│   │   └── types/        # TypeScript definitions
│   └── App.tsx           # Main application entry and navigation
└── package.json          # Project dependencies
```

## Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *The server will run on `http://localhost:3000`.*

### 2. Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo app:
   ```bash
   npx expo start
   ```
4. Use Expo Go on your physical device or an emulator to run the app.

## Architecture Overview

1. **Challenge Issuance**: Player A sends a challenge via a POST request to the backend.
2. **Wake-up Mechanism**:
   - If Player B is online, the backend emits a `challenge_received` event via Socket.io.
   - If Player B is offline, the backend sends a push notification via Expo.
3. **Transition**: Player B interacts with the "Incoming Call" UI. Upon acceptance, both players are moved to the `ActiveStateScreen`, establishing a synchronous connection.