import React from 'react';
import * as S from './Headers.styles.jsx';

//Lista de Tipos para Filtrar
const pokemonTypes = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", 
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
  "dragon", "dark", "steel", "fairy"
];

export class Header extends React.Component {
  render() {
    /*aqui eu to recebendo Props do componente Pai Pokedex
    Uso "desestruturação" para pegar as props que o pokedex envia */
    const {
      searchQuery, onSearchChange,
      filterType1, onType1Change,
      filterType2, onType2Change,
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