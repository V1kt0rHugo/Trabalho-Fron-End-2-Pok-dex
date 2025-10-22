
import React from 'react';
import axios from 'axios';
import PokemonCard from './PokémonCard.jsx'
import PokemonDetails from './PokémonDetails.jsx'
import Header from './Headers.jsx'
import * as S from './PokémonCard.style.jsx'; 

const generationFilters = {
  "gen1": { min: 1, max: 151 },
  "gen2": { min: 152, max: 251 },
  "gen3": { min: 252, max: 386 },
  "gen4": { min: 387, max: 493 },
  "gen5": { min: 494, max: 649 },
  "gen6": { min: 650, max: 721 },
  "gen7": { min: 722, max: 809 },
  "gen8": { min: 810, max: 905 },
};

export class Pokedex extends React.Component {
  state = {
    pokemon: [],
    isLoading: true,
    selectedPokemon: null,
    searchQuery: "", 
    filterType1: "",
    filterType2: "",
    filterGen: "",
  };

  componentDidMount() {
    this.getPokemons();
  }

  getPokemons = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=905');
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

  handleCardClick = (pokemonData) => {
    this.setState({ selectedPokemon: pokemonData });
  };

  handleCloseDetails = () => {
    this.setState({ selectedPokemon: null });
  };

 // Funções que são passadas ao Headers: Pesquisa e Filtros
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleType1Change = (event) => {
    this.setState({ filterType1: event.target.value });
  };
  
  handleType2Change = (event) => {
    this.setState({ filterType2: event.target.value });
  };
  
  handleGenChange = (event) => {
    this.setState({ filterGen: event.target.value });
  };

  render() {
    // Desestruturação
    const { pokemon, isLoading, selectedPokemon, searchQuery, filterType1, filterType2, filterGen } = this.state;
    //Verifico se isLoading e true e escrevo uma mensagem para o usuario saber que a pagina esta carregando
    if (isLoading) {
      return <h1>Carregando Pokédex...</h1>;
    }
    // Já Aviso que a explicacao dessa parte aqui é longa porque eu demorei muito pra entender oque realmente acontece aqui
    const filteredPokemon = pokemon
    //Primeiro Filtro NOME que é basicamente referente ao oque foi digitado na 
    // barra de pesquisa e é comparado ao nome de um pokemon
    .filter(poke => {
    return poke.name.toLowerCase().includes(searchQuery.toLowerCase());
    // ele pega o nome do Pokemon exemplo "Tepig" e tambem o texto que esta na busca exemplo "pig"
    // converte ambos para letras minusculas para que a comparacao nao falhe
    // Se o nome do pokemon conter o texto da busca o pokemon passa para o proximo filtro
      })
      // Pega o resulato do filtro anterior e aplica este
      .filter(poke => {
        //Verifica se o filtro do Tipo 1 está vazio(no caso nenhum filtro 
        // Tipo1 tiver sido escolhido)
        // Se estiver vazio retorna true(aprova) e manda para o proximo filtro
        if (!filterType1) return true;
        return poke.types.some(typeInfo => typeInfo.type.name === filterType1);
        // caso algum filtro (ex : "fire") seja escolhido percorremos o array de tipos 
        //do pokemon se ao menos 1 ('some') deles bater (ex : "["flying", "fire"])
        // com filterType 1 passa para o proximo filtro
      })
      .filter(poke => {
        // A logica é exatamente a mesma que ao filtro anterios so que com a
        // variavel filterType2 ex(deve ter "fire" para passar do primeiro 
        // tipo e "flying" para passar deste)
        if (!filterType2) return true;
        return poke.types.some(typeInfo => typeInfo.type.name === filterType2);
      })//pega os pokemons restantes que sobraram dos filtros anteriores
      .filter(poke => {
        //se este filtro estiver vazio aprova o pokemon
        if (!filterGen) return true;

        //caso contrario (ex: "gen1") ele busca os limites de ID em 
        // (generationFilters)

        const limits = generationFilters[filterGen];
        //retorna 'true apenas se o ID estiver dentro do limite ex:(gen 1
        //1 a 151)
        return poke.id >= limits.min && poke.id <= limits.max;
      });
      //Aciono headers e suas funcoes e estados sao passadas como props
    return (
      <div>
        <Header
          searchQuery={searchQuery}
          onSearchChange={this.handleSearchChange}
          filterType1={filterType1}
          onType1Change={this.handleType1Change}
          filterType2={filterType2}
          onType2Change={this.handleType2Change}
          filterGen={filterGen}
          onGenChange={this.handleGenChange}
        />

        <S.Container>
          {filteredPokemon.length > 0 ? (
            filteredPokemon.map((poke) => {
              return (
                <PokemonCard 
                  key={poke.id} 
                  pokemonData={poke}
                  onCardClick={() => this.handleCardClick(poke)} 
                />
              );
            })
          ) : (
            <S.NotFoundMessage>
              Nenhum Pokémon encontrado.
            </S.NotFoundMessage>
          )}
        </S.Container>

        {selectedPokemon && (
          <PokemonDetails 
            pokemon={selectedPokemon} 
            onClose={this.handleCloseDetails} 
          />
        )}
      </div>
    );
  }
}

export default Pokedex;