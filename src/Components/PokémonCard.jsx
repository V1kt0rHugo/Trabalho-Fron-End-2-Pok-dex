import React from 'react';
import axios from 'axios';
import * as S from './PokémonCard.style.jsx';

export class PokemonCard extends React.Component {
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
      return <h1>Carregando Cards...</h1>;
    }

    return (
      <S.Container>
        {pokemon.map((poke) => {
          return (
            <S.Card key={poke.id}>
              <S.Imagem
                src={poke.sprites.front_default}
                alt={poke.name}
              />
              <S.Info>
                <S.DexNumber>#{String(poke.id).padStart(3, '0')}</S.DexNumber>
                <S.PokemonName>{poke.name}</S.PokemonName>
                <S.TypesContainer>
                  {poke.types.map((typeInfo) => (
                    <S.Types key={typeInfo.type.name} type={typeInfo.type.name}>
                      {typeInfo.type.name}
                    </S.Types>
                  ))}
                </S.TypesContainer>
              </S.Info>
            </S.Card>
          );
        })}
      </S.Container>
    );
  }
}