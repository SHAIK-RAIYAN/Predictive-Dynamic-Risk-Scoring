import React, { useState } from 'react';
import {
  Grid,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Tabs,
  Tab,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Security,
  Warning,
  CheckCircle,
  Assessment,
  Rule,
  Timeline,
  Search,
  TrendingUp,
  BarChart,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StyledCard, 
  MetricCard, 
  RiskChip, 
  LoadingBar, 
  AnimatedButton,
  StatusIndicator,
} from "../../components/UI/index.jsx";
import apiService from "../../services/apiService";

const RiskAssessment = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [entityId, setEntityId] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const theme = useTheme();

  // Real API queries
  const { data: riskData, isLoading, refetch } = useQuery(
    ['riskAssessment', entityId],
    () => apiService.assessEntityRisk(entityId),
    {
      enabled: !!entityId,
      retry: false,
    }
  );

  const assessRiskMutation = useMutation(
    (entityId) => apiService.assessEntityRisk(entityId),
    {
      onSuccess: () => {
        toast.success('Risk assessment completed successfully');
        setIsAssessing(false);
        refetch();
      },
      onError: (error) => {
        toast.error('Risk assessment failed');
        setIsAssessing(false);
      },
    }
  );

  const handleAssessRisk = () => {
    if (!entityId.trim()) {
      toast.error('Please enter an entity ID');
      return;
    }
    setIsAssessing(true);
    assessRiskMutation.mutate(entityId);
  };

  const getRiskColor = (score) => {
    if (score >= 40) return '#ef4444';
    if (score >= 25) return '#f59e0b';
    return '#10b981';
  };

  const getRiskLevel = (score) => {
    if (score >= 40) return "Critical";
    if (score >= 30) return "High";
    if (score >= 20) return "Medium";
    return "Low";
  };

  const getRiskLevelKey = (score) => {
    if (score >= 40) return "critical";
    if (score >= 30) return "high";
    if (score >= 20) return "medium";
    return "low";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Typography 
          variant="h4" 
          component="h1"
          className="font-bold text-black dark:text-white mb-2 tracking-tight"
        >
          Risk Assessment
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          Assess security risk for individual entities using AI-powered analysis
        </Typography>
      </motion.div>

      {/* Entity Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StyledCard variant="hover" className="p-6">
          <CardContent>
            <Typography 
              variant="h6" 
              className="font-semibold text-black dark:text-white mb-4"
            >
              Entity Assessment
            </Typography>
            
            <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <TextField
                fullWidth
                label="Entity ID"
                variant="outlined"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="Enter entity ID (e.g., user-john.doe, server-prod-01)"
                className="sm:flex-1"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <AnimatedButton
                variant="contained"
                onClick={handleAssessRisk}
                disabled={isAssessing || !entityId.trim()}
                startIcon={isAssessing ? <CircularProgress size={20} /> : <Assessment />}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {isAssessing ? 'Assessing...' : 'Assess Risk'}
              </AnimatedButton>
            </Box>

                         {entityId && (
               <Alert severity="info" className="mt-4">
                 <Typography variant="body2">
                   Enter any entity ID to get a dynamic risk assessment. The system will generate different risk scores based on the entity ID.
                 </Typography>
               </Alert>
             )}
           </CardContent>
         </StyledCard>
      </motion.div>

      {/* Assessment Results */}
      {riskData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Grid container spacing={3}>
            {/* Risk Score Card */}
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Overall Risk Score"
                value={riskData.overallScore}
                subtitle={`${getRiskLevel(riskData.overallScore)} Risk Level`}
                icon={<Security className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
                className="card-hover"
              />
            </Grid>

            {/* Risk Level Card */}
            <Grid item xs={12} md={4}>
              <StyledCard variant="hover" className="p-6 h-full">
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                    Risk Level
                  </Typography>
                  <RiskChip 
                    level={getRiskLevelKey(riskData.overallScore)} 
                    score={riskData.overallScore}
                  />
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
                    {getRiskLevel(riskData.overallScore)} Risk
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Entity Info Card */}
            <Grid item xs={12} md={4}>
              <StyledCard variant="hover" className="p-6 h-full">
                <CardContent>
                  <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                    Entity Information
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Entity ID:</strong> {riskData.entityId}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Assessment Date:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assessment Time:</strong> {new Date().toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Detailed Assessment */}
      {riskData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StyledCard variant="hover" className="p-6">
            <CardContent>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)}
                className="mb-6"
              >
                <Tab label="Risk Factors" icon={<Rule />} />
                <Tab label="Activity History" icon={<Timeline />} />
                <Tab label="Recommendations" icon={<CheckCircle />} />
              </Tabs>

              <AnimatePresence mode="wait">
                {selectedTab === 0 && (
                  <motion.div
                    key="factors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                      Risk Factors Analysis
                    </Typography>
                    <Grid container spacing={2}>
                      {riskData.factors?.map((factor, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <StyledCard variant="hover" className="p-4">
                            <CardContent>
                              <Box className="flex justify-between items-start mb-2">
                                <Typography variant="subtitle1" className="font-semibold text-black dark:text-white">
                                  {factor.name}
                                </Typography>
                                <Chip 
                                  label={`${factor.score} pts`}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: getRiskColor(factor.score),
                                    color: 'white',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-2">
                                {factor.description}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(factor.score / 15) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getRiskColor(factor.score),
                                  },
                                }}
                              />
                              <Typography variant="caption" className="text-gray-500 dark:text-gray-400 mt-1 block">
                                Weight: {(factor.weight * 100).toFixed(0)}%
                              </Typography>
                            </CardContent>
                          </StyledCard>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                )}

                {selectedTab === 1 && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                      Recent Activity History
                    </Typography>
                    <List>
                      {riskData.history?.map((event, index) => (
                        <ListItem key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <ListItemIcon>
                            <Warning sx={{ color: getRiskColor(event.score) }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={event.event}
                            secondary={`${event.timestamp} • Risk Score: ${event.score}`}
                            primaryTypographyProps={{
                              className: 'font-medium text-black dark:text-white'
                            }}
                            secondaryTypographyProps={{
                              className: 'text-gray-600 dark:text-gray-400'
                            }}
                          />
                          <Chip 
                            label={`${event.score} pts`}
                            size="small"
                            sx={{ 
                              backgroundColor: getRiskColor(event.score),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </motion.div>
                )}

                {selectedTab === 2 && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                      Security Recommendations
                    </Typography>
                    <List>
                      {riskData.recommendations?.map((recommendation, index) => (
                        <ListItem key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <ListItemIcon>
                            <CheckCircle sx={{ color: '#10b981' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={recommendation}
                            primaryTypographyProps={{
                              className: 'text-black dark:text-white'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </StyledCard>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" className="mt-4 text-gray-600 dark:text-gray-400">
            Analyzing entity risk...
          </Typography>
        </motion.div>
      )}

      {/* Error State */}
      {!riskData && !isLoading && entityId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Alert severity="warning" className="mt-4">
            <Typography variant="body2">
              Enter an entity ID and click "Assess Risk" to get started with the risk assessment.
            </Typography>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RiskAssessment; 