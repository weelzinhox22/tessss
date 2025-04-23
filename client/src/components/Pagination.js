import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ active }) => (active ? 'white' : 'rgba(255, 255, 255, 0.8)')};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PageDots = styled.span`
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate range of pages to show
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // If we have 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Somewhere in the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </PageButton>
      
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <PageDots key={`dots-${index}`}>...</PageDots>
        ) : (
          <PageButton
            key={`page-${page}`}
            active={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PageButton>
        )
      ))}
      
      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination; 