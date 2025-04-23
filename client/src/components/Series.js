import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SeriesContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    background-color: #555;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin: 0;
  color: #fff;
`;

const SeasonSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
`;

const SeasonButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#007bff' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#555'};
  }
`;

const EpisodeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EpisodeCard = styled(Link)`
  display: block;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const EpisodeThumbnail = styled.div`
  height: 160px;
  background-color: #333;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EpisodeInfo = styled.div`
  padding: 15px;
`;

const EpisodeTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 5px 0;
`;

const EpisodeNumber = styled.p`
  color: #aaa;
  font-size: 0.9rem;
  margin: 0;
`;

const Series = ({ playlist }) => {
  const { series, season } = useParams();
  const navigate = useNavigate();
  
  if (!playlist || !playlist.categories || !playlist.categories.__series__) {
    return (
      <SeriesContainer>
        <Header>
          <BackButton onClick={() => navigate('/')}>←</BackButton>
          <Title>Nenhuma série encontrada</Title>
        </Header>
      </SeriesContainer>
    );
  }
  
  // Get series data
  const seriesData = playlist.categories.__series__;
  const currentSeriesKey = series === 'all' 
    ? Object.keys(seriesData)[0] 
    : Object.keys(seriesData).find(key => key.includes(series));
  
  if (!currentSeriesKey) {
    return (
      <SeriesContainer>
        <Header>
          <BackButton onClick={() => navigate('/')}>←</BackButton>
          <Title>Série não encontrada</Title>
        </Header>
      </SeriesContainer>
    );
  }
  
  const seriesInfo = seriesData[currentSeriesKey];
  const seasons = Object.keys(seriesInfo.seasons).sort((a, b) => parseInt(a) - parseInt(b));
  const currentSeason = season ? parseInt(season) : parseInt(seasons[0]);
  const episodes = seriesInfo.seasons[currentSeason] || [];
  
  return (
    <SeriesContainer>
      <Header>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <Title>{seriesInfo.title}</Title>
      </Header>
      
      <SeasonSelector>
        {seasons.map(s => (
          <SeasonButton 
            key={s}
            active={parseInt(s) === currentSeason}
            onClick={() => navigate(`/series/${series}/${s}`)}
          >
            Temporada {s}
          </SeasonButton>
        ))}
      </SeasonSelector>
      
      <EpisodeGrid>
        {episodes.map((episode, index) => {
          // Find the episode's index in the allItems array for playback
          const episodeIndex = playlist.allItems.findIndex(
            item => item.url === episode.url
          );
          
          return (
            <EpisodeCard key={index} to={`/watch/${episodeIndex}`}>
              <EpisodeThumbnail image={episode.attributes.logo}>
                {!episode.attributes.logo && `E${episode.episodeNumber}`}
              </EpisodeThumbnail>
              <EpisodeInfo>
                <EpisodeTitle>{episode.title}</EpisodeTitle>
                <EpisodeNumber>Episódio {episode.episodeNumber}</EpisodeNumber>
              </EpisodeInfo>
            </EpisodeCard>
          );
        })}
      </EpisodeGrid>
    </SeriesContainer>
  );
};

export default Series; 