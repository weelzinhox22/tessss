import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import SeriesView from '../components/SeriesView';
import { usePlaylists } from '../context/PlaylistContext';

const PageContainer = styled.div`
  width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
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

const SeriesPage = () => {
  const { isLoading, categories } = usePlaylists();
  
  const hasSeries = categories.__series__ && Object.keys(categories.__series__).length > 0;
  
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
        <h3>Carregando séries...</h3>
      </LoadingOverlay>
    );
  }
  
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Séries</PageTitle>
        
        {!hasSeries ? (
          <NoContentMessage>
            <h3>Nenhuma série encontrada</h3>
            <p>As séries serão exibidas aqui quando disponíveis.</p>
          </NoContentMessage>
        ) : (
          <SeriesView />
        )}
      </PageContainer>
    </Layout>
  );
};

export default SeriesPage; 