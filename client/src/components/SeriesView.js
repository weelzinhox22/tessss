import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistContext';
import Card from './Card';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const SeriesContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SeriesSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.divider};
    margin-left: ${({ theme }) => theme.spacing.md};
  }
`;

const CarouselHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const SeriesCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SeriesImage = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const SeriesInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SeriesTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`;

const SeriesNetwork = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const SeriesDetailContainer = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
  }
`;

const SeriesHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  width: 200px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 150px;
  }
`;

const SeriesInfo2 = styled.div`
  flex: 1;
`;

const SeriesDetailTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const NetworkBadge = styled.div`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
`;

const SeasonTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid ${({ theme }) => theme.colors.divider};
`;

const EpisodesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const EpisodeContainer = styled(motion.div)`
  cursor: pointer;
`;

const SeeMoreCard = styled(motion.div)`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 2/3;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  svg {
    width: 30px;
    height: 30px;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardProgress = styled.div`
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

const SeriesView = () => {
  const { categories, getWatchProgress } = usePlaylists();
  const [selectedSeries, setSelectedSeries] = useState(null);
  const navigate = useNavigate();
  const [expandedSeries, setExpandedSeries] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // If there's no series data, return null
  if (!categories.__series__) return null;
  
  const seriesMap = categories.__series__;
  
  // Extract all the series information
  const allSeries = Object.values(seriesMap);
  
  // Handle series card click
  const handleSeriesClick = (series) => {
    setSelectedSeries(series);
    // Scroll to top when a series is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle episode click
  const handleEpisodeClick = (episode) => {
    navigate(`/play/${encodeURIComponent(episode.url)}`);
  };
  
  // Handle back button click
  const handleBack = () => {
    setSelectedSeries(null);
  };
  
  // Group series by network/channel
  const seriesByNetwork = {};
  allSeries.forEach(series => {
    const network = series.group || 'Other';
    if (!seriesByNetwork[network]) {
      seriesByNetwork[network] = [];
    }
    seriesByNetwork[network].push(series);
  });
  
  // Sort networks alphabetically
  const sortedNetworks = Object.keys(seriesByNetwork).sort();
  
  // Fallback image
  const fallbackImage = 'https://via.placeholder.com/300x450/1E293B/FFFFFF?text=No+Image';
  
  const toggleSeriesExpand = (seriesName) => {
    setExpandedSeries(prev => ({
      ...prev,
      [seriesName]: !prev[seriesName]
    }));
  };
  
  return (
    <SeriesContainer>
      <AnimatePresence mode="wait">
        {selectedSeries ? (
          <SeriesDetailContainer
            key="series-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to all series
            </BackButton>
            
            <SeriesHeader>
              <PosterContainer>
                <img 
                  src={selectedSeries.logo || fallbackImage} 
                  alt={selectedSeries.title}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
              </PosterContainer>
              
              <SeriesInfo2>
                <SeriesDetailTitle>{selectedSeries.title}</SeriesDetailTitle>
                <NetworkBadge>{selectedSeries.group}</NetworkBadge>
              </SeriesInfo2>
            </SeriesHeader>
            
            {Object.keys(selectedSeries.seasons)
              .sort((a, b) => Number(a) - Number(b))
              .map(season => (
                <div key={season}>
                  <SeasonTitle>Season {season}</SeasonTitle>
                  <EpisodesList>
                    {selectedSeries.seasons[season].map((episode, index) => {
                      const progress = getWatchProgress(episode.url);
                      return (
                        <EpisodeContainer 
                          key={`${episode.url}-${index}`}
                          onClick={() => handleEpisodeClick(episode)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card item={episode} aspectRatio="16/9" />
                        </EpisodeContainer>
                      );
                    })}
                  </EpisodesList>
                </div>
              ))}
          </SeriesDetailContainer>
        ) : (
          <motion.div
            key="series-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedNetworks.map(network => {
              const series = seriesByNetwork[network];
              const isExpanded = expandedSeries[network] || false;
              const displaySeries = isExpanded ? series : series.slice(0, 10);
              
              return (
                <SeriesSection key={network}>
                  <CarouselHeader>
                    <SectionTitle>{network}</SectionTitle>
                    {series.length > 10 && (
                      <ViewAllButton onClick={() => toggleSeriesExpand(network)}>
                        {isExpanded ? 'Mostrar menos' : 'Ver todos'}
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        )}
                      </ViewAllButton>
                    )}
                  </CarouselHeader>
                  
                  {isMounted && (
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={16}
                      slidesPerView="auto"
                      navigation
                      style={{ padding: '0 4px 16px 4px' }}
                    >
                      {displaySeries.map(series => {
                        // Find the most recent progress in this series
                        const anyProgress = series.episodes?.some(episode => getWatchProgress(episode.url) > 0);
                        
                        return (
                          <SwiperSlide 
                            key={series.id || series.title}
                            style={{ width: '200px', height: 'auto' }}
                          >
                            <SeriesCard
                              whileHover={{ y: -5 }}
                              onClick={() => handleSeriesClick(series)}
                            >
                              <SeriesImage>
                                <img 
                                  src={series.poster || series.logo || (series.episodes && series.episodes[0] && series.episodes[0].attributes && series.episodes[0].attributes.logo) || fallbackImage}
                                  alt={series.title}
                                  onError={(e) => { e.target.src = fallbackImage }}
                                />
                                {anyProgress && (
                                  <Badge>Assistindo</Badge>
                                )}
                              </SeriesImage>
                              <SeriesInfo>
                                <SeriesTitle>{series.title}</SeriesTitle>
                                <SeriesNetwork>
                                  {series.episodes ? 
                                    `${series.episodes.length} episódios` : 
                                    (series.seasons ? `${Object.values(series.seasons).flat().length} episódios` : 'Série')}
                                </SeriesNetwork>
                              </SeriesInfo>
                            </SeriesCard>
                          </SwiperSlide>
                        );
                      })}
                      
                      {!isExpanded && series.length > 10 && (
                        <SwiperSlide style={{ width: '200px', height: 'auto' }}>
                          <SeeMoreCard
                            onClick={() => toggleSeriesExpand(network)}
                            whileHover={{ y: -5 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            <span>Ver mais</span>
                          </SeeMoreCard>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  )}
                </SeriesSection>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </SeriesContainer>
  );
};

export default SeriesView; 