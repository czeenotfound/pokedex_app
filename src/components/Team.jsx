import { useState, useEffect } from 'react';
import { getTeam, removeFromTeam } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTimes, faPlus, faWeight, faRulerVertical, faShieldAlt, faBolt, faHeartbeat, faRunning } from '@fortawesome/free-solid-svg-icons';

// Pokémon type colors
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

// Icon mapping for stats
const statIcons = {
  hp: faHeartbeat,
  attack: faBolt,
  defense: faShieldAlt,
  'special-attack': faBolt,
  'special-defense': faShieldAlt,
  speed: faRunning
};

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingPokemon, setRemovingPokemon] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTeam();
      setTeam(data);
    } catch (error) {
      setError('Failed to load team');
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setRemovingPokemon(id);
      setError('');
      await removeFromTeam(id);
      setTeam(prevTeam => prevTeam.filter(pokemon => pokemon.id !== id));
    } catch (error) {
      setError('Failed to remove Pokémon from team');
      console.error('Error removing Pokémon:', error);
    } finally {
      setRemovingPokemon(null);
    }
  };

  // Get primary stat for a Pokemon
  const getPrimaryStat = (pokemon) => {
    if (!pokemon.stats || pokemon.stats.length === 0) return null;
    return pokemon.stats.reduce((max, stat) => 
      stat.base_stat > max.base_stat ? stat : max, pokemon.stats[0]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-pulse">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="w-full h-full rounded-full border-8 border-red-500 border-t-transparent animate-spin"></div>
          <div className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-gray-200">
            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">Loading your team...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faUsers} className="text-red-500 mr-3" />
          My Pokémon Team
        </h1>
        
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0">
          <span className="font-bold">{team.length}</span> / 6 Pokémon in team
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {team.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
            alt="Psyduck" 
            className="w-32 h-32 mx-auto mb-4 animate-bounce-slow opacity-60"
          />
          <p className="text-gray-600 font-medium">Your team is empty! Add some Pokémon from the Pokédex.</p>
          <a 
            href="/" 
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Pokémon
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((pokemon, index) => {
            const primaryType = pokemon.types[0];
            const primaryColor = typeColors[primaryType] || 'bg-gray-500';
            const primaryStat = getPrimaryStat(pokemon);
            
            return (
              <div
                key={pokemon.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${primaryColor} relative p-4 flex justify-between items-start h-32 overflow-hidden`}>
                  {/* Pokemon image - positioned at bottom of colored header */}
                  <div className="absolute right-2 bottom-0 transform translate-y-8 w-32 h-32 z-10">
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  
                  {/* Background decoration */}
                  <div className="absolute w-24 h-24 rounded-full bg-white opacity-10 -top-6 -left-6"></div>
                  <div className="absolute w-32 h-32 rounded-full bg-white opacity-10 -bottom-16 -right-10"></div>
                  
                  {/* Pokemon ID and Name */}
                  <div className="z-10">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full inline-block mb-2">
                      <span className="text-sm font-bold text-gray-800">#{pokemon.id.toString().padStart(3, '0')}</span>
                    </div>
                    <h2 className="text-2xl font-bold capitalize text-white">{pokemon.name}</h2>
                  </div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(pokemon.id)}
                    disabled={removingPokemon === pokemon.id}
                    className={`z-10 bg-white hover:bg-red-50 text-red-500 rounded-full p-2 transition-colors shadow-md ${
                      removingPokemon === pokemon.id ? 'opacity-50 cursor-wait' : ''
                    }`}
                    title="Remove from team"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                {/* Pokemon details */}
                <div className="p-5 pt-10">
                  {/* Types */}
                  <div className="flex gap-2 mb-4">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${typeColors[type] || 'bg-gray-500'} shadow-sm capitalize`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  {/* Physical characteristics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <FontAwesomeIcon icon={faWeight} className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-semibold">{pokemon.weight / 10} kg</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center">
                      <FontAwesomeIcon icon={faRulerVertical} className="text-green-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Height</p>
                        <p className="font-semibold">{pokemon.height / 10} m</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key stats */}
                  {primaryStat && (
                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <div className="text-sm text-gray-500 mb-1">Strongest Stat</div>
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full ${primaryColor} flex items-center justify-center mr-2`}>
                          <FontAwesomeIcon 
                            icon={statIcons[primaryStat.stat.name] || faBolt} 
                            className="text-white text-xs" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">
                              {primaryStat.stat.name.replace('-', ' ')}
                            </span>
                            <span className="text-sm font-bold">
                              {primaryStat.base_stat}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`${primaryColor} h-2 rounded-full`}
                              style={{ width: `${Math.min((primaryStat.base_stat / 255) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Empty team slots */}
          {[...Array(6 - team.length)].map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 min-h-[320px]"
            >
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faPlus} className="text-gray-300 text-2xl" />
              </div>
              <p className="text-gray-400 text-center">Empty team slot</p>
              <a 
                href="/" 
                className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100 transition-colors text-sm"
              >
                Add Pokémon
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 