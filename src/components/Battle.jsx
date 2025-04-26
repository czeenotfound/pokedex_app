import { useState, useEffect } from 'react';
import { getTeam, simulateBattle, saveBattle } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFistRaised, faSyncAlt, faBolt, faTrophy, faExclamationCircle, faShieldAlt, faHeartbeat, faRunning, faXmark } from '@fortawesome/free-solid-svg-icons';

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

const statIcons = {
  hp: faHeartbeat,
  attack: faBolt,
  defense: faShieldAlt,
  speed: faRunning
};

export default function Battle() {
  const [team, setTeam] = useState([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBattling, setIsBattling] = useState(false);
  const [battlePhase, setBattlePhase] = useState('selection');
  const [battleSaved, setBattleSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
    } catch (error) {
      setError('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleBattle = async () => {
    if (!selectedPokemon1 || !selectedPokemon2) {
      setError('Please select two Pokémon to battle');
      return;
    }
  
    setIsBattling(true);
    setBattlePhase('animation');
    setError('');
    setBattleSaved(false);
    setModalOpen(true);
  
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    const result = simulateBattle(selectedPokemon1, selectedPokemon2);
    setBattleResult(result);
    setIsBattling(false);
    setBattlePhase('result');
  };
  
  const resetBattle = async () => {
    if (battleResult && !battleSaved) {
      try {
        await saveBattle({
          pokemon1: selectedPokemon1.name,
          pokemon2: selectedPokemon2.name,
          winner: battleResult.winner,
          rounds: battleResult.rounds
        });
        setBattleSaved(true);
      } catch (error) {
        console.error('Failed to save battle result:', error);
      }
    }
  
    setSelectedPokemon1(null);
    setSelectedPokemon2(null);
    setBattleResult(null);
    setError('');
    setIsBattling(false);
    setBattlePhase('selection');
    setModalOpen(false);
  };
  
  const closeModal = () => {
    if (battleResult && !battleSaved) {
      resetBattle();
    } else {
      setModalOpen(false);
      setBattlePhase('selection');
    }
  };
  
  const getPokemonTypeGradient = (pokemon) => {
    if (!pokemon || !pokemon.types || pokemon.types.length === 0) {
      return 'bg-gray-100';
    }
    
    if (pokemon.types.length === 1) {
      return typeColors[pokemon.types[0]];
    }
    
    const type1 = pokemon.types[0];
    const type2 = pokemon.types[1];
    
    const color1 = typeColors[type1]?.replace('bg-', '') || 'gray-400';
    const color2 = typeColors[type2]?.replace('bg-', '') || 'gray-200';
    
    return `bg-gradient-to-br from-${color1} to-${color2}`;
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
        <p className="text-gray-600 font-medium animate-pulse">Loading your Pokémon team...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faFistRaised} className="text-red-500 mr-3" />
          Battle Arena
        </h1>
        
        {battlePhase === 'selection' && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mt-2 md:mt-0">
            Choose your fighters!
          </div>
        )}
      </div>

      {team.length < 2 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-500 text-4xl" />
          </div>
          <p className="text-gray-600 font-medium mb-6">You need at least 2 Pokémon in your team to battle!</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FontAwesomeIcon icon={faBolt} className="mr-2" />
            Catch More Pokémon
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {battlePhase === 'selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-red-600">Select First Pokémon</h2>
                <div className="grid grid-cols-2 gap-4">
                  {team.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => setSelectedPokemon1(pokemon)}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedPokemon1?.id === pokemon.id
                          ? 'border-red-500 bg-red-50 scale-105 shadow-md'
                          : 'hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-24 h-24 mx-auto"
                      />
                      <div className="text-center capitalize mt-2 font-medium">{pokemon.name}</div>
                      <div className="flex justify-center gap-1 mt-1">
                        {pokemon.types.map(type => (
                          <span
                            key={type}
                            className={`px-2 py-0.5 rounded text-xs text-white ${typeColors[type] || 'bg-gray-500'}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-blue-600">Select Second Pokémon</h2>
                <div className="grid grid-cols-2 gap-4">
                  {team.map((pokemon) => (
                    <button
                      key={pokemon.id}
                      onClick={() => setSelectedPokemon2(pokemon)}
                      disabled={selectedPokemon1?.id === pokemon.id}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedPokemon2?.id === pokemon.id
                          ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                          : selectedPokemon1?.id === pokemon.id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-24 h-24 mx-auto"
                      />
                      <div className="text-center capitalize mt-2 font-medium">{pokemon.name}</div>
                      <div className="flex justify-center gap-1 mt-1">
                        {pokemon.types.map(type => (
                          <span
                            key={type}
                            className={`px-2 py-0.5 rounded text-xs text-white ${typeColors[type] || 'bg-gray-500'}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            {battlePhase === 'selection' && (
              <button
                onClick={handleBattle}
                disabled={!selectedPokemon1 || !selectedPokemon2}
                className={`px-6 py-3 rounded-full text-white font-medium flex items-center shadow-lg transition-all duration-300 ${
                  !selectedPokemon1 || !selectedPokemon2 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-105'
                }`}
              >
                <FontAwesomeIcon icon={faBolt} className="mr-2" />
                Start Battle
              </button>
            )}
          </div>
          
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 backdrop-blur-sm animate-fade-in"></div>
            
              <div className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-4xl animate-slide-up max-h-[90vh] scroll-modal">
               
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-20 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                
                <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-6">
                  <h2 className="text-2xl font-bold text-center">
                    {battlePhase === 'animation' ? 'Battle in Progress!' : 'Battle Results'}
                  </h2>
                  <div className="text-center text-sm mt-1">
                    {battlePhase === 'animation' ? 'Fighting for victory...' : battleResult ? `Winner: ${battleResult.winner}` : ''}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-center items-center gap-8 mb-8 py-4 relative">
                    <div className="absolute inset-0 bg-gray-100 rounded-full opacity-30"></div>
                    
                    <div className={`relative z-10 transition-all duration-1000 ${
                      battlePhase === 'animation' ? 'animate-battle-left' : 
                      battleResult?.winner === selectedPokemon1?.name ? 'scale-110 transform' : ''
                    }`}>
                      <div className={`w-36 h-36 rounded-full ${getPokemonTypeGradient(selectedPokemon1)} p-3 flex items-center justify-center shadow-lg`}>
                        <img
                          src={selectedPokemon1?.image}
                          alt={selectedPokemon1?.name}
                          className={`w-32 h-32 ${battlePhase === 'animation' ? 'animate-battle-bounce' : ''}`}
                        />
                      </div>
                      <div className="capitalize font-semibold mt-2 text-center">
                        {selectedPokemon1?.name}
                        {battleResult?.winner === selectedPokemon1?.name && (
                          <div className="absolute -top-4 -right-4 transform rotate-12">
                            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold relative z-10">
                      <span className={`transition-all duration-500 ${
                        battlePhase === 'animation' ? 'text-red-500 animate-pulse text-4xl' : 'text-gray-400'
                      }`}>VS</span>
                    </div>
                    
                    <div className={`relative z-10 transition-all duration-1000 ${
                      battlePhase === 'animation' ? 'animate-battle-right' :
                      battleResult?.winner === selectedPokemon2?.name ? 'scale-110 transform' : ''
                    }`}>
                      <div className={`w-36 h-36 rounded-full ${getPokemonTypeGradient(selectedPokemon2)} p-3 flex items-center justify-center shadow-lg`}>
                        <img
                          src={selectedPokemon2?.image}
                          alt={selectedPokemon2?.name}
                          className={`w-32 h-32 ${battlePhase === 'animation' ? 'animate-battle-bounce' : ''}`}
                        />
                      </div>
                      <div className="capitalize font-semibold mt-2 text-center">
                        {selectedPokemon2?.name}
                        {battleResult?.winner === selectedPokemon2?.name && (
                          <div className="absolute -top-4 -right-4 transform rotate-12">
                            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {battlePhase === 'result' && battleResult && (
                    <>
                      <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-block bg-green-100 px-6 py-3 rounded-full">
                          <div className="text-sm text-gray-500 mb-1">Winner</div>
                          <div className="text-2xl font-bold text-green-600 capitalize flex items-center justify-center">
                            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 mr-2" />
                            {battleResult.winner}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 max-w-3xl mx-auto">
                        <h3 className="font-bold text-lg text-gray-700">Battle Rounds</h3>
                        {battleResult.rounds.map((round, index) => (
                          <div
                            key={round.stat}
                            className="bg-gray-50 p-4 rounded-xl shadow-sm animate-slide-up"
                            style={{ animationDelay: `${index * 200}ms` }}
                          >
                            <div className="flex items-center mb-2">
                              <FontAwesomeIcon 
                                icon={statIcons[round.stat] || faBolt} 
                                className="text-gray-500 mr-2" 
                              />
                              <div className="capitalize font-medium text-gray-700">{round.stat}</div>
                            </div>
                            
                            <div className="relative mb-5">
                              <div className="flex justify-between mb-1 px-2">
                                <div className="flex flex-col items-start">
                                  <span className="text-sm text-gray-500 capitalize">{selectedPokemon1?.name}</span>
                                  <span className={`text-lg font-bold ${round.winner === selectedPokemon1?.name ? 'text-red-600' : 'text-gray-700'}`}>
                                    {round[selectedPokemon1?.name]}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-sm text-gray-500 capitalize">{selectedPokemon2?.name}</span>
                                  <span className={`text-lg font-bold ${round.winner === selectedPokemon2?.name ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {round[selectedPokemon2?.name]}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex h-4 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`transition-all duration-1000 ${
                                    round.winner === selectedPokemon1?.name ? 'bg-red-500' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${(round[selectedPokemon1?.name] / (round[selectedPokemon1?.name] + round[selectedPokemon2?.name])) * 100}%` }}
                                ></div>
                                <div
                                  className={`transition-all duration-1000 ${
                                    round.winner === selectedPokemon2?.name ? 'bg-blue-500' : 'bg-blue-400'
                                  }`}
                                  style={{ width: `${(round[selectedPokemon2?.name] / (round[selectedPokemon1?.name] + round[selectedPokemon2?.name])) * 100}%` }}
                                ></div>
                              </div>
                              
                              {round.winner && (
                                <div className="absolute right-0 -bottom-7 ">
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium animate-fade-in">
                                    {round.winner === selectedPokemon1?.name ? 'Red wins' : 'Blue wins'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={resetBattle}
                          className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium flex items-center shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300"
                        >
                          <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                          New Battle
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes battle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-battle-bounce {
          animation: battle-bounce 0.6s infinite;
        }
        
        @keyframes battle-left {
          0% { transform: translateX(0); }
          25% { transform: translateX(40px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        .animate-battle-left {
          animation: battle-left 2s;
        }
        
        @keyframes battle-right {
          0% { transform: translateX(0); }
          25% { transform: translateX(-40px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(-20px); }
          100% { transform: translateX(0); }
        }
        .animate-battle-right {
          animation: battle-right 2s;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s forwards;
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s forwards;
        }
      `}</style>
    </div>
  );
} 
