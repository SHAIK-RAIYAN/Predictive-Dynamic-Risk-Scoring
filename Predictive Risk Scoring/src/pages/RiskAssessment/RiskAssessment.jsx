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

// Mock data - replace with actual API calls
const mockRiskFactors = [
  { id: 1, name: 'Unusual Login Time', weight: 0.15, score: 8, description: 'Login outside normal business hours' },
  { id: 2, name: 'Large File Transfer', weight: 0.25, score: 12, description: 'Transfer of files > 100MB' },
  { id: 3, name: 'Failed Authentication', weight: 0.20, score: 6, description: 'Multiple failed login attempts' },
  { id: 4, name: 'Privilege Escalation', weight: 0.30, score: 15, description: 'Access to restricted resources' },
  { id: 5, name: 'Network Anomaly', weight: 0.10, score: 4, description: 'Unusual network traffic patterns' },
];

const mockEntityHistory = [
  { timestamp: '2024-01-15 14:30', event: 'Login from new IP', score: 5 },
  { timestamp: '2024-01-15 15:45', event: 'Large file download', score: 12 },
  { timestamp: '2024-01-15 16:20', event: 'Access to admin panel', score: 8 },
  { timestamp: '2024-01-15 17:10', event: 'Failed login attempt', score: 3 },
  { timestamp: '2024-01-15 18:00', event: 'Database query execution', score: 6 },
];

const RiskAssessment = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [entityId, setEntityId] = useState('');
  const [isAssessing, setIsAssessing] = useState(false);
  const theme = useTheme();

  // Mock API queries
  const { data: riskData, isLoading } = useQuery(
    ['riskAssessment', entityId],
    () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          entityId: entityId || 'user-john.doe',
          overallScore: 34,
          riskLevel: 'Medium',
          factors: mockRiskFactors,
          history: mockEntityHistory,
          recommendations: [
            'Review recent login patterns',
            'Monitor file transfer activities',
            'Implement additional authentication for admin access',
          ],
        });
      }, 2000);
    }),
    {
      enabled: !!entityId,
    }
  );

  const assessRiskMutation = useMutation(
    (entityId) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Risk assessment completed' });
      }, 3000);
    }),
    {
      onSuccess: () => {
        toast.success('Risk assessment completed successfully');
        setIsAssessing(false);
      },
      onError: () => {
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
    if (score >= 40) return theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
    if (score >= 25) return theme.palette.mode === 'dark' ? '#bdbdbd' : '#757575';
    return theme.palette.mode === 'dark' ? '#9e9e9e' : '#424242';
  };

  const getRiskLevel = (score) => {
    if (score >= 40) return 'Critical';
    if (score >= 30) return 'High';
    if (score >= 20) return 'Medium';
    return 'Low';
  };

  const getRiskLevelKey = (score) => {
    if (score >= 40) return 'critical';
    if (score >= 30) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
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
          Comprehensive security risk analysis and scoring
        </Typography>
      </motion.div>

      {/* Entity Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StyledCard variant="hover" className="mb-6">
          <CardContent className="p-6">
            <Box className="flex items-center gap-3 mb-6">
              <Search className="text-black dark:text-white" />
              <Typography 
                variant="h6" 
                className="font-semibold text-black dark:text-white"
              >
                Assess Entity Risk
              </Typography>
            </Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Entity ID"
                  placeholder="Enter user ID, server name, or IP address"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  variant="outlined"
                  className="bg-white dark:bg-black"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background.paper,
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <AnimatedButton
                    variant="contained"
                    size="large"
                    onClick={handleAssessRisk}
                    disabled={isAssessing || !entityId.trim()}
                    startIcon={<Assessment />}
                    className={`w-full h-14 ${isAssessing ? 'animate-pulse' : ''} bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200`}
                  >
                    {isAssessing ? 'Analyzing...' : 'Assess Risk'}
                  </AnimatedButton>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </motion.div>

      <AnimatePresence>
        {riskData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Risk Overview */}
            <Grid container spacing={3} className="mb-8">
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Overall Risk Score"
                  value={riskData.overallScore}
                  subtitle="Score range: 5-50"
                  icon={<Security className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
                  className="card-hover"
                />
                <Box className="mt-4">
                  <RiskChip 
                    level={getRiskLevelKey(riskData.overallScore)} 
                    score={riskData.overallScore}
                    size="medium"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(riskData.overallScore / 50) * 100}
                  className="mt-4 h-2 rounded-full"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getRiskColor(riskData.overallScore),
                      borderRadius: '4px',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <StyledCard variant="hover">
                  <CardContent className="p-6">
                    <Box className="flex items-center gap-3 mb-6">
                      <BarChart className="text-black dark:text-white" />
                      <Typography 
                        variant="h6" 
                        className="font-semibold text-black dark:text-white"
                      >
                        Risk Factors Breakdown
                      </Typography>
                    </Box>
                    <Grid container spacing={3}>
                      {riskData.factors.map((factor, index) => (
                        <Grid item xs={12} key={factor.id}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            className="space-y-3"
                          >
                            <Box className="flex justify-between items-center">
                              <Typography 
                                variant="body1" 
                                className="font-medium text-black dark:text-white"
                              >
                                {factor.name}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                className="font-bold"
                                sx={{ color: getRiskColor(factor.score) }}
                              >
                                {factor.score} pts
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(factor.score / 15) * 100}
                              className="h-2 rounded-full"
                              sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getRiskColor(factor.score),
                                  borderRadius: '4px',
                                },
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              className="text-gray-600 dark:text-gray-400"
                            >
                              Weight: {factor.weight * 100}% • {factor.description}
                            </Typography>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>

            {/* Detailed Analysis */}
            <StyledCard variant="hover" className="mt-8">
              <CardContent className="p-6">
                <Tabs 
                  value={selectedTab} 
                  onChange={(e, newValue) => setSelectedTab(newValue)} 
                  className="mb-6"
                  sx={{
                    '& .MuiTab-root': {
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      '&.Mui-selected': {
                        color: theme.palette.primary.main,
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Tab label="Risk History" icon={<Timeline />} />
                  <Tab label="Recommendations" icon={<Rule />} />
                  <Tab label="Pattern Analysis" icon={<Assessment />} />
                </Tabs>

                <AnimatePresence mode="wait">
                  {selectedTab === 0 && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography 
                        variant="h6" 
                        className="font-semibold text-black dark:text-white mb-4"
                      >
                        Recent Risk Events
                      </Typography>
                      <List className="space-y-2">
                        {riskData.history.map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.2 }}
                          >
                            <ListItem className="bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                              <ListItemIcon>
                                <Warning sx={{ color: getRiskColor(event.score) }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography className="font-medium text-black dark:text-white">
                                    {event.event}
                                  </Typography>
                                }
                                secondary={
                                  <Typography className="text-gray-600 dark:text-gray-400">
                                    {event.timestamp}
                                  </Typography>
                                }
                              />
                              <RiskChip 
                                level={getRiskLevelKey(event.score)} 
                                score={event.score}
                                size="small"
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </motion.div>
                  )}

                  {selectedTab === 1 && (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography 
                        variant="h6" 
                        className="font-semibold text-black dark:text-white mb-4"
                      >
                        Actionable Recommendations
                      </Typography>
                      <Alert 
                        severity="info" 
                        className="mb-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                        sx={{
                          backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#fafafa',
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.divider}`,
                          '& .MuiAlert-icon': {
                            color: theme.palette.text.primary,
                          },
                        }}
                      >
                        Based on the current risk assessment, here are the recommended actions to reduce risk exposure.
                      </Alert>
                      <List className="space-y-2">
                        {riskData.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.2 }}
                          >
                            <ListItem className="bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <ListItemIcon>
                                <CheckCircle className="text-green-600 dark:text-green-400" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={
                                  <Typography className="font-medium text-black dark:text-white">
                                    {rec}
                                  </Typography>
                                } 
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </motion.div>
                  )}

                  {selectedTab === 2 && (
                    <motion.div
                      key="patterns"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography 
                        variant="h6" 
                        className="font-semibold text-black dark:text-white mb-6"
                      >
                        Pattern Analysis
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            <StyledCard className="border border-gray-200 dark:border-gray-700">
                              <CardContent className="p-4">
                                <Typography 
                                  variant="subtitle1" 
                                  className="font-semibold text-black dark:text-white mb-3"
                                >
                                  Behavioral Patterns
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                >
                                  • Unusual login times detected<br />
                                  • Increased file transfer activity<br />
                                  • Access to restricted resources<br />
                                  • Network traffic anomalies
                                </Typography>
                              </CardContent>
                            </StyledCard>
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <StyledCard className="border border-gray-200 dark:border-gray-700">
                              <CardContent className="p-4">
                                <Typography 
                                  variant="subtitle1" 
                                  className="font-semibold text-black dark:text-white mb-3"
                                >
                                  Risk Indicators
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                >
                                  • Privilege escalation attempts<br />
                                  • Failed authentication events<br />
                                  • Large data transfers<br />
                                  • Unusual access patterns
                                </Typography>
                              </CardContent>
                            </StyledCard>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </StyledCard>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StyledCard>
            <CardContent className="p-6">
              <Box className="flex items-center gap-4">
                <LoadingBar className="flex-1" />
                <Typography 
                  variant="body2" 
                  className="text-gray-600 dark:text-gray-400 font-medium"
                >
                  Analyzing entity risk...
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RiskAssessment; 