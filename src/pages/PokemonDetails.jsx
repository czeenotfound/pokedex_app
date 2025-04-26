import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails, addToTeam, getTeam } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faWeightHanging, faRulerVertical, faStar, faPlus } from '@fortawesome/free-solid-svg-icons';

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

export default function PokemonDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToTeam, setAddedToTeam] = useState(false);

  useEffect(() => {
    fetchPokemonDetails();
  }, [name]);

  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);
      const data = await getPokemonDetails(name);
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      setError('Failed to load Pokemon details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTeam = async () => {
    try {
      const simplifiedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(t => t.type.name),
        stats: pokemon.stats,
        height: pokemon.height,
        weight: pokemon.weight
      };
      await addToTeam(simplifiedPokemon);
      setAddedToTeam(true);
        navigate('/team');
    } catch (error) {
      setError(error.message);
    }
  };

  const getStatColor = (statName, value) => {
    if (value < 50) return 'bg-red-500';
    if (value < 80) return 'bg-yellow-500';
    if (value < 120) return 'bg-green-500';
    return 'bg-blue-500';
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
        <p className="text-gray-600 font-medium animate-pulse">Loading Pokémon data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 max-w-md mx-auto">
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Pokédex
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="text-center py-12">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" 
          alt="Magikarp" 
          className="w-32 h-32 mx-auto mb-4 animate-bounce-slow opacity-60"
        />
        <p className="text-gray-600 font-medium">Pokémon not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Pokédex
        </button>
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const primaryColor = typeColors[primaryType] || 'bg-gray-500';
  const textColor = ['electric', 'ice', 'fairy', 'normal', 'flying', 'bug'].includes(primaryType) ? 'text-gray-800' : 'text-white';

  return (
    <div className="container mx-auto px-4 mb-10 animate-fade-in-up">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 flex items-center text-gray-700 hover:text-red-500 transition-colors group"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
        Back to Pokédex
      </button>

      <div className={`${primaryColor} rounded-t-2xl shadow-lg p-6 relative overflow-hidden`}>
        <div className="absolute w-40 h-40 rounded-full bg-white opacity-10 -top-20 -left-20"></div>
        <div className="absolute w-32 h-32 rounded-full bg-white opacity-10 top-10 -right-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white bg-opacity-20 rounded-full px-4 py-1 mr-4 backdrop-blur-sm">
              <span className={`text-xl font-bold text-gray-800`}>#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            <h1 className={`text-4xl font-bold capitalize ${textColor}`}>{pokemon.name}</h1>
          </div>
          
          <div className="flex gap-2">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`px-4 py-2 rounded-full text-gray-800 text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm capitalize shadow`}
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bg-gray-50 rounded-2xl p-8 flex justify-center items-center shadow-inner">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
              <FontAwesomeIcon icon={faWeightHanging} className="text-blue-500 mb-2 text-xl" />
              <p className="text-gray-500 text-sm">Weight</p>
              <p className="font-medium">{pokemon.weight / 10} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm text-center">
              <FontAwesomeIcon icon={faRulerVertical} className="text-green-500 mb-2 text-xl" />
              <p className="text-gray-500 text-sm">Height</p>
              <p className="font-medium">{pokemon.height / 10} m</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAddToTeam}
              disabled={addedToTeam}
              className={`w-full py-3 px-4 rounded-full flex items-center justify-center font-medium text-white shadow-lg transform hover:scale-105 transition-all ${
                addedToTeam 
                  ? 'bg-green-500' 
                  : `bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700`
              }`}
            >
              {addedToTeam ? (
                <>
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  Added to Team!
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add to Team
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="md:col-span-7 lg:col-span-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Base Stats</h2>
            <div className="space-y-4">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <div key={stat.name} className="bg-gray-50 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between mb-1">
                    <div className="text-gray-700 capitalize font-medium">{stat.name.replace('-', ' ')}</div>
                    <div className="font-bold">{base_stat}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getStatColor(stat.name, base_stat)} h-3 rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min((base_stat / 255) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Abilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <div 
                  key={ability.name}
                  className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center"
                >
                  {is_hidden && <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-3" />}
                  <div>
                    <div className="font-medium capitalize">{ability.name.replace('-', ' ')}</div>
                    {is_hidden && <div className="text-xs text-gray-500">Hidden Ability</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {pokemon.moves && pokemon.moves.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Moves</h2>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves.slice(0, 10).map(({ move }) => (
                    <span
                      key={move.name}
                      className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 shadow-sm capitalize"
                    >
                      {move.name.replace('-', ' ')}
                    </span>
                  ))}
                  {pokemon.moves.length > 10 && (
                    <span className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200 shadow-sm">
                      +{pokemon.moves.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 