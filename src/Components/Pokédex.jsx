import React from 'react';
import axios from 'axios';
import {PokemonCard} from './PokémonCard.jsx'; 
import * as S from './PokémonCard.style.jsx'; 

export class Pokedex extends React.Component {
  state = {
    pokemon: [],
    isLoading: true,
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

  render() {
    const { pokemon, isLoading } = this.state;

    if (isLoading) {
      return <h1>Carregando Pokédex...</h1>;
    }

    return (
      <S.Container>
        {pokemon.map((poke) => {
          return (
            <PokemonCard 
              key={poke.id} 
              pokemonData={poke}
            />
          );
        })}
      </S.Container>
    );
  }
}