import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonList, getPokemonDetails } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const typeColors = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300'
};

export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchPokemon();
  }, [page, selectedType]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      
      if (!selectedType) {
        const response = await getPokemonList(20, page * 20);
        setTotalCount(response.count);
        
        const detailedPokemon = await Promise.all(
          response.results.map(async (p) => {
            const details = await getPokemonDetails(p.name);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other['official-artwork'].front_default,
              types: details.types.map(t => t.type.name),
              weight: details.weight,
              height: details.height
            };
          })
        );
        setPokemon(detailedPokemon);
      } 
      else {
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        const typeData = await typeResponse.json();
        
        const startIndex = page * 20;
        const endIndex = startIndex + 20;
        const paginatedPokemon = typeData.pokemon.slice(startIndex, endIndex);
        setTotalCount(typeData.pokemon.length);
        
        const detailedPokemon = await Promise.all(
          paginatedPokemon.map(async (p) => {
            const details = await getPokemonDetails(p.pokemon.name);
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other['official-artwork'].front_default,
              types: details.types.map(t => t.type.name),
              weight: details.weight,
              height: details.height
            };
          })
        );
        setPokemon(detailedPokemon);
      }
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      fetchPokemon();
      return;
    }
    
    try {
      setLoading(true);
      
      try {
        const details = await getPokemonDetails(searchTerm.toLowerCase());
        setPokemon([{
          id: details.id,
          name: details.name,
          image: details.sprites.other['official-artwork'].front_default,
          types: details.types.map(t => t.type.name),
          weight: details.weight,
          height: details.height
        }]);
      } catch (error) {
        setPokemon([]);
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      setPokemon([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchPokemon();
  };

  return (
    <>
      <div className="bg-gradient-to-r  from-red-50 to-blue-50 rounded-full shadow-xl p-6 mb-8 border-2 border-gray-200 transform hover:scale-[1.01] transition-transform duration-300">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-grow md:mr-4">
            <input
              type="text"
              placeholder="Search Pokémon by exact name or ID..."
              className="w-full px-4 py-3 border-2 border-red-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pl-12 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-5 top-4 text-red-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            {searchTerm && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            <button 
              type="submit" 
              className="absolute right-3 top-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
               <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(0);
              }}
              className="px-4 py-2 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white shadow-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232563eb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.25rem',
                paddingRight: '2.5rem'
              }}
            >
              <option value="">All Types</option>
              {Object.keys(typeColors).map(type => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12 animate-pulse">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="w-full h-full rounded-full border-8 border-red-500 border-t-transparent animate-spin"></div>
            <div className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-gray-200">
              <div className="w-4 h-4 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Catching Pokémon...</p>
        </div>
      ) : pokemon.length === 0 ? (
        <div className="text-center py-12">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" 
            alt="Magikarp" 
            className="w-32 h-32 mx-auto mb-4 animate-bounce-slow opacity-60"
          />
          <p className="text-gray-600 font-medium">No Pokémon found matching your criteria.</p>
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <i className="fas fa-sync-alt mr-2 text-white"></i>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {pokemon.map((p, index) => (
              <Link
                key={p.id}
                to={`/pokemon/${p.name}`}
                className="pokemon-card bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-red-300 transition-all duration-300 transform hover:translate-y-[-5px] hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex justify-center relative overflow-hidden">
                  <div className="absolute w-20 h-20 rounded-full bg-red-100 opacity-70 -top-10 -left-10"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-100 opacity-70 top-5 -right-6"></div>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-32 h-32 object-contain z-10 transform transition-transform duration-500 hover:scale-110 drop-shadow-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800 capitalize">{p.name}</h3>
                    <span className="text-red-500 font-mono font-bold">#{p.id.toString().padStart(3, '0')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.types.map(type => (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${typeColors[type]} shadow-sm`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center"><i className="fas fa-weight-hanging mr-1 text-blue-500"></i> {p.weight / 10} kg</span>
                    <span className="flex items-center"><i className="fas fa-ruler-vertical mr-1 text-green-500"></i> {p.height / 10} m</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!searchTerm && (
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-5 py-2 rounded-full border-2 bg-white hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 flex items-center transition-colors group"
              >
                <i className="fas fa-chevron-left mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform"></i>
                Previous
              </button>
              <span className="flex items-center px-4 py-2 bg-red-100 rounded-full font-medium border-2 border-red-200">
                Page {page + 1} of {Math.ceil(totalCount / 20)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(totalCount / 20) - 1}
                className="px-5 py-2 rounded-full border-2 bg-white hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 flex items-center transition-colors group"
              >
                Next
                <i className="fas fa-chevron-right ml-2 group-hover:transform group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
} 