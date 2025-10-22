// src/Components/Header.styles.jsx

import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  background-color: #f7f7f7;
  padding: 20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

export const SearchBar = styled.input`
  width: 50%;
  max-width: 400px;
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ddd;

  &:focus {
    outline: none;
    border-color: #3b4cca;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap; /* Permite que os filtros quebrem a linha em telas pequenas */
`;

export const FilterDropdown = styled.select`
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ddd;
  text-transform: capitalize;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b4cca;
  }
`;