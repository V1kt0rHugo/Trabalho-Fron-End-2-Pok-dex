import React from 'react';
import axios from 'axios';
import * as S from './PokémonDetails.styles.jsx';

class PokémonDetails extends React.Component {
  state = {
    speciesData: null,
    evolutionData: [],
    extraForms: [],
    pokedexDescription: "",
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchAdditionalData();
  }

  fetchAdditionalData = async () => {
    const { pokemon } = this.props;

    try {
      const speciesResponse = await axios.get(pokemon.species.url);
      const speciesData = speciesResponse.data;

      const englishEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      const description = englishEntry ? englishEntry.flavor_text.replace(/[\n\f]/g, ' ') : "No Pokédex description available.";

      const extraFormPromises = speciesData.varieties
        .filter(v => !v.is_default && v.pokemon.name !== pokemon.name)
        .map(v => axios.get(v.pokemon.url));
      
      const extraFormResponses = await Promise.all(extraFormPromises);
      const extraForms = extraFormResponses.map(res => ({
        name: res.data.name,
        imageUrl: res.data.sprites.front_default,
      }));

      const evolutionChainUrl = speciesData.evolution_chain.url;
      const evolutionResponse = await axios.get(evolutionChainUrl);
      const evolutionChain = await this.parseEvolutionChain(evolutionResponse.data.chain);
      
      this.setState({
        speciesData: speciesData,
        pokedexDescription: description,
        extraForms: extraForms,
        evolutionData: evolutionChain,
        isLoading: false,
      });

    } catch (err) {
      console.error("Erro ao buscar detalhes adicionais:", err);
      this.setState({ error: "Não foi possível carregar todos os detalhes.", isLoading: false });
    }
  };
  
  parseEvolutionChain = async (chain) => {
    const evoChain = [];
    let currentEvo = chain;

    do {
      const speciesName = currentEvo.species.name;
      const pokeResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
      evoChain.push({
        name: speciesName,
        imageUrl: pokeResponse.data.sprites.front_default,
      });
      currentEvo = currentEvo.evolves_to[0];
    } while (currentEvo);

    return evoChain;
  };

  getEvYield = () => {
    return this.props.pokemon.stats
      .filter(stat => stat.effort > 0)
      .map(stat => `${stat.effort} ${stat.stat.name}`)
      .join(', ');
  };

  render() {
    const { pokemon, onClose } = this.props;
    const { isLoading, speciesData, evolutionData, extraForms, pokedexDescription, error } = this.state;

    return (
      <S.ModalOverlay onClick={onClose}>
        <S.DetailsContainer onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose}>&times;</S.CloseButton>
          
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