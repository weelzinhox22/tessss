import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MediaPlayer from '../components/MediaPlayer';
import Button from '../components/Button';
import { usePlaylists } from '../context/PlaylistContext';

const PlayerPageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
`;

const BackButtonContainer = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const VideoTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const VideoInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const VideoMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MetadataSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  width: 180px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 120px;
  }
`;

const DetailsContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Synopsis = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: 1.1rem;
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  background-color: ${({ theme, primary, active }) => 
    active ? theme.colors.primary : 
    primary ? `${theme.colors.primary}88` : theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme, primary, active }) => 
      active ? theme.colors.primary : 
      primary ? theme.colors.primary : `${theme.colors.background}dd`};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const IMDBRating = styled.div`
  background-color: #f5c518;
  color: #000;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.error}22;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const PlayerContainer = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Sidebar = styled.div`
  width: 350px;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const NextEpisodesContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const NextEpisodesTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const EpisodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.divider};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const EpisodeItem = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ active, theme }) => active ? `${theme.colors.primary}22` : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme, active }) => active ? `${theme.colors.primary}33` : `${theme.colors.primary}11`};
  }
`;

const EpisodeThumb = styled.div`
  width: 120px;
  height: 68px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  flex-shrink: 0;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EpisodeProgress = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${progress * 100}%`};
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EpisodeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
`;

const EpisodeTitle = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EpisodeNumber = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const getEpisodeData = (item) => {
  // Check if it's a series and try to extract season/episode numbers
  if (item.isSeries) {
    return {
      seriesName: item.seriesName,
      seasonNumber: item.seasonNumber,
      episodeNumber: item.episodeNumber
    };
  }
  
  // Try to extract from title if not already parsed
  const match = item.title.match(/^(.*?)\s+S(\d+)E(\d+)$/i);
  if (match) {
    return {
      seriesName: match[1].trim(),
      seasonNumber: parseInt(match[2], 10),
      episodeNumber: parseInt(match[3], 10)
    };
  }
  
  return null;
};

const findSiblingEpisodes = (currentItem, categories, limit = 10) => {
  if (!currentItem) return [];
  
  const episodeData = getEpisodeData(currentItem);
  if (!episodeData) return [];
  
  // Check if we have series data
  if (!categories.__series__) return [];
  
  // Find the series
  const seriesMap = categories.__series__;
  const seriesKey = Object.keys(seriesMap).find(key => 
    seriesMap[key].title === episodeData.seriesName || 
    key.includes(episodeData.seriesName)
  );
  
  if (!seriesKey || !seriesMap[seriesKey]) return [];
  
  const series = seriesMap[seriesKey];
  const { seasonNumber } = episodeData;
  
  // Get episodes from the same season
  const episodes = series.seasons[seasonNumber] || [];
  
  // Sort by episode number
  const sortedEpisodes = [...episodes].sort((a, b) => {
    const aData = getEpisodeData(a);
    const bData = getEpisodeData(b);
    return aData.episodeNumber - bData.episodeNumber;
  });
  
  return sortedEpisodes;
};

// Gera dados fictícios para sinopses e avaliações baseados no título
const generateSynopsis = (title) => {
  if (!title) return '';
  
  // Extrai o nome da série ou filme para gerar uma sinopse fictícia
  let mainTitle = title;
  const episodeMatch = title.match(/^(.*?)\s+S\d+E\d+$/i);
  if (episodeMatch) {
    mainTitle = episodeMatch[1].trim();
  }
  
  // Sinopses comuns para diferentes gêneros
  const synopses = [
    `Em ${mainTitle}, acompanhamos uma jornada emocionante cheia de reviravoltas e desenvolvimento de personagens. A trama se desenrola em um cenário intrigante, que captura a imaginação e mantém o público envolvido do início ao fim.`,
    `${mainTitle} explora temas de amizade, traição e redenção, em uma narrativa complexa que desafia expectativas. Os personagens são bem desenvolvidos e a direção é impecável.`,
    `Uma história cativante sobre superação e crescimento pessoal. ${mainTitle} nos leva por uma jornada emocionante, com uma cinematografia deslumbrante e atuações memoráveis.`,
    `Nesta produção aclamada pela crítica, ${mainTitle} combina ação e drama de forma equilibrada, mantendo o espectador na ponta da cadeira. Um verdadeiro exemplo de storytelling moderno.`
  ];
  
  // Escolhe uma sinopse aleatória
  const randomIndex = Math.floor(Math.random() * synopses.length);
  return synopses[randomIndex];
};

// Gera uma avaliação IMDB fictícia
const generateIMDBRating = (title) => {
  if (!title) return null;
  
  // Usa os caracteres do título para criar um número pseudo-aleatório entre 6.0 e 9.5
  let sum = 0;
  for (let i = 0; i < title.length; i++) {
    sum += title.charCodeAt(i);
  }
  
  const rating = 6.0 + (sum % 10) / 3.0;
  return rating.toFixed(1);
};

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getItemByUrl, 
    getWatchProgress, 
    updateWatchProgress,
    categories,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    markWatchedUpTo
  } = usePlaylists();
  
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [nextEpisodes, setNextEpisodes] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [synopsis, setSynopsis] = useState('');
  const [imdbRating, setImdbRating] = useState(null);

  useEffect(() => {
    try {
      const videoUrl = decodeURIComponent(id);
      const item = getItemByUrl(videoUrl);
      
      if (!item) {
        setError('Vídeo não encontrado. Por favor, tente outro vídeo ou recarregue a playlist.');
        return;
      }
      
      setCurrentItem(item);
      setProgress(getWatchProgress(videoUrl));
      
      // Verifica se o item está nos favoritos
      setIsFavorited(isFavorite(videoUrl));
      
      // Gera sinopse e avaliação fictícias
      setSynopsis(generateSynopsis(item.title));
      setImdbRating(generateIMDBRating(item.title));
      
      // Find sibling episodes
      const siblingEpisodes = findSiblingEpisodes(item, categories);
      setNextEpisodes(siblingEpisodes);
    } catch (err) {
      setError('Falha ao carregar vídeo: ' + err.message);
    }
  }, [id, getItemByUrl, getWatchProgress, categories, isFavorite]);

  const handleProgress = (newProgress) => {
    setProgress(newProgress);
    updateWatchProgress(decodeURIComponent(id), newProgress);
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleEpisodeClick = (episode) => {
    navigate(`/play/${encodeURIComponent(episode.url)}`);
  };
  
  const handleEnded = () => {
    // Mark as watched
    markWatchedUpTo(decodeURIComponent(id));
    
    // Find the next episode
    if (nextEpisodes.length > 0) {
      const currentEpisodeData = getEpisodeData(currentItem);
      if (!currentEpisodeData) return;
      
      const nextEpisode = nextEpisodes.find(ep => {
        const epData = getEpisodeData(ep);
        return (
          epData && 
          epData.episodeNumber > currentEpisodeData.episodeNumber &&
          epData.seasonNumber === currentEpisodeData.seasonNumber
        );
      });
      
      if (nextEpisode) {
        // Auto-play next episode
        setTimeout(() => {
          navigate(`/play/${encodeURIComponent(nextEpisode.url)}`);
        }, 3000);
      }
    }
  };
  
  const toggleFavorite = () => {
    const videoUrl = decodeURIComponent(id);
    if (isFavorited) {
      removeFromFavorites(videoUrl);
    } else {
      addToFavorites(videoUrl);
    }
    setIsFavorited(!isFavorited);
  };
  
  const markAsWatched = () => {
    markWatchedUpTo(decodeURIComponent(id));
  };
  
  // Check if current item is part of a series
  const isSeriesEpisode = currentItem && getEpisodeData(currentItem) !== null;
  
  // Get formatted episode info
  const getEpisodeLabel = (item) => {
    const data = getEpisodeData(item);
    if (!data) return '';
    return `T${String(data.seasonNumber).padStart(2, '0')}E${String(data.episodeNumber).padStart(2, '0')}`;
  };
  
  const fallbackImage = 'https://via.placeholder.com/300x450/1E293B/FFFFFF?text=Sem+Imagem';
  
  if (error) {
    return (
      <Layout>
        <PlayerPageContainer>
          <BackButtonContainer>
            <BackButton variant="outline" onClick={handleBack}>
              ← Voltar à Playlist
            </BackButton>
            <ErrorMessage>{error}</ErrorMessage>
          </BackButtonContainer>
        </PlayerPageContainer>
      </Layout>
    );
  }
  
  if (!currentItem) {
    return (
      <Layout>
        <PlayerPageContainer>
          <BackButtonContainer>
            <BackButton variant="outline" onClick={handleBack}>
              ← Voltar à Playlist
            </BackButton>
            <LoadingContainer>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  border: '3px solid transparent',
                  borderTopColor: '#7E22CE'
                }}
              />
            </LoadingContainer>
          </BackButtonContainer>
        </PlayerPageContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PlayerPageContainer>
        <BackButtonContainer>
          <BackButton variant="outline" onClick={handleBack}>
            ← Voltar à Playlist
          </BackButton>
        </BackButtonContainer>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlayerContainer>
            <MediaPlayer
              url={currentItem.url}
              title={currentItem.title}
              onProgress={handleProgress}
              initialProgress={progress}
              onEnded={handleEnded}
            />
          </PlayerContainer>
          
          <ContentContainer>
            <MainContent>
              <VideoInfo>
                <VideoTitle>{currentItem.title}</VideoTitle>
                
                <VideoMeta>
                  {currentItem.group && <Tag>{currentItem.group}</Tag>}
                  {isSeriesEpisode && <Tag>{getEpisodeLabel(currentItem)}</Tag>}
                  {progress > 0 && progress < 0.95 && (
                    <Tag>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {Math.round(progress * 100)}% assistido
                    </Tag>
                  )}
                  {progress >= 0.95 && (
                    <Tag>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Assistido
                    </Tag>
                  )}
                </VideoMeta>
                
                <MetadataSection>
                  <PosterContainer>
                    <img 
                      src={currentItem.attributes?.logo || fallbackImage} 
                      alt={currentItem.title}
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                  </PosterContainer>
                  
                  <DetailsContainer>
                    {imdbRating && (
                      <RatingContainer>
                        <IMDBRating>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          {imdbRating}/10 IMDb
                        </IMDBRating>
                      </RatingContainer>
                    )}
                    
                    <ActionButtons>
                      <ActionButton 
                        active={isFavorited} 
                        onClick={toggleFavorite}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {isFavorited ? 'Favorito' : 'Adicionar aos favoritos'}
                      </ActionButton>
                      
                      <ActionButton onClick={markAsWatched}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Marcar como assistido
                      </ActionButton>
                    </ActionButtons>
                    
                    <Synopsis>
                      <h3>Sinopse</h3>
                      <p>{synopsis}</p>
                    </Synopsis>
                  </DetailsContainer>
                </MetadataSection>
              </VideoInfo>
            </MainContent>
            
            {isSeriesEpisode && nextEpisodes.length > 0 && (
              <Sidebar>
                <NextEpisodesContainer>
                  <NextEpisodesTitle>Episódios</NextEpisodesTitle>
                  <EpisodesList>
                    {nextEpisodes.map((episode, index) => {
                      const isCurrentEpisode = episode.url === currentItem.url;
                      const episodeProgress = getWatchProgress(episode.url);
                      
                      return (
                        <EpisodeItem 
                          key={`${episode.url}-${index}`}
                          active={isCurrentEpisode}
                          onClick={() => !isCurrentEpisode && handleEpisodeClick(episode)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <EpisodeThumb>
                            <img 
                              src={episode.attributes?.logo || fallbackImage} 
                              alt={episode.title}
                              onError={(e) => {
                                e.target.src = fallbackImage;
                              }}
                            />
                            {episodeProgress > 0 && (
                              <EpisodeProgress progress={episodeProgress} />
                            )}
                          </EpisodeThumb>
                          <EpisodeInfo>
                            <EpisodeTitle>{episode.title}</EpisodeTitle>
                            <EpisodeNumber>{getEpisodeLabel(episode)}</EpisodeNumber>
                          </EpisodeInfo>
                        </EpisodeItem>
                      );
                    })}
                  </EpisodesList>
                </NextEpisodesContainer>
              </Sidebar>
            )}
          </ContentContainer>
        </motion.div>
      </PlayerPageContainer>
    </Layout>
  );
};

export default Player; 