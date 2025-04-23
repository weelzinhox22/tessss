import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import Badge from './Badge';

const HighlightContainer = styled.div`
  position: relative;
  width: 100%;
  height: 550px;
  margin-bottom: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  @media (max-width: 768px) {
    height: 450px;
  }
`;

const HighlightBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${({ bgImage }) => bgImage});
  background-size: cover;
  background-position: center center;
  transition: transform 0.3s ease;
  
  ${HighlightContainer}:hover & {
    transform: scale(1.05);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
`;

const HighlightContent = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  z-index: 1;

  @media (max-width: 768px) {
    width: 100%;
    padding: 2rem;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 30%, transparent 100%);
    justify-content: flex-end;
  }
`;

const HighlightType = styled.div`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.accent || theme.colors.primary};
  color: white;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  margin-bottom: 1rem;
`;

const HighlightTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HighlightDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  max-width: 90%;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

const HighlightInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.7rem;
  }
`;

const HighlightBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const HighlightButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.7rem;
  }
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover || '#4338ca'};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }
`;

const getHighlightType = (item) => {
  if (!item.group) return null;
  
  const group = item.group.toLowerCase();
  if (group.includes('filme')) return 'Filme';
  if (group.includes('serie')) return 'Série';
  if (group.includes('canal') || group.includes('tv')) return 'Canal';
  
  return null;
};

const Highlight = ({ item, onWatchClick, onInfoClick }) => {
  if (!item) return null;
  
  const handleWatchClick = () => {
    if (onWatchClick) onWatchClick(item);
  };
  
  const handleInfoClick = () => {
    if (onInfoClick) onInfoClick(item);
  };
  
  // Get content type from group
  const contentType = getHighlightType(item);
  
  return (
    <HighlightContainer>
      <HighlightBackground bgImage={item.backdrop_url || item.poster_url} />
      <HighlightContent>
        {contentType && <HighlightType>{contentType}</HighlightType>}
        
        <HighlightTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {item.title || item.name}
        </HighlightTitle>
        
        <HighlightInfo>
          {item.year && <span>{item.year}</span>}
          {item.duration && <span>• {item.duration}</span>}
          {item.rating && <span>• {item.rating}</span>}
          {item.group && <span>• {item.group}</span>}
        </HighlightInfo>
        
        <HighlightBadges>
          {item.quality && <Badge type={item.quality} />}
          {item.audio && <Badge type={item.audio} />}
          {item.isNew && <Badge type="NEW" />}
        </HighlightBadges>
        
        <HighlightDescription>
          {item.description || 'Descrição não disponível'}
        </HighlightDescription>
        
        <HighlightButtons>
          <PrimaryButton
            onClick={handleWatchClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay /> Assistir
          </PrimaryButton>
          <SecondaryButton
            onClick={handleInfoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInfoCircle /> Detalhes
          </SecondaryButton>
        </HighlightButtons>
      </HighlightContent>
    </HighlightContainer>
  );
};

export default Highlight; 