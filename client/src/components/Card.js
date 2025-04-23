import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistContext';
import Badge from './Badge';

const CardContainer = styled(motion.div)`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const CardImageContainer = styled.div`
  width: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio || '2/3'};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    pointer-events: none;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.08);
  }
`;

const CardTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const BadgesContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs};
  left: ${({ theme }) => theme.spacing.xs};
  z-index: 2;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  max-width: 90%;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3;
  
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

const QualityBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs};
  right: ${({ theme }) => theme.spacing.xs};
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  z-index: 2;
`;

const Card = ({ item, onClick, aspectRatio, showProgress = true }) => {
  const { getWatchProgress } = usePlaylists();
  const progress = item?.url ? getWatchProgress(item.url) : 0;
  
  if (!item) return null;
  
  // Determinar badges com base no item
  const getBadges = () => {
    const badges = [];
    
    if (item.isNew || Date.now() - new Date(item.releaseDate || item.year).getTime() < 7776000000) {
      badges.push({ type: 'NEW', text: 'NEW' });
    }
    
    if (item.audio === 'DUB' || item.isDubbed) {
      badges.push({ type: 'DUB', text: 'DUB' });
    } else if (item.audio === 'LEG' || item.isSubtitled) {
      badges.push({ type: 'LEG', text: 'LEG' });
    }
    
    if (item.isExclusive) {
      badges.push({ type: 'EXCLUSIVE', text: 'EXCLUSIVE' });
    }
    
    if (item.isLive) {
      badges.push({ type: 'LIVE', text: 'LIVE' });
    }
    
    return badges;
  };
  
  // Extrair informações de duração e ano
  const getYear = () => {
    if (item.year) return item.year;
    if (item.release) return new Date(item.release).getFullYear();
    return ''; // Vazio se não houver ano
  };
  
  const getDuration = () => {
    if (item.duration) return `${item.duration}`;
    if (item.runtime) return `${item.runtime}min`;
    return ''; // Vazio se não houver duração
  };
  
  const getQuality = () => {
    if (item.quality === 'HD' || item.isHD) return 'HD';
    if (item.quality === 'FHD' || item.isFHD) return 'FHD';
    if (item.quality === '4K' || item.is4K) return '4K';
    return item.quality || 'HD';
  };
  
  const badges = getBadges();
  const year = getYear();
  const duration = getDuration();
  const quality = getQuality();
  
  return (
    <CardContainer 
      onClick={onClick} 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardImageContainer aspectRatio={aspectRatio}>
        <CardImage 
          src={item.poster_url || item.poster || item.attributes?.logo || "https://via.placeholder.com/300x450/1E293B/FFFFFF?text=Sem+Imagem"} 
          alt={item.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450/1E293B/FFFFFF?text=Sem+Imagem";
          }}
        />
        {showProgress && progress > 0 && (
          <ProgressBar progress={progress} />
        )}
        <BadgesContainer>
          {badges.map((badge, index) => (
            <Badge key={index} type={badge.type} />
          ))}
        </BadgesContainer>
        <QualityBadge>{quality}</QualityBadge>
        <CardTitle>{item.title || item.name}</CardTitle>
      </CardImageContainer>
      {(year || duration) && (
        <CardInfo>
          {year && <span>{year}</span>}
          {duration && <span>{duration}</span>}
        </CardInfo>
      )}
    </CardContainer>
  );
};

export default Card; 