export const theme = {
  colors: {
    background: '#0a0c14', // Darker background for better contrast
    surface: '#171b26', // Darker surface for cards
    primary: '#4f46e5', // Indigo for primary elements
    primaryHover: '#4338ca', // Darker indigo for hover states
    secondary: '#10b981', // Green for badges and highlights
    secondaryHover: '#059669', // Darker green for hover states
    accent: '#f97316', // Orange as accent color for highlights
    text: '#ffffff', // White text
    textSecondary: '#94a3b8', // Light gray for secondary text
    divider: '#2d3748', // Dark divider
    error: '#ef4444', // Red for errors
    success: '#22c55e', // Green for success states
    warning: '#f59e0b', // Amber for warnings
    info: '#0ea5e9', // Light blue for info
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    large: '0 8px 16px rgba(0, 0, 0, 0.5)',
    glow: '0 0 15px rgba(79, 70, 229, 0.5)', // Glow effect for highlighted elements
  },
  transition: {
    fast: 'all 0.2s ease',
    medium: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Bounce effect
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
}; 