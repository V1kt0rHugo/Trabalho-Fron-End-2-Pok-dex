import styled from 'styled-components';

const typeColors = {
  fire: '#FFA07A', grass: '#90EE90', electric: '#FFD700', water: '#ADD8E6',
  ground: '#E0C068', rock: '#B6A136', fairy: '#FFC0CB', poison: '#C183C1',
  bug: '#A8B820', dragon: '#7038F8', psychic: '#F85888', flying: '#A890F0',
  fighting: '#C03028', normal: '#A8A878',
};

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const DetailsContainer = styled.div`
  background: white;
  padding: 1rem 2rem 2rem 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 700px;
  text-align: center;
  position: relative;
  text-transform: capitalize;
  max-height: 90vh;
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  line-height: 1;

  &:hover {
    color: #000;
  }
`;

export const MainImage = styled.img`
  width: 200px;
  height: 200px;
  margin-top: -50px;
`;

export const PokemonNumber = styled.h2`
  color: #888;
  font-weight: bold;
  margin-top: -10px;
`;

export const TypesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export const TypeBadge = styled.span`
  padding: 5px 15px;
  border-radius: 5px;
  color: #333;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${(props) => typeColors[props.type] || '#A8A878'};
`;

export const StatsAndBiologyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoSection = styled.div`
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  text-align: left;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

export const StatsList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: left;

  li {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 10px;
    padding: 5px 0;
    font-size: 0.9rem;
  }
`;

export const BioGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 15px;
  text-align: left;
  font-size: 0.9rem;

  p {
    margin: 0;
  }
`;

export const PokedexDescription = styled.p`
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.4;
  text-transform: none;
`;

export const EvolutionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-align: center;

  img {
    width: 96px;
    height: 96px;
  }
`;

export const EvoArrow = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: #ccc;
`;

export const OtherFormsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  text-align: center;

  img {
    width: 72px;
    height: 72px;
    background-color: #eee;
    border-radius: 50%;
  }

  p {
    font-size: 0.8rem;
    margin: 5px 0 0 0;
    text-transform: capitalize;
  }
`;