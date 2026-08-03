# Wayfarer Hub

A collaborative, multi-stop travel planner designed in a premium Scandinavian Travelogue aesthetic. Groups can map out trips together, drag-and-drop daily schedules, view live cursor points of their friends, vote on restaurants, and use a sidebar group chat.

## Subproject Slug

`wayfarer-hub`

## Firebase Prefixes

| Resource | Prefix / Path |
|---|---|
| Firestore collections | `wayfarer-hub_users`, `wayfarer-hub_trips`, `wayfarer-hub_presence`, `wayfarer-hub_chats` |
| Cloud Functions | `wayfarerHubFetchLocations`, `wayfarerHubCompileItinerary` |

## Stack

- **Frontend**: React + TypeScript + Vite (client-side only, no server code)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Styling**: Minimalist Scandinavian Travelogue aesthetic (warm beige, sage-green, rounded corners, Playfair Display & Inter typography)
- **Map**: Leaflet with sepia-tinted tile layout matching the design palette

## Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment**:
   Copy `.env.example` to `.env` (already done and prepopulated with active portfolio project config).
   ```bash
   cp .env.example .env
   ```

3. **Install functions dependencies & build**:
   ```bash
   cd functions
   npm install
   npm run build
   cd ..
   ```

4. **Run locally using Firebase Emulator Suite & Vite**:
   ```bash
   # In terminal 1: Run the Firebase Emulator Suite
   npm run emulators
   
   # In terminal 2: Run the Vite Development Server
   npm run dev
   ```

## Security Rules Summary

- `wayfarer-hub_users` — read: any signed-in user; create/update: owner only.
- `wayfarer-hub_trips` — read/write: owner, listed members, or users whose email is in `invitedEmails`.
- `wayfarer-hub_presence` — read: any signed-in user; write: owner (presenceId contains owner's uid).
- `wayfarer-hub_chats` — read: any signed-in user; create: owner (userId matches auth uid).
- Everything else: denied.
