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

const ContentRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CategoryTitle = styled.h2`
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

const ChannelsPage = () => {
  const { isLoading, categories } = usePlaylists();
  const navigate = useNavigate();
  
  const tvChannels = Object.entries(categories)
    .filter(([name]) => 
      !name.includes('Filmes') && 
      !name.toLowerCase().includes('filme') && 
      name !== '__series__')
    .sort(([a], [b]) => a.localeCompare(b));
  
  const hasChannels = tvChannels.length > 0;
  
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
        <h3>Carregando canais...</h3>
      </LoadingOverlay>
    );
  }
  
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Canais</PageTitle>
        
        {!hasChannels ? (
          <NoContentMessage>
            <h3>Nenhum canal encontrado</h3>
            <p>Os canais serão exibidos aqui quando disponíveis.</p>
          </NoContentMessage>
        ) : (
          tvChannels.map(([category, items]) => (
            <ContentRow key={category}>
              <CategoryTitle>{category}</CategoryTitle>
              <CardGrid>
                {items.map((item, index) => (
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
                    </CardImage>
                    <CardTitle>{item.title}</CardTitle>
                  </Card>
                ))}
              </CardGrid>
            </ContentRow>
          ))
        )}
      </PageContainer>
    </Layout>
  );
};

export default ChannelsPage; 