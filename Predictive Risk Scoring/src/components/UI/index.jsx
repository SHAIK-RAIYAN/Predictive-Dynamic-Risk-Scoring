// Reusable UI components combining Tailwind CSS and Material UI
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components with Tailwind-like utilities
export const StyledCard = styled(Card)(({ theme, variant = 'default' }) => ({
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:hover': {
    transform: variant === 'hover' ? 'translateY(-4px)' : 'none',
    boxShadow: variant === 'hover' 
      ? theme.palette.mode === 'dark'
        ? '0 20px 40px rgba(255,255,255,0.1)'
        : '0 20px 40px rgba(0,0,0,0.1)'
      : 'none',
  },
}));

export const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
  },
}));

export const RiskIndicatorCard = ({ children, riskLevel = 'low', className = '', ...props }) => {
  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'border-l-black dark:border-l-white';
      case 'high': return 'border-l-gray-700 dark:border-l-gray-300';
      case 'medium': return 'border-l-gray-500 dark:border-l-gray-400';
      case 'low': return 'border-l-gray-300 dark:border-l-gray-600';
      default: return 'border-l-gray-300 dark:border-l-gray-600';
    }
  };

  return (
    <StyledCard 
      variant="hover" 
      className={`border-l-4 ${getRiskColor(riskLevel)} ${className} risk-indicator`}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export const MetricCard = ({ title, value, subtitle, icon, trend, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <StyledCard variant="hover" {...props}>
        <CardContent className="p-6">
          <Box className="flex items-center justify-between">
            <Box className="flex-1">
              <Typography 
                variant="body2" 
                className="text-gray-600 dark:text-gray-400 mb-2 font-medium"
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                className="font-bold mb-2 text-black dark:text-white"
              >
                {value}
              </Typography>
              {subtitle && (
                <Box className="flex items-center gap-2">
                  {trend && trend}
                  <Typography 
                    variant="body2" 
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {subtitle}
                  </Typography>
                </Box>
              )}
            </Box>
            {icon && (
              <Box className="ml-4 opacity-80">
                {icon}
              </Box>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export const RiskChip = ({ level, score, size = 'small' }) => {
  const getRiskProps = (level) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return {
          label: `Critical (${score})`,
          className: 'bg-black text-white dark:bg-white dark:text-black font-semibold',
        };
      case 'high':
        return {
          label: `High (${score})`,
          className: 'bg-gray-700 text-white dark:bg-gray-300 dark:text-black font-semibold',
        };
      case 'medium':
        return {
          label: `Medium (${score})`,
          className: 'bg-gray-500 text-white dark:bg-gray-400 dark:text-black font-medium',
        };
      case 'low':
        return {
          label: `Low (${score})`,
          className: 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white font-medium',
        };
      default:
        return {
          label: `Unknown (${score})`,
          className: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        };
    }
  };

  const riskProps = getRiskProps(level);

  return (
    <Chip
      size={size}
      {...riskProps}
      className={`${riskProps.className} rounded-lg`}
    />
  );
};

export const LoadingSpinner = ({ size = 40, className = '' }) => (
  <Box className={`flex items-center justify-center ${className}`}>
    <CircularProgress 
      size={size} 
      sx={{ 
        color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000' 
      }} 
    />
  </Box>
);

export const LoadingBar = ({ className = '' }) => (
  <Box className={`w-full ${className}`}>
    <LinearProgress 
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
        '& .MuiLinearProgress-bar': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        },
      }}
    />
  </Box>
);

export const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '10px 24px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

export const GradientBox = ({ children, variant = 'light', className = '', ...props }) => {
  const gradientClass = variant === 'dark' 
    ? 'bg-gradient-to-br from-black via-gray-900 to-gray-800'
    : 'bg-gradient-to-br from-white via-gray-50 to-gray-100';

  return (
    <Box className={`${gradientClass} ${className}`} {...props}>
      {children}
    </Box>
  );
};

export const StatusIndicator = ({ status, size = 'small' }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
      case 'healthy':
        return 'bg-gray-400 dark:bg-gray-500';
      case 'warning':
      case 'degraded':
        return 'bg-gray-600 dark:bg-gray-400';
      case 'offline':
      case 'error':
      case 'critical':
        return 'bg-black dark:bg-white';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const sizeClass = size === 'large' ? 'w-4 h-4' : size === 'medium' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <Box className="flex items-center gap-2">
      <Box 
        className={`${sizeClass} rounded-full ${getStatusColor(status)} animate-pulse`}
      />
      <Typography variant="body2" className="capitalize font-medium">
        {status}
      </Typography>
    </Box>
  );
};

// Higher-order component for consistent animations
export const withFadeIn = (Component) => {
  return React.forwardRef((props, ref) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-fade-in"
    >
      <Component ref={ref} {...props} />
    </motion.div>
  ));
};

export default {
  StyledCard,
  GlassCard,
  RiskIndicatorCard,
  MetricCard,
  RiskChip,
  LoadingSpinner,
  LoadingBar,
  AnimatedButton,
  GradientBox,
  StatusIndicator,
  withFadeIn,
};
