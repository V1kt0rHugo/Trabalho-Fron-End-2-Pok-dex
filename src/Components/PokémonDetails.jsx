import React from 'react';
import axios from 'axios';
import * as S from './PokémonDetails.styles.jsx';

//Vamos lá explica o componente mais complexo e que mais 
// eu perdi a cabeça para fazer

class PokémonDetails extends React.Component {
    //Seus estados
  state = {
    speciesData: null, // guarda dados da especie(descricao cor etc...)
    evolutionData: [], //guarda dados da linha evolutiva
    extraForms: [], /*guarda formas extras como Mega,Gmax ou formas 
                   regionais entre outros */
    pokedexDescription: "", //descricao da pokedex
    isLoading: true,
    error: null,
  };
  //componente de ciclo de vida que roda a funcao abaixo assim que montado
  componentDidMount() {
    this.fetchAdditionalData();
  }

  //funcao que busca os dados faltantes
  fetchAdditionalData = async () => {
    /*
    'this.props.pokemon' são os dados que o Pokedex (Pai) já tinha 
     (stats, types, etc.) const { pokemon } = this.props; 
     */
    const { pokemon } = this.props;

    try {
        //Usamos a URL da especie que o pokedex ja nos deu
        //essa chamada nos da descricao,cor,evolucao e formas extras
      const speciesResponse = await axios.get(pokemon.species.url);
      const speciesData = speciesResponse.data;

      // filtra o array gigante 'flavor_text_entries' 
      // para achar a primeira em ingles.
      //Sim eu preferi pegar a versao e ingles que a linguagem padrao dos jogos


      const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      // Limpa o texto (remove quebras de linha '\n' e '\f')
      const description = englishEntry ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ') : "No Pokédex description available.";

      const extraFormPromises = speciesData.varieties
      // pega a lista de 'varieties' (variacoes) da especie.
      // filtra para pegar so as que NAO sao padrao
        .filter(v => !v.is_default && v.pokemon.name !== pokemon.name) //tira a forma padrao    
        .map(v => axios.get(v.pokemon.url)); //cria uma Promise de busca para cada forma extra
      
      const extraFormResponses = await Promise.all(extraFormPromises); // Espera todas as buscas terminarem
      const extraForms = extraFormResponses.map(res => ({
        name: res.data.name,
        imageUrl: res.data.sprites.front_default, // Pega o sprite de cada forma
      }));

      const evolutionChainUrl = speciesData.evolution_chain.url;
      const evolutionResponse = await axios.get(evolutionChainUrl);
      // Chama nossa função auxiliar para processar a resposta da evolução
      const evolutionChain = await this.parseEvolutionChain(evolutionResponse.data.chain);
      // Agora que buscamos tudo, salvamos no 'state' deste componente.
      this.setState({
        speciesData: speciesData,
        pokedexDescription: description,
        extraForms: extraForms,
        evolutionData: evolutionChain,
        isLoading: false, // Desliga o "Carregando..." interno
      });

    } catch (err) {
      console.error("Erro ao buscar detalhes adicionais:", err);
      this.setState({ error: "Não foi possível carregar todos os detalhes.", isLoading: false });
    }
  };
  // Função auxiliar para "desmontar" a resposta da API de evolução
  parseEvolutionChain = async (chain) => {
    const evoChain = [];
    let currentEvo = chain;
    // Loop 'do...while' que "caminha" pela cadeia de evolução
    do {
      const speciesName = currentEvo.species.name;
      // Para cada Pokémon na evolução (ex: Charmander), busca seus dados...
      const pokeResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
      //...só para pegar a imagem (sprite) dele.

      const imageUrl = pokeResponse.data.sprites.other['official-artwork'].front_default;

      evoChain.push({
        name: speciesName,
        imageUrl: imageUrl
      });
      // Pula para o próximo elo da cadeia (ex: Charmeleon)
      currentEvo = currentEvo.evolves_to[0];
    } while (currentEvo); // Repete até 'evolves_to' ser nulo

    return evoChain;
  };
  // Função auxiliar para formatar o EV Yield (ex: "2 Sp. Atk")
  getEvYield = () => {
    return this.props.pokemon.stats
      .filter(stat => stat.effort > 0)// Acha o stat com 'effort' > 0
      .map(stat => `${stat.effort} ${stat.stat.name}`) // Formata o texto
      .join(', ');
  };

