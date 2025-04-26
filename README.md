# Pokédex App

A modern React application for exploring Pokémon, building teams, simulating battles, and viewing battle history.

## Features

- **Pokémon Explorer**: Browse and search for Pokémon
- **Pokémon Details**: View detailed information about each Pokémon
- **Team Builder**: Create and manage your Pokémon team
- **Battle Simulator**: Pit Pokémon against each other in simulated battles
- **Battle History**: Review past battles with detailed statistics

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/czeenotfound/pokedex_app
cd pokemon-app
npm install
```

## Running the Application

The application requires both the frontend development server and a JSON server for data storage to run simultaneously.

### Start the JSON Server

```bash
npm run server
```

This will start the JSON server on port 3001.

### Start the Development Server

In a new terminal:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
pokemon-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Battle.jsx    # Battle simulation component
│   │   └── Team.jsx      # Team management component
│   ├── pages/            # Main application pages
│   │   ├── Home.jsx      # Pokémon listing page
│   │   ├── PokemonDetails.jsx # Individual Pokémon details
│   │   └── BattleHistory.jsx  # Battle history page
│   ├── services/         # API and data services
│   │   └── api.js        # API interactions with PokéAPI and local server
│   ├── App.jsx           # Main application component with routing
│   └── main.jsx          # Application entry point
├── db.json               # JSON Server database file
├── package.json          # Project dependencies and scripts
└── vite.config.js        # Vite configuration
```

## Technologies Used

- **React**: UI library
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **JSON Server**: Full fake REST API for development
- **FontAwesome**: Icon library

## API

The application uses:

1. **PokéAPI**: External API for Pokémon data
2. **JSON Server**: Local storage for user-created data:
   - Team compositions
   - Battle records
   - User preferences

## Additional Scripts

- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally
- `npm run server` - Run the JSON server for local data storage

## Browser Support

The application is optimized for modern browsers that support ES6+ features.
