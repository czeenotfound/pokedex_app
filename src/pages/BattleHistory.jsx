import { useState, useEffect } from 'react';
import { getBattleHistory, getPokemonDetails } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faFistRaised, faBolt, faHistory, faSkull } from '@fortawesome/free-solid-svg-icons';

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

export default function BattleHistory() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pokemonImages, setPokemonImages] = useState({});

  useEffect(() => {
    fetchBattleHistory();
  }, []);

  const fetchBattleHistory = async () => {
    try {
      setLoading(true);
      const data = await getBattleHistory();
      const battlesData = data.reverse();
      setBattles(battlesData);
      
      const imagesData = {};
      for (const battle of battlesData) {
        try {
          if (!imagesData[battle.winner]) {
            const pokemonData = await getPokemonDetails(battle.winner);
            imagesData[battle.winner] = pokemonData.sprites.other['official-artwork'].front_default || 
                                        pokemonData.sprites.other.home.front_default ||
                                        pokemonData.sprites.front_default;
          }
          
          const loser = battle.pokemon1 === battle.winner ? battle.pokemon2 : battle.pokemon1;
          if (!imagesData[loser]) {
            const pokemonData = await getPokemonDetails(loser);
            imagesData[loser] = pokemonData.sprites.other['official-artwork'].front_default || 
                                pokemonData.sprites.other.home.front_default ||
                                pokemonData.sprites.front_default;
          }
        } catch (err) {
          console.error(`Failed to load image for pokemon`, err);
          if (!imagesData[battle.winner]) {
            imagesData[battle.winner] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`;
          }
          
          const loser = battle.pokemon1 === battle.winner ? battle.pokemon2 : battle.pokemon1;
          if (!imagesData[loser]) {
            imagesData[loser] = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`;
          }
        }
      }
      setPokemonImages(imagesData);
    } catch (error) {
      setError('Failed to load battle history');
    } finally {
      setLoading(false);
    }
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
        <p className="text-gray-600 font-medium animate-pulse">Loading battle history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 max-w-md mx-auto">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 mr-3" />
          Battle History
        </h1>
        
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0">
          <FontAwesomeIcon icon={faHistory} className="mr-2" />
          {battles.length} {battles.length === 1 ? 'battle' : 'battles'} recorded
        </div>
      </div>

      {battles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" 
            alt="Magikarp" 
            className="w-32 h-32 mx-auto mb-4 animate-bounce-slow opacity-60"
          />
          <p className="text-gray-600 font-medium">No battles yet. Go to the Battle Arena to create some history!</p>
          <a 
            href="/battle" 
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FontAwesomeIcon icon={faBolt} className="mr-2" />
            Go Battle Now
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {battles.map((battle, index) => {
            const battleDate = new Date(battle.date);
            const now = new Date();
            const diffTime = Math.abs(now - battleDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeAgo;
            if (diffDays > 0) {
              timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            } else if (diffHours > 0) {
              timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else {
              timeAgo = `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
            }

            const winner = battle.winner;
            const loser = battle.pokemon1 === winner ? battle.pokemon2 : battle.pokemon1;
            
            const winnerImage = pokemonImages[winner] || 
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`;
            const loserImage = pokemonImages[loser] || 
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png`;
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <FontAwesomeIcon icon={faFistRaised} className="text-red-500 mr-2" />
                      <h3 className="text-lg font-bold">Battle #{battles.length - index}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span title={battleDate.toLocaleString()}>{timeAgo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-12 gap-0">
                  <div className="col-span-3 p-4 flex flex-col items-center justify-center border-r border-gray-100">
                    <div className="relative">
                      <div className="relative">
                        <img 
                          src={winnerImage}
                          alt={winner}
                          className="w-28 h-28 object-contain"
                        />
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full shadow-md">
                          <FontAwesomeIcon icon={faTrophy} className="text-lg" />
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          WINNER
                        </span>
                        <h3 className="capitalize font-bold text-lg mt-1 text-gray-800">{winner}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-6 p-4 bg-gray-50 border-r border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3 text-center">Battle Stats</h4>
                    <div className="space-y-4">
                      {battle.rounds.map((round) => {
                        const winnerValue = round[winner];
                        const loserValue = round[loser];
                        const total = winnerValue + loserValue;
                        const winnerPercent = (winnerValue / total) * 100;
                        const loserPercent = (loserValue / total) * 100;
                        
                        return (
                          <div key={round.stat} className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center text-sm mb-2">
                              <div className="capitalize font-medium">{round.stat}</div>
                              <div className="text-xs px-3 py-1 bg-gray-50 rounded-full shadow-sm">
                                <span className="text-green-600 font-bold">{winnerValue}</span>
                                {' vs '}
                                <span className="text-gray-500">{loserValue}</span>
                              </div>
                            </div>
                            
                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-green-500"
                                style={{ width: `${winnerPercent}%` }}
                              ></div>
                              <div 
                                className="h-full bg-gray-400"
                                style={{ width: `${loserPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="col-span-3 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <div className="relative">
                      <div className="relative">
                        <img 
                          src={loserImage}
                          alt={loser}
                          className="w-28 h-28 object-contain filter grayscale opacity-80"
                        />
                        <div className="absolute -top-2 -right-2 bg-gray-500 text-white p-1 rounded-full shadow-md">
                          <FontAwesomeIcon icon={faSkull} className="text-lg" />
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                          DEFEATED
                        </span>
                        <h3 className="capitalize font-bold text-lg mt-1 text-gray-500">{loser}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
} 