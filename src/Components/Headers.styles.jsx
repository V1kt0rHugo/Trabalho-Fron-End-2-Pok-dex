import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  background-color: #ef4444; 
  padding: 20px 0; 
  border-bottom: 2px solid #dc2626; 
  margin-bottom: 20px;
`;

export const HeaderContent = styled.div`
  max-width: 1200px; 
  margin: 0 auto;     
  padding: 0 20px;   
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
  border: 2px solid #fca5a5;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #dc2626;
  }

  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
    border-color: #ddd;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap; 
`;

export const FilterDropdown = styled.select`
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #fca5a5;
  text-transform: capitalize;
  background-color: white;
  cursor: pointer;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #dc2626;
  }

  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
    border-color: #ddd;
    color: #9ca3af;
  }
`;