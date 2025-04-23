import React, { useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaylists } from '../context/PlaylistContext';

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: 45px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: ${({ theme }) => theme.transition.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
`;

const SearchResultItem = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}11;
  }
  
  .title {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .meta {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchBar = ({ onResultClick }) => {
  const { searchQuery, setSearchQuery, searchResults } = usePlaylists();
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  
  const handleClear = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);
  
  const handleResultClick = useCallback((item) => {
    if (onResultClick) {
      onResultClick(item);
    }
    setSearchQuery('');
    setShowResults(false);
  }, [onResultClick, setSearchQuery]);
  
  // Fecha os resultados quando clica fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mostra resultados quando tem query
  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);
  
  // Formata o texto para temporada e episódio
  const formatSeriesInfo = useCallback((item) => {
    if (!item.isSeries) return item.group || '';
    
    return `${item.seriesName} • Temporada ${item.seasonNumber} • Episódio ${item.episodeNumber}`;
  }, []);
  
  return (
    <SearchContainer ref={containerRef}>
      <SearchIcon>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </SearchIcon>
      
      <SearchInput
        type="text"
        placeholder="Pesquisar filmes, séries ou categorias..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 0 && setShowResults(true)}
      />
      
      <ClearButton show={searchQuery.length > 0} onClick={handleClear}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </ClearButton>
      
      <AnimatePresence>
        {showResults && searchQuery.length > 0 && (
          <SearchResults
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {searchResults.length > 0 ? (
              searchResults.slice(0, 10).map((item, index) => (
                <SearchResultItem
                  key={`${item.url}-${index}`}
                  onClick={() => handleResultClick(item)}
                  whileHover={{ x: 5 }}
                >
                  <div className="title">{item.title}</div>
                  <div className="meta">
                    {formatSeriesInfo(item)}
                  </div>
                </SearchResultItem>
              ))
            ) : (
              <NoResults>Nenhum resultado encontrado</NoResults>
            )}
          </SearchResults>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
};

export default SearchBar; 