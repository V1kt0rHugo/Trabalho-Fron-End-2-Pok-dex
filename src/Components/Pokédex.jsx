import React from 'react';
import axios from 'axios';
import PokemonCard from './PokémonCard.jsx'
import PokemonDetails from './PokémonDetails.jsx'
import Header from './Headers.jsx'
import * as S from './PokémonCard.style.jsx';
//Dizendo quais pokemons estao presentes em cada geracao com min e max


class Pokedex extends React.Component {
    //Estados de Pokedex
  state = {
    pokemon: [],
    isLoading: true,
    selectedPokemon: null,
    searchQuery: "", 
    filterType1: "",
    filterType2: "",
  };
  componentDidMount() {
    this.getPokemons();
  }

  getPokemons = async () => {
    try {
        //Descrição mais detalhada dessa parte pois foi uma parte dificil de entender
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      //response.data: Esta é a propriedade do objeto axios que contém o corpo 
      // (body) da resposta do servidor, já em formato de objeto JavaScript.
      //.results: Esta é uma chave específica que a PokéAPI usa no endpoint 
      // /pokemon. A resposta da API não é apenas a lista, mas sim um objeto 
      // maior ({ count: ..., next: ..., results: [...] }). 
      // Esta expressão acessa o array que está dentro da chave results
      //listaSimplesPokemon e um array de objetos simples que possui 905 objetos
      //com nome e uma string url
      const listaSimplesDePokemon = response.data.results;
      const dadosPokemonDetalhados = [];
      //Cria um Loop (for... of) que pass por cada um dos 905 
      // itens de listaSimplesDePokemon
      // a cada volta do loop a variavel pokemon recebera o valor do item atual
      //Na 1ª volta: pokemon = { name: 'bulbasaur', url: '.../1/' }
      //Na 2ª volta: pokemon = { name: 'ivysaur', url: '.../2/' }
      //...e assim por diante.
      for (const pokemon of listaSimplesDePokemon) {
        //axios.get(...): Faz a chamada de rede para a URL de detalhes.
        //apos a resposta respostaDetalhada recebe a resposta completa
        //do axios com data status etc nessa variavel
        const respostaDetalhada = await axios.get(pokemon.url);
        //respostaDetalhada.data: Acessa o objeto de resposta do 
        // axios e pega o corpo (body) dos dados. Este é o objeto completo 
        // do Pokémon (com id, name, sprites, types, stats, etc.).
        //.push coloca a resposta completa no nosso array criado pra armazenar
        //justamente isso
        dadosPokemonDetalhados.push(respostaDetalhada.data);
      }
      //o estado pokemon agora e atualizado recebendo as informacoes detalhadas
      //obtidas anteriormente em dadosPokemonDetalhados
      this.setState({
        pokemon: dadosPokemonDetalhados,
        //retira a tela de carregamento
        isLoading: false,
      });

      //tratamento de erro
    } catch (error) {
      console.error("Erro ao buscar Pokémon", error);
      this.setState({ isLoading: false });
    }
  };

  //funcoes de callback que sao passadas para os filhos

  //PokemonCard chama essa funcao quando clicado
  handleCardClick = (pokemonData) => {
    this.setState({ selectedPokemon: pokemonData });
  };
  //PokemonDetails chama essa funcao para se fechar
  handleCloseDetails = () => {
    this.setState({ selectedPokemon: null });
  };
  //Headers chama essas 4 funcoes para atualizar os filtros
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleType1Change = (event) => {
    this.setState({ filterType1: event.target.value });
  };
  
  handleType2Change = (event) => {
    this.setState({ filterType2: event.target.value });
  };

  render() {
    // Desestruturação
    const { pokemon, isLoading, selectedPokemon, searchQuery, filterType1, filterType2 } = this.state;
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
        />

        <S.Container>
            {/* 
            se a condicao for verdadeira (tamanho de filteredPokemon > 0)
            executa o bloco de código abaixo que percorre a lista de 
            filtered pokemon e redenriza um pokemonCard para cada pokemon
            */}
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
            //retorna um FeedBack para o usuário caso for falso
            <S.NotFoundMessage>
              Nenhum Pokémon encontrado.
            </S.NotFoundMessage>
          )}
        </S.Container>
          {/*
          se selectedPokemon nao for nulo o componente PokemonDetails sera 
          renderizado
          */}
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