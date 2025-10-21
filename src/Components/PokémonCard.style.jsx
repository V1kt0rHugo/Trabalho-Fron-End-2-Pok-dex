import styled from 'styled-components';

const typeColors = {
  fire: '#FFA07A',
  grass: '#90EE90',
  electric: '#FFD700',
  water: '#ADD8E6',
  ground: '#E0C068',
  rock: '#B6A136',
  fairy: '#FFC0CB',
  poison: '#C183C1',
  bug: '#A8B820',
  dragon: '#7038F8',
  psychic: '#F85888',
  flying: '#A890F0',
  fighting: '#C03028',
  normal: '#A8A878',
};

// Container principal que vira o grid
export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
`;

// O card individual
export const Card = styled.div`
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

// A imagem
export const Imagem = styled.img`
  width: 120px;
  height: 120px;
`;

// Div para as informações de texto
export const Info = styled.div`
  text-align: center;
  margin-top: 10px;
`;

// O número
export const DexNumber = styled.p`
  color: #666;
  font-weight: bold;
  margin: 5px 0;
`;

// O nome
export const PokemonName = styled.h3`
  margin: 5px 0;
  text-transform: capitalize;
  color: #333;
`;

// Container dos tipos
export const TypesContainer = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;
`;

// A badge de cada tipo
export const Types = styled.span`
  padding: 3px 10px;
  border-radius: 5px;
  color: #333;
  font-size: 0.8rem;
  text-transform: uppercase;
  background-color: ${(props) => typeColors[props.type] || '#A8A878'};
`;