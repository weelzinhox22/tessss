import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { usePlaylists } from '../context/PlaylistContext';

const PageContainer = styled.div`
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const Card = styled(motion.div)`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 2/3;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardTitle = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const FavoritesPage = () => {
  const { isLoading, getWatchProgress, getFavoriteItems } = usePlaylists();
  const navigate = useNavigate();
  
  const favoriteItems = getFavoriteItems();
  const hasFavorites = favoriteItems.length > 0;
  
  const handleCardClick = (item) => {
    navigate(`/play/${encodeURIComponent(item.url)}`);
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
        <h3>Carregando favoritos...</h3>
      </LoadingOverlay>
    );
  }
  
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Favoritos</PageTitle>
        
        {!hasFavorites ? (
          <NoContentMessage>
            <h3>Nenhum favorito encontrado</h3>
            <p>Adicione itens aos favoritos para que apareçam aqui.</p>
          </NoContentMessage>
        ) : (
          <CardGrid>
            {favoriteItems.map((item, index) => {
              const progress = getWatchProgress(item.url);
              return (
                <Card 
                  key={`${item.url}-${index}`}
                  onClick={() => handleCardClick(item)}
                  whileHover={{ y: -5 }}
                >
                  <CardImage>
                    <img 
                      src={item.attributes?.logo || item.poster || item.logo || "https://via.placeholder.com/300x450/1E293B/FFFFFF?text=Sem+Imagem"} 
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x450/1E293B/FFFFFF?text=Sem+Imagem";
                      }}
                    />
                    {progress > 0 && (
                      <CardProgress progress={progress} />
                    )}
                  </CardImage>
                  <CardTitle>{item.title}</CardTitle>
                </Card>
              );
            })}
          </CardGrid>
        )}
      </PageContainer>
    </Layout>
  );
};

export default FavoritesPage; 