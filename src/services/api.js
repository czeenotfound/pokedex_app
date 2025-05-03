import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const POKE_API_BASE = 'https://pokeapi.co/api/v2';
const JSON_SERVER_BASE = apiUrl;
// const JSON_SERVER_BASE = 'http://localhost:10000';

// PokeAPI services
export const getPokemonList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${POKE_API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getPokemonDetails = async (nameOrId) => {
  const response = await axios.get(`${POKE_API_BASE}/pokemon/${nameOrId}`);
  return response.data;
};

// Team services
export const getTeam = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_BASE}/team`);
    return response.data;
  } catch (error) {
    console.error('Error getting team:', error);
    throw new Error('Failed to get team');
  }
};

export const addToTeam = async (pokemon) => {
  try {
    const team = await getTeam();
    if (team.length >= 6) {
      throw new Error('Team is already full (max 6 Pokémon)');
    }
    const response = await axios.post(`${JSON_SERVER_BASE}/team`, pokemon);
    return response.data;
  } catch (error) {
    console.error('Error adding to team:', error);
    throw error;
  }
};

export const removeFromTeam = async (id) => {
  try {
    const response = await axios.delete(`${JSON_SERVER_BASE}/team/${id}`);
    if (response.status === 200) {
      return true;
    }
    throw new Error('Failed to remove Pokémon');
  } catch (error) {
    console.error('Error removing from team:', error);
    throw new Error('Failed to remove Pokémon from team');
  }
};

// Battle services
export const saveBattle = async (battle) => {
  const response = await axios.post(`${JSON_SERVER_BASE}/battles`, {
    ...battle,
    date: new Date().toISOString()
  });
  return response.data;
};

export const getBattleHistory = async () => {
  const response = await axios.get(`${JSON_SERVER_BASE}/battles`);
  return response.data;
};

// Battle simulation
export const simulateBattle = (pokemon1, pokemon2) => {
  const rounds = [
    { stat: 'hp', value1: pokemon1.stats.find(s => s.stat.name === 'hp').base_stat, value2: pokemon2.stats.find(s => s.stat.name === 'hp').base_stat },
    { stat: 'attack', value1: pokemon1.stats.find(s => s.stat.name === 'attack').base_stat, value2: pokemon2.stats.find(s => s.stat.name === 'attack').base_stat },
    { stat: 'speed', value1: pokemon1.stats.find(s => s.stat.name === 'speed').base_stat, value2: pokemon2.stats.find(s => s.stat.name === 'speed').base_stat }
  ];

  let pokemon1Wins = 0;
  let pokemon2Wins = 0;

  const results = rounds.map(round => {
    const winner = round.value1 > round.value2 ? pokemon1.name : pokemon2.name;
    if (winner === pokemon1.name) pokemon1Wins++;
    else pokemon2Wins++;
    return {
      stat: round.stat,
      [pokemon1.name]: round.value1,
      [pokemon2.name]: round.value2,
      winner
    };
  });

  return {
    winner: pokemon1Wins > pokemon2Wins ? pokemon1.name : pokemon2.name,
    rounds: results
  };
}; 
