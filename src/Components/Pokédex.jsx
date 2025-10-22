import React from 'react';
import axios from 'axios';
import PokemonCard from './PokémonCard.jsx'; 
import PokemonDetails from './PokémonDetails.jsx';
import * as S from './PokémonCard.style.jsx'; 

export class Pokedex extends React.Component {
  state = {
    pokemon: [],
    isLoading: true,
    selectedPokemon: null,
  };

  componentDidMount() {
    this.getPokemons();
  }

  getPokemons = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
      const listaSimplesDePokemon = response.data.results;
      const dadosPokemonDetalhados = [];

      for (const pokemon of listaSimplesDePokemon) {
        const respostaDetalhada = await axios.get(pokemon.url);
        dadosPokemonDetalhados.push(respostaDetalhada.data);
      }

      this.setState({
        pokemon: dadosPokemonDetalhados,
        isLoading: false,
      });
    } catch (error) {
      console.error("Erro ao buscar Pokémon", error);
      this.setState({ isLoading: false });
    }
  };

  handleCardClick = (pokemonData) => {
    this.setState({ selectedPokemon: pokemonData });
  };

  handleCloseDetails = () => {
    this.setState({ selectedPokemon: null });
  };

  render() {
    const { pokemon, isLoading, selectedPokemon } = this.state;

    if (isLoading) {
      return <h1>Carregando Pokédex...</h1>;
    }

    return (
      <div>
        <S.Container>
          {pokemon.map((poke) => {
            return (
              <PokemonCard 
                key={poke.id} 
                pokemonData={poke}
                onCardClick={() => this.handleCardClick(poke)} 
              />
            );
          })}
        </S.Container>

        {selectedPokemon && (
          <PokemonDetails 
            pokemon={selectedPokemon} 
            onClose={this.handleCloseDetails} 
          />
        )}
      </div>
    );
  }
}

export default Pokedex;