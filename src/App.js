import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState(null);
  const [error, setError] = useState('');

  // Función para cargar los primeros 20 Pokémon
  const loadInitialPokemons = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(res => res.json())
      .then(data => {
        const fetches = data.results.map(pokemon =>
          fetch(pokemon.url).then(res => res.json())
        );
        Promise.all(fetches).then(results => {
          setPokemonList(results);
          setFilteredPokemon(null);
        });
      });
  };

  // Cargar al iniciar
  useEffect(() => {
    loadInitialPokemons();
  }, []);

  // Buscar por ID o nombre
  const handleSearch = () => {
    if (!searchId.trim()) {
      loadInitialPokemons(); // Si el campo está vacío, recarga los 20
      setError('');
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchId.toLowerCase()}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró ese Pokémon');
        return res.json();
      })
      .then(data => {
        setFilteredPokemon(data);
        setError('');
      })
      .catch(err => {
        setFilteredPokemon(null);
        setError(err.message);
      });
  };

  return (
    <div className="App">
      <h1>Pokédex</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por ID o nombre"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="pokemon-container">
        {filteredPokemon ? (
          <div className="card">
            <img src={filteredPokemon.sprites.front_default} alt={filteredPokemon.name} />
            <h3>{filteredPokemon.name.charAt(0).toUpperCase() + filteredPokemon.name.slice(1)}</h3>
            <p><strong>Tipo:</strong> {filteredPokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Altura:</strong> {filteredPokemon.height / 10} m</p>
            <p><strong>Peso:</strong> {filteredPokemon.weight / 10} kg</p>
            <p><strong>Habilidades:</strong> {filteredPokemon.abilities.map(a => a.ability.name).join(', ')}</p>
          </div>
        ) : (
          pokemonList.map(p => (
            <div key={p.id} className="card">
              <img src={p.sprites.front_default} alt={p.name} />
              <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
              <p><strong>Tipo:</strong> {p.types.map(t => t.type.name).join(', ')}</p>
              <p><strong>Altura:</strong> {p.height / 10} m</p>
              <p><strong>Peso:</strong> {p.weight / 10} kg</p>
              <p><strong>Habilidades:</strong> {p.abilities.map(a => a.ability.name).join(', ')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
