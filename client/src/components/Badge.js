import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'HD':
        return theme.colors.info;
      case 'FHD':
        return '#2563eb';
      case '4K':
        return '#7c3aed';
      case 'DUB':
        return theme.colors.success;
      case 'LEG':
        return theme.colors.warning;
      case 'NEW':
        return theme.colors.accent || '#f97316';
      case 'LIVE':
        return theme.colors.error;
      case 'EXCLUSIVE':
        return '#eab308';
      default:
        return theme.colors.secondary;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

const Badge = ({ type }) => {
  return (
    <BadgeContainer type={type}>
      {type}
    </BadgeContainer>
  );
};

export default Badge; 