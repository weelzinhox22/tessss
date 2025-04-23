import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../components/Layout';
import CategoryGrid from '../components/CategoryGrid';
import { usePlaylists } from '../context/PlaylistContext';
import { motion } from 'framer-motion';

const MoviesContainer = styled(motion.div)`
  width: 100%;
  padding: 1rem 0;
`;

const CategoriesNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const CategoryTab = styled.button`
  background: none;
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
    transition: background-color 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NoContentMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Categorias de filmes
const MOVIE_CATEGORIES = {
  all: 'Todos os Filmes',
  action: 'Ação',
  adventure: 'Aventura',
  animation: 'Animação',
  comedy: 'Comédia',
  crime: 'Crime',
  documentary: 'Documentário',
  drama: 'Drama',
  family: 'Família',
  fantasy: 'Fantasia',
  horror: 'Terror',
  mystery: 'Mistério',
  romance: 'Romance',
  scifi: 'Ficção Científica',
  thriller: 'Suspense'
};

const MoviesPage = () => {
  const { categories, allItems, isLoading } = usePlaylists();
  const [activeCategory, setActiveCategory] = useState('all');
  const [categorizedMovies, setCategorizedMovies] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && allItems.length > 0) {
      // Get all movies using group-title
      const allMovies = allItems.filter(item => 
        item.group && (
          item.group.includes('Filmes') || 
          item.group.toLowerCase().includes('filme')
        )
      );
      
      // Categorize movies properly - use group information
      const categorized = {
        all: allMovies,
      };
      
      // Find category by title matching
      categorized.action = allMovies.filter(movie => 
        movie.group?.includes('Ação') || 
        movie.group?.toLowerCase().includes('acao') ||
        movie.title?.toLowerCase().includes('ação') ||
        movie.title?.toLowerCase().includes('acao'));
        
      categorized.adventure = allMovies.filter(movie => 
        movie.group?.includes('Aventura') || 
        movie.title?.toLowerCase().includes('aventura'));
        
      categorized.animation = allMovies.filter(movie => 
        movie.group?.includes('Animação') ||
        movie.group?.toLowerCase().includes('animacao') || 
        movie.title?.toLowerCase().includes('animação') ||
        movie.title?.toLowerCase().includes('animacao'));
        
      categorized.comedy = allMovies.filter(movie => 
        movie.group?.includes('Comédia') ||
        movie.group?.toLowerCase().includes('comedia') || 
        movie.title?.toLowerCase().includes('comédia') ||
        movie.title?.toLowerCase().includes('comedia'));
        
      categorized.crime = allMovies.filter(movie => 
        movie.group?.includes('Crime') || 
        movie.title?.toLowerCase().includes('crime'));
        
      categorized.documentary = allMovies.filter(movie => 
        movie.group?.includes('Documentário') ||
        movie.group?.toLowerCase().includes('documentario') || 
        movie.title?.toLowerCase().includes('documentário') ||
        movie.title?.toLowerCase().includes('documentario'));
        
      categorized.drama = allMovies.filter(movie => 
        movie.group?.includes('Drama') || 
        movie.title?.toLowerCase().includes('drama'));
        
      categorized.family = allMovies.filter(movie => 
        movie.group?.includes('Família') || 
        movie.group?.toLowerCase().includes('familia') ||
        movie.title?.toLowerCase().includes('família') ||
        movie.title?.toLowerCase().includes('familia'));
        
      categorized.fantasy = allMovies.filter(movie => 
        movie.group?.includes('Fantasia') || 
        movie.title?.toLowerCase().includes('fantasia'));
        
      categorized.horror = allMovies.filter(movie => 
        movie.group?.includes('Terror') ||
        movie.group?.toLowerCase().includes('horror') || 
        movie.title?.toLowerCase().includes('terror') ||
        movie.title?.toLowerCase().includes('horror'));
        
      categorized.mystery = allMovies.filter(movie => 
        movie.group?.includes('Mistério') ||
        movie.group?.toLowerCase().includes('misterio') || 
        movie.title?.toLowerCase().includes('mistério') ||
        movie.title?.toLowerCase().includes('misterio'));
        
      categorized.romance = allMovies.filter(movie => 
        movie.group?.includes('Romance') || 
        movie.title?.toLowerCase().includes('romance'));
        
      categorized.scifi = allMovies.filter(movie => 
        movie.group?.includes('Ficção') ||
        movie.group?.toLowerCase().includes('ficcao') || 
        movie.title?.toLowerCase().includes('ficção') ||
        movie.title?.toLowerCase().includes('ficcao'));
        
      categorized.thriller = allMovies.filter(movie => 
        movie.group?.includes('Suspense') || 
        movie.title?.toLowerCase().includes('suspense'));
      
      // Find which categories actually have content to display
      const categories = Object.entries(categorized)
        .filter(([_, items]) => items.length > 0)
        .map(([key]) => key);
      
      setAvailableCategories(categories);
      setCategorizedMovies(categorized);
    }
  }, [allItems, isLoading]);
  
  const handleMovieClick = (movie) => {
    navigate(`/play/${encodeURIComponent(movie.url)}`);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingMessage>Carregando filmes...</LoadingMessage>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <MoviesContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {Object.keys(categorizedMovies).length === 0 ? (
          <NoContentMessage>
            <h3>Nenhum filme encontrado</h3>
            <p>Não há filmes disponíveis na playlist atual.</p>
          </NoContentMessage>
        ) : (
          <>
            <CategoriesNav>
              {availableCategories.map(key => (
                <CategoryTab
                  key={key}
                  active={activeCategory === key}
                  onClick={() => setActiveCategory(key)}
                >
                  {MOVIE_CATEGORIES[key]}
                </CategoryTab>
              ))}
            </CategoriesNav>
            
            <CategoryGrid
              title={MOVIE_CATEGORIES[activeCategory]}
              items={categorizedMovies[activeCategory] || []}
              onItemClick={handleMovieClick}
            />
          </>
        )}
      </MoviesContainer>
    </Layout>
  );
};

export default MoviesPage; 