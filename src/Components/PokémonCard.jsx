import React from 'react';
import * as S from './PokémonCard.style.jsx';

export class PokemonCard extends React.Component {
  render() {
    const { pokemonData } = this.props;

    if (!pokemonData) return null;

    return (
      <S.Card>
        <S.Imagem
          src={pokemonData.sprites.front_default}
          alt={pokemonData.name}
        />
        <S.Info>
          <S.DexNumber>#{String(pokemonData.id).padStart(3, '0')}</S.DexNumber>
          <S.PokemonName>{pokemonData.name}</S.PokemonName>
          <S.TypesContainer>
            {pokemonData.types.map((typeInfo) => (
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