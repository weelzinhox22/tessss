import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Card from './Card';
import Pagination from './Pagination';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const CategoryGridContainer = styled.div`
  margin-bottom: 3rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ITEMS_PER_PAGE = 30;

const CategoryGrid = ({ title, items, onItemClick }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedItems, setSortedItems] = useState([]);
  
  // Sort and paginate items
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    let sorted = [...items];
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => {
          const yearA = a.year || (a.release ? new Date(a.release).getFullYear() : 0);
          const yearB = b.year || (b.release ? new Date(b.release).getFullYear() : 0);
          return yearB - yearA;
        });
        break;
      case 'oldest':
        sorted.sort((a, b) => {
          const yearA = a.year || (a.release ? new Date(a.release).getFullYear() : 0);
          const yearB = b.year || (b.release ? new Date(b.release).getFullYear() : 0);
          return yearA - yearB;
        });
        break;
      case 'a-z':
        sorted.sort((a, b) => {
          const titleA = (a.title || a.name || '').toLowerCase();
          const titleB = (b.title || b.name || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
        break;
      case 'z-a':
        sorted.sort((a, b) => {
          const titleA = (a.title || a.name || '').toLowerCase();
          const titleB = (b.title || b.name || '').toLowerCase();
          return titleB.localeCompare(titleA);
        });
        break;
      default:
        break;
    }
    
    setSortedItems(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [items, sortBy]);
  
  // Get items for current page
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };
  
  const totalPages = Math.ceil((sortedItems?.length || 0) / ITEMS_PER_PAGE);
  const currentItems = getCurrentItems();
  
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };
  
  if (!items || items.length === 0) {
    return (
      <CategoryGridContainer>
        <CategoryHeader>
          <CategoryTitle>{title}</CategoryTitle>
        </CategoryHeader>
        <NoResults>
          <h3>Nenhum item encontrado</h3>
          <p>Não há itens disponíveis nesta categoria.</p>
        </NoResults>
      </CategoryGridContainer>
    );
  }
  
  return (
    <CategoryGridContainer>
      <CategoryHeader>
        <CategoryTitle>{title}</CategoryTitle>
        <FilterContainer>
          <SortButton 
            active={sortBy === 'newest'} 
            onClick={() => handleSortChange('newest')}
          >
            <FaSortAmountDown /> Mais recentes
          </SortButton>
          <SortButton 
            active={sortBy === 'oldest'} 
            onClick={() => handleSortChange('oldest')}
          >
            <FaSortAmountUp /> Mais antigos
          </SortButton>
          <SortButton 
            active={sortBy === 'a-z'} 
            onClick={() => handleSortChange('a-z')}
          >
            A-Z
          </SortButton>
          <SortButton 
            active={sortBy === 'z-a'} 
            onClick={() => handleSortChange('z-a')}
          >
            Z-A
          </SortButton>
        </FilterContainer>
      </CategoryHeader>
      
      <Grid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentItems.map((item, index) => (
          <Card
            key={`${item.id || item.url}-${index}`}
            item={item}
            onClick={() => onItemClick(item)}
          />
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </CategoryGridContainer>
  );
};

export default CategoryGrid; 