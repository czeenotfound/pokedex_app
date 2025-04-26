import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetails from "./pages/PokemonDetails";
import Team from "./components/Team";
import Battle from "./components/Battle";
import BattleHistory from "./pages/BattleHistory";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faBolt, faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-red-700 shadow mb-8 ">
         <header className="flex flex-col md:flex-row xl:container xl:mx-auto justify-between items-center bg-red-700 text-white shadow p-4">
          <Link to="/">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
                alt="Pikachu" 
                className="w-16 h-16 mr-4"
              />
              <h1 className="text-4xl font-bold">Pokédex</h1>
            </div>
          </Link>
          <nav className="flex space-x-4 bg-red-700">
            <Link to="/" className="px-4 py-4 hover:bg-gray-100 rounded-lg transition hover:text-gray-800 ">
              <FontAwesomeIcon icon={faHome} className="text-2xl mr-2" /> Home
            </Link>
            <Link to="/team" className="px-4 py-4 hover:bg-gray-100 rounded-lg transition hover:text-gray-800 ">
              <FontAwesomeIcon icon={faUsers} className="text-2xl mr-2" /> Team
            </Link>
            <Link to="/battle" className="px-4 py-4 hover:bg-gray-100 rounded-lg transition hover:text-gray-800 ">
              <FontAwesomeIcon icon={faBolt} className="text-2xl mr-2" /> Battle
            </Link>
            <Link to="/history" className="px-4 py-4 hover:bg-gray-100 rounded-lg transition hover:text-gray-800 ">
              <FontAwesomeIcon icon={faTrophy} className="text-2xl mr-2" /> History
            </Link>
          </nav>
        </header>
      </div>
     

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route path="/team" element={<Team />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/history" element={<BattleHistory />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>Pokédex - Built with React & PokéAPI</p>
      </footer>
    </div>
  );
}