  render() {
    // 'pokemon' (com stats, types, etc.) e 'onClose' (a função) vêm do 
    // Pokedex.jsx
    const { pokemon, onClose } = this.props;

    const { isLoading, speciesData, evolutionData, extraForms, pokedexDescription, error } = this.state;

    return (
        // O 'ModalOverlay' (fundo escuro) chama a função 'onClose' d
        // o Pai ao ser clicado
      <S.ModalOverlay onClick={onClose}>
        {/* O 'DetailsContainer' (modal) impede o clique de "vazar" para o fundo */}
        <S.DetailsContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose}>&times;</S.CloseButton>

          {/*
            Estes dados vêm do 'Pokedex.jsx' e aparecem na hora,
            mesmo antes do loading interno terminar.
          */}
          
          <h1>{pokemon.name}</h1>
          <S.PokemonNumber>#{String(pokemon.id).padStart(3, '0')}</S.PokemonNumber>
          <S.MainImage src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />

          {isLoading ? (
            <p>Carregando mais detalhes...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
                {extraForms.length > 0 && (
                    <S.InfoSection>
                    <S.SectionTitle>Other Forms</S.SectionTitle>
                    <S.OtherFormsContainer>
                        {extraForms.map((form) => (
                        <div key={form.name}>
                            <img src={form.imageUrl} alt={form.name} />
                            <p>{form.name.replace(pokemon.name + '-', '')}</p>
                        </div>
                        ))}
                    </S.OtherFormsContainer>
                    </S.InfoSection>
                )}

              <S.InfoSection>
                 <S.SectionTitle>Types</S.SectionTitle>
                 <S.TypesContainer>
                   {pokemon.types.map((typeInfo) => (
                     <S.TypeBadge key={typeInfo.type.name} type={typeInfo.type.name}>
                       {typeInfo.type.name}
                     </S.TypeBadge>
                   ))}
                 </S.TypesContainer>
              </S.InfoSection>
              
              <S.InfoSection>
                <S.SectionTitle>Pokédex Entry</S.SectionTitle>
                <S.PokedexDescription>{pokedexDescription}</S.PokedexDescription>
              </S.InfoSection>

              <S.StatsAndBiologyGrid>
                <S.InfoSection>
                  <S.SectionTitle>Stats</S.SectionTitle>
                  <S.StatsList>
                    {pokemon.stats.map(statInfo => (
                      <li key={statInfo.stat.name}><span>{statInfo.stat.name}</span> <strong>{statInfo.base_stat}</strong></li>
                    ))}
                  </S.StatsList>
                </S.InfoSection>
                
                <S.InfoSection>
                  <S.SectionTitle>Biology</S.SectionTitle>
                  <S.BioGrid>
                    <p>Height:</p> <p><strong>{pokemon.height / 10} m</strong></p>
                    <p>Weight:</p> <p><strong>{pokemon.weight / 10} kg</strong></p>
                    <p>Abilities:</p> <p><strong>{pokemon.abilities.map(a => a.is_hidden ? `${a.ability.name} (H)` : a.ability.name).join(', ')}</strong></p>
                    <p>Pokédex Color:</p> <p><strong>{speciesData.color.name}</strong></p>
                    <p>Base Friendship:</p> <p><strong>{speciesData.base_happiness}</strong></p>
                    <p>Capture Rate:</p> <p><strong>{speciesData.capture_rate}</strong></p>
                    <p>Egg Groups:</p> <p><strong>{speciesData.egg_groups.map(g => g.name).join(', ')}</strong></p>
                    <p>EV Yield:</p> <p><strong>{this.getEvYield()}</strong></p>
                  </S.BioGrid>
                </S.InfoSection>
              </S.StatsAndBiologyGrid>

              <S.InfoSection>
                <S.SectionTitle>Evolution Chain</S.SectionTitle>
                <S.EvolutionContainer>
                  {evolutionData.map((evo, index) => (
                    <React.Fragment key={evo.name}>
                      <div>
                        <img src={evo.imageUrl} alt={evo.name} />
                        <p>{evo.name}</p>
                      </div>
                      {index < evolutionData.length - 1 && <S.EvoArrow>&rarr;</S.EvoArrow>}
                    </React.Fragment>
                  ))}
                </S.EvolutionContainer>
              </S.InfoSection>
            </>
          )}
        </S.DetailsContainer>
      </S.ModalOverlay>
    );
  }
}

export default PokémonDetails;