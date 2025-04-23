import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Card from './Card';

const SectionContainer = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const SeeAllLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  transition: ${({ theme }) => theme.transition.fast};
  
  &:hover {
    text-decoration: underline;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  })
};

const CategorySection = ({ title, items = [], onViewAll, aspectRatio }) => {
  if (!items.length) return null;
  
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {onViewAll && <SeeAllLink onClick={onViewAll}>View All</SeeAllLink>}
      </SectionHeader>
      
      <ItemsGrid>
        {items.slice(0, 10).map((item, index) => (
          <motion.div
            key={item.url + index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <Card 
              item={item} 
              aspectRatio={aspectRatio || (title.includes('Series') ? '2/3' : '16/9')}
              linkTo={`/play/${encodeURIComponent(item.url)}`}
            />
          </motion.div>
        ))}
      </ItemsGrid>
    </SectionContainer>
  );
};

export default CategorySection; 