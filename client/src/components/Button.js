import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: ${({ theme }) => theme.transition.default};
  gap: 8px;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.primary}dd;
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.secondary}dd;
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          
          &:hover {
            background-color: ${theme.colors.primary}22;
            transform: translateY(-2px);
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          padding: 8px 16px;
          
          &:hover {
            background-color: ${theme.colors.primary}11;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.primary}dd;
            transform: translateY(-2px);
          }
        `;
    }
  }}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 6px 14px;
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: 12px 24px;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 10px 20px;
          font-size: 1rem;
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  icon, 
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </StyledButton>
  );
};

export default Button; 