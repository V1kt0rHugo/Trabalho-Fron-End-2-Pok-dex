import React from 'react';
import * as S from './PokémonCard.style.jsx';

export class PokemonCard extends React.Component {
  render() {
    //recebe seus estados de pokedex ele nao tem estados proprios
    const { pokemonData, onCardClick } = this.props;

  //se por algum motivo nao tiver dados nao rendenriza
  // um exemplo que eles estao adicionando os pokemons da gen 9 ainda
  //alguns nao tem dados completos e por sinal e por isso que o projeto
  //so vai ate a gen 8
    if (!pokemonData) return null;

    return (
      <S.Card onClick={onCardClick}>
        {/* Mostra a imagem, usando a URL vinda das props */}
        <S.Imagem
          src={pokemonData.sprites.front_default}
          alt={pokemonData.name}
        />
        <S.Info>
          {/*
          Retorna o numero da dex formatado para ter 3 numeros exemplo:
          Charmander numero : 004
          */}
          <S.DexNumber>#{String(pokemonData.id).padStart(3, '0')}</S.DexNumber>
          <S.PokemonName>{pokemonData.name}</S.PokemonName>
          <S.TypesContainer>
            {pokemonData.types.map((typeInfo) => (
              //Passamos o nome do tipo (ex: "fire") como uma prop 'type'.
              // O styled-component usa essa prop para saber qual cor de fundo usar.
              <S.Types key={typeInfo.type.name} type={typeInfo.type.name}>
                {typeInfo.type.name}
              </S.Types>
            ))}
          </S.TypesContainer>
        </S.Info>
      </S.Card>
    );
  }
}

export default PokemonCard;
