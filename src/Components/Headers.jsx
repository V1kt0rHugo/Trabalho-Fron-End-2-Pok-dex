import React from 'react';
import * as S from './Headers.styles.jsx';

//Lista de Tipos para Filtrar
const pokemonTypes = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", 
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
  "dragon", "dark", "steel", "fairy"
];

//Lista de Gerações para Filtrar

const generations = [
  { name: "Generation 1", value: "gen1" },
  { name: "Generation 2", value: "gen2" },
  { name: "Generation 3", value: "gen3" },
  { name: "Generation 4", value: "gen4" },
  { name: "Generation 5", value: "gen5" },
  { name: "Generation 6", value: "gen6" },
  { name: "Generation 7", value: "gen7" },
  { name: "Generation 8", value: "gen8" },
];

export class Header extends React.Component {
  render() {
    /*aqui eu to recebendo Props do componente Pai Pokedex
    Uso "desestruturação" para pegar as props que o pokedex envia */
    const {
      searchQuery, onSearchChange,
      filterType1, onType1Change,
      filterType2, onType2Change,
      filterGen, onGenChange
    } = this.props;

    return (
      <S.HeaderWrapper>
       
        <S.SearchContainer>
          <S.SearchBar
           //Input Controlado pelo pai (Pokedex) atraves de onSearchChange e searchQuery
            type="text"
            placeholder="Pesquisar"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </S.SearchContainer>
        {/* Os Selects abaixo funcionam exatamente da mesma forma. */}
        <S.FilterContainer>
          <S.FilterDropdown value={filterGen} onChange={onGenChange}>
            <option value="">Todas as Gerações</option>
            {generations.map(gen => (
              <option key={gen.value} value={gen.value}>{gen.name}</option>
            ))}
          </S.FilterDropdown>
          
          <S.FilterDropdown value={filterType1} onChange={onType1Change}>
            <option value="">Filtrar por Tipo 1</option>
            {pokemonTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </S.FilterDropdown>

          <S.FilterDropdown value={filterType2} onChange={onType2Change}>
            <option value="">Filtrar por Tipo 2</option>
            {pokemonTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </S.FilterDropdown>
        </S.FilterContainer>
      </S.HeaderWrapper>
    );
  }
}

export default Header;