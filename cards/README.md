# Cards Project

## Overview
This project is a web application that allows users to create, manage, and join events. It features a Leaflet map for selecting event locations and provides a user-friendly interface for event management.

## Features
- Create new events with details such as name, type, participants, and time.
- Join existing events.
- Delete events.
- Select locations on a Leaflet map with confirmation prompts.

## Project Structure
```
cards
├── src
│   ├── pages
│   │   ├── Events
│   │   │   └── page.tsx        # Events management page
│   │   └── Map
│   │       └── page.tsx        # Map page for location selection
│   ├── components
│   │   └── MapSelector.tsx      # Component for the Leaflet map
│   ├── types
│   │   └── index.ts             # TypeScript types and interfaces
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Entry point of the application
├── package.json                  # npm configuration file
├── tsconfig.json                 # TypeScript configuration file
└── README.md                     # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd cards
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:5173/events` to access the Events page or `http://localhost:5173/map` to access the Map page.

## Usage
- On the Events page, you can add new events by filling out the form and selecting a location on the map.
- Click on the "Ort auf Karte wählen" button to navigate to the map for location selection.
- On the Map page, click on the desired location on the map and confirm your selection to return to the Events page with the selected location.

## Technologies Used
- React
- TypeScript
- Leaflet
- SWR for data fetching
- React Router for navigation

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.