import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Highlight from '../components/Highlight';
import Card from '../components/Card';
import { usePlaylists } from '../context/PlaylistContext';

const HomeContainer = styled(motion.div)`
  width: 100%;
`;

const ContentTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 1rem 0 2rem 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.divider};
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  font-size: 1.1rem;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
    transition: background-color 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NoContentMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Carrossel principal
const CarouselContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  position: relative;
  height: 450px;
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    width: 100%;
    height: 100%;
  }
  
  .swiper-pagination-bullet {
    background-color: white;
    opacity: 0.5;
  }
  
  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 1;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 24px 16px;
    border-radius: 50%;
    transform: scale(0.7);
    
    &:after {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 250px;
    
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
  }
`;

const CarouselSlide = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-image: ${({ image }) => image ? `url(${image})` : 'none'};
  background-size: cover;
  background-position: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  }
`;

const SlideContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  color: white;
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const SlideTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const SlideDescription = styled.p`
  font-size: 1rem;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const SlideButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.5);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Carrossel horizontal
const HorizontalCarousel = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  
  .swiper {
    padding: 0 ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  }
  
  .swiper-slide {
    width: 200px;
    height: auto;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 150px;
    }
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-50%) scale(0.7);
    
    &:after {
      font-size: 1.5rem;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Home = () => {
  const { 
    isLoading, 
    categories, 
    fetchPlaylist,
    playlistUrl,
    getWatchProgress,
    getInProgressItems,
    getFavoriteItems,
    allItems
  } = usePlaylists();
  
  const [activeTab, setActiveTab] = useState('inicio');
  const [carouselItems, setCarouselItems] = useState([]);
  const [continueWatchingItems, setContinueWatchingItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [featuredItem, setFeaturedItem] = useState(null);
  const navigate = useNavigate();
  
  // Organize categories by their group titles
  const movieCategories = Object.entries(categories)
    .filter(([name]) => 
      name.includes('Filmes') || 
      name.toLowerCase().includes('filme')
    )
    .sort(([a], [b]) => a.localeCompare(b));
  
  const tvChannels = Object.entries(categories)
    .filter(([name]) => 
      name.includes('Canais') || 
      name.toLowerCase().includes('canal') ||
      name.toLowerCase().includes('tv')
    )
    .sort(([a], [b]) => a.localeCompare(b));
  
  const seriesCategories = Object.entries(categories)
    .filter(([name]) => 
      name.includes('Séries') || 
      name.toLowerCase().includes('serie') ||
      name === '__series__'
    )
    .sort(([a], [b]) => a.localeCompare(b));
  
  const hasContent = Object.keys(categories).length > 0;
  const hasMovies = movieCategories.length > 0;
  const hasSeries = seriesCategories.length > 0;
  const hasChannels = tvChannels.length > 0;
  const hasContinueWatching = continueWatchingItems.length > 0;
  const hasFavorites = favoriteItems.length > 0;
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Garante que a playlist seja carregada quando a página é aberta
  useEffect(() => {
    const loadPlaylist = async () => {
      // Se não tiver conteúdo e não estiver carregando, carrega a playlist
      if (Object.keys(categories).length === 0 && !isLoading) {
        try {
          // Usa URL padrão caso não exista
          const url = playlistUrl || 'https://is.gd/angeexx';
          console.log("Home: Carregando playlist", url);
          await fetchPlaylist(url);
        } catch (err) {
          console.error("Erro ao carregar playlist na Home:", err);
        }
      }
    };
    
    loadPlaylist();
  }, [categories, fetchPlaylist, isLoading, playlistUrl]);
  
  // Prepara os itens para os carrosséis
  useEffect(() => {
    if (allItems.length > 0) {
      // Seleciona itens para o carrossel principal (melhores filmes e séries)
      const potentialCarouselItems = allItems.filter(item => 
        item.attributes?.logo && // Tem imagem
        (item.isSeries || (item.group && (
          item.group.includes('Filmes') || 
          item.group.toLowerCase().includes('filme')
        )))
      );
      
      // Pega no máximo 5 itens aleatórios para o carrossel
      const shuffled = [...potentialCarouselItems].sort(() => 0.5 - Math.random());
      setCarouselItems(shuffled.slice(0, 5));
      
      // Itens de "Continue assistindo"
      const inProgress = getInProgressItems();
      setContinueWatchingItems(inProgress);
      
      // Itens favoritos
      const favorites = getFavoriteItems();
      setFavoriteItems(favorites);
    }
  }, [allItems, getInProgressItems, getFavoriteItems]);
  
  useEffect(() => {
    const getFeaturedItem = () => {
      if (allItems.length > 0) {
        // Filter items by their group-title to get proper categorization
        const movieItems = allItems.filter(item => 
          item.group && (
            item.group.includes('Filmes') || 
            item.group.toLowerCase().includes('filme')
          )
        );
        
        const seriesItems = allItems.filter(item => 
          item.group && (
            item.group.includes('Séries') || 
            item.group.toLowerCase().includes('serie')
          )
        );
        
        // Combine movies and series for selection
        const highlightCandidates = [...movieItems, ...seriesItems]
          .filter(item => item.poster_url || item.poster || item.attributes?.logo); // Must have an image
        
        if (highlightCandidates.length > 0) {
          // Select a completely random item each time
          const randomIndex = Math.floor(Math.random() * highlightCandidates.length);
          const featured = highlightCandidates[randomIndex];
          
          // Keep description if it exists, otherwise use a placeholder
          featured.description = featured.description || 
            "Um título emocionante da nossa playlist. Clique em assistir para começar a reproduzir.";
          
          // Use group info to determine the type
          featured.type = featured.group || '';
          
          // Use existing values or fallbacks
          featured.year = featured.year || new Date().getFullYear();
          featured.duration = featured.duration || `${Math.floor(Math.random() * 60) + 90} min`;
          featured.rating = featured.rating || `${(Math.random() * 2 + 7).toFixed(1)}/10`;
          featured.quality = featured.quality || "HD";
          featured.audio = featured.audio || "DUB";
          featured.poster_url = featured.poster || featured.attributes?.logo || "https://via.placeholder.com/1200x600/1E293B/FFFFFF?text=Sem+Imagem";
          
          setFeaturedItem(featured);
        }
      }
    };
    
    if (isMounted && hasContent) {
      // Call the function to select a random highlight
      getFeaturedItem();
      
      // Set up an interval to change the highlight every 30 seconds
      const highlightInterval = setInterval(getFeaturedItem, 30000);
      
      return () => clearInterval(highlightInterval);
    }
  }, [isMounted, hasContent, allItems]);
  
  const handleCardClick = (item) => {
    navigate(`/play/${encodeURIComponent(item.url)}`);
  };
  
  const handleSearchResult = (item) => {
    navigate(`/play/${encodeURIComponent(item.url)}`);
  };

  // Gera uma sinopse fictícia com base no título
  const generateShortDescription = (title) => {
    if (!title) return '';
    
    // Extrai o nome da série ou filme
    let mainTitle = title;
    const episodeMatch = title.match(/^(.*?)\s+[ST]\d+E\d+$/i);
    if (episodeMatch) {
      mainTitle = episodeMatch[1].trim();
    }
    
    const descriptions = [
      `Descubra ${mainTitle} e embarque em uma aventura incrível.`,
      `${mainTitle}: Uma história fascinante cheia de emoção e suspense.`,
      `Prepare-se para uma experiência inesquecível com ${mainTitle}.`,
      `Entre no universo de ${mainTitle} e surpreenda-se.`
    ];
    
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
  };
  
  if (isLoading) {
    return (
      <LoadingOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Spinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <h3>Carregando sua playlist...</h3>
      </LoadingOverlay>
    );
  }
  
  return (
    <Layout>
      <HomeContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!hasContent && (
          <NoContentMessage>
            <h3>Bem-vindo ao StreamPlay</h3>
            <p>Sua playlist será carregada automaticamente.</p>
          </NoContentMessage>
        )}
        
        {hasContent && (
          <>
            <SearchBar onResultClick={handleSearchResult} />
            
            {/* Featured Highlight */}
            {featuredItem && (
              <Highlight 
                item={featuredItem}
                onWatchClick={handleCardClick}
                onInfoClick={() => console.log('Detalhes:', featuredItem)}
              />
            )}
            
            <ContentTabs>
              <Tab 
                active={activeTab === 'inicio'} 
                onClick={() => setActiveTab('inicio')}
              >
                Início
              </Tab>
              {hasSeries && (
                <Tab 
                  active={false} 
                  onClick={() => navigate('/series')}
                >
                  Séries
                </Tab>
              )}
              {hasMovies && (
                <Tab 
                  active={false} 
                  onClick={() => navigate('/movies')}
                >
                  Filmes
                </Tab>
              )}
              {hasChannels && (
                <Tab 
                  active={false} 
                  onClick={() => navigate('/channels')}
                >
                  Canais
                </Tab>
              )}
              {hasFavorites && (
                <Tab
                  active={false}
                  onClick={() => navigate('/favorites')}
                >
                  Favoritos
                </Tab>
              )}
            </ContentTabs>
            
            {/* Carousel banner */}
            {carouselItems.length > 0 && (
              <CarouselContainer>
                {isMounted && (
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                  >
                    {carouselItems.map((item, index) => (
                      <SwiperSlide key={`carousel-${item.url}-${index}`}>
                        <CarouselSlide image={item.attributes?.logo}>
                          <SlideContent>
                            <SlideTitle>{item.title}</SlideTitle>
                            <SlideDescription>
                              {generateShortDescription(item.title)}
                            </SlideDescription>
                            <SlideButton onClick={() => handleCardClick(item)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                              </svg>
                              Assistir agora
                            </SlideButton>
                          </SlideContent>
                        </CarouselSlide>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </CarouselContainer>
            )}
            
            {/* Continue Watching */}
            {hasContinueWatching && (
              <HorizontalCarousel>
                <SectionHeader>
                  <SectionTitle>Continue Assistindo</SectionTitle>
                </SectionHeader>
                {isMounted && (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    navigation
                  >
                    {continueWatchingItems.map((item, index) => {
                      const progress = getWatchProgress(item.url);
                      item.progress = progress; // Add progress to item
                      
                      // Add year and duration randomly for demo
                      item.year = item.year || new Date().getFullYear();
                      item.duration = item.duration || Math.floor(Math.random() * 60) + 90;
                      
                      return (
                        <SwiperSlide key={`continue-${item.url}-${index}`} style={{ width: '200px', height: 'auto' }}>
                          <Card
                            item={item}
                            onClick={() => handleCardClick(item)}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </HorizontalCarousel>
            )}
            
            {/* Featured Movies Section */}
            {hasMovies && (
              <HorizontalCarousel>
                <SectionHeader>
                  <SectionTitle>Filmes em Destaque</SectionTitle>
                  <ViewAllButton onClick={() => navigate('/movies')}>
                    Ver todos
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </ViewAllButton>
                </SectionHeader>

                {isMounted && (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    navigation
                  >
                    {movieCategories.slice(0, 2).flatMap(([_, items]) => 
                      items.slice(0, 5).map((item, index) => {
                        const progress = getWatchProgress(item.url);
                        item.progress = progress; // Add progress to item for Card component
                        
                        // Add year and duration randomly for demo
                        item.year = item.year || new Date().getFullYear();
                        item.duration = item.duration || Math.floor(Math.random() * 60) + 90;
                        
                        return (
                          <SwiperSlide key={`featured-${item.url}-${index}`} style={{ width: '200px', height: 'auto' }}>
                            <Card 
                              item={item}
                              onClick={() => handleCardClick(item)}
                            />
                          </SwiperSlide>
                        );
                      })
                    )}
                  </Swiper>
                )}
              </HorizontalCarousel>
            )}
            
            {/* Series Section */}
            {hasSeries && (
              <HorizontalCarousel>
                <SectionHeader>
                  <SectionTitle>Séries em Destaque</SectionTitle>
                  <ViewAllButton onClick={() => navigate('/series')}>
                    Ver todas
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </ViewAllButton>
                </SectionHeader>

                {isMounted && seriesCategories && (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    navigation
                  >
                    {seriesCategories.slice(0, 8).map(([_, series], index) => {
                      // Add random properties for demo
                      series.progress = Math.random() > 0.7 ? Math.random() * 0.8 : 0;
                      series.year = series.year || Math.floor(Math.random() * 5) + 2020;
                      
                      return (
                        <SwiperSlide key={`series-${series.id || index}`} style={{ width: '200px', height: 'auto' }}>
                          <Card 
                            item={series}
                            onClick={() => navigate('/series')}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}
              </HorizontalCarousel>
            )}
            
            {/* Channels Section */}
            {hasChannels && (
              <HorizontalCarousel>
                <SectionHeader>
                  <SectionTitle>Canais ao Vivo</SectionTitle>
                  <ViewAllButton onClick={() => navigate('/channels')}>
                    Ver todos
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </ViewAllButton>
                </SectionHeader>

                {isMounted && (
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView="auto"
                    navigation
                  >
                    {tvChannels.slice(0, 2).flatMap(([_, items]) => 
                      items.slice(0, 8).map((item, index) => {
                        item.isLive = true;
                        
                        return (
                          <SwiperSlide key={`channel-${item.url}-${index}`} style={{ width: '200px', height: 'auto' }}>
                            <Card 
                              item={item}
                              onClick={() => handleCardClick(item)}
                              aspectRatio="16/9"
                              showProgress={false}
                            />
                          </SwiperSlide>
                        );
                      })
                    )}
                  </Swiper>
                )}
              </HorizontalCarousel>
            )}
          </>
        )}
      </HomeContainer>
    </Layout>
  );
};

export default Home; 