import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  Security,
  CheckCircle,
  Warning,
  PriorityHigh,
  TrendingUp,
  Lightbulb,
  AutoFixHigh,
  Schedule,
  Visibility,
  Close,
  PlayArrow,
  Pause,
  Stop,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';

const Recommendations = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [implementationDialogOpen, setImplementationDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [implementationData, setImplementationData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    effort: 'Medium',
    timeline: '1 week',
    assignee: '',
  });

  const { data: recommendations, isLoading, error } = useQuery(
    'recommendations',
    () => apiService.getRecommendations(),
    {
      refetchInterval: 60000, // Refresh every minute
    }
  );

  const implementMutation = useMutation(
    (data) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Recommendation implemented successfully' });
      }, 2000);
    }),
    {
      onSuccess: () => {
        toast.success('Recommendation implementation started');
        setImplementationDialogOpen(false);
        setImplementationData({
          title: '',
          description: '',
          priority: 'Medium',
          effort: 'Medium',
          timeline: '1 week',
          assignee: '',
        });
      },
      onError: () => {
        toast.error('Failed to implement recommendation');
      },
    }
  );

  const scheduleMutation = useMutation(
    (data) => new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Recommendation scheduled successfully' });
      }, 1000);
    }),
    {
      onSuccess: () => {
        toast.success('Recommendation scheduled successfully');
        setScheduleDialogOpen(false);
      },
      onError: () => {
        toast.error('Failed to schedule recommendation');
      },
    }
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'In Progress':
        return '#3b82f6';
      case 'Pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleImplement = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setImplementationData({
      title: recommendation.title,
      description: recommendation.description,
      priority: recommendation.priority,
      effort: recommendation.effort,
      timeline: '1 week',
      assignee: '',
    });
    setImplementationDialogOpen(true);
  };

  const handleSchedule = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setScheduleDialogOpen(true);
  };

  const handleImplementationSubmit = () => {
    if (!implementationData.title || !implementationData.assignee) {
      toast.error('Please fill in all required fields');
      return;
    }
    implementMutation.mutate(implementationData);
  };

  const handleScheduleSubmit = () => {
    scheduleMutation.mutate(selectedRecommendation);
  };

  const getAIRecommendations = async (entityId) => {
    try {
      const riskData = await apiService.assessEntityRisk(entityId);
      const aiRecommendations = await apiService.getAIRecommendations(entityId, riskData);
      return aiRecommendations;
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <CircularProgress size={60} />
        <Typography variant="h6" className="ml-4 text-gray-600 dark:text-gray-400">
          Loading recommendations...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="mt-4">
        Failed to load recommendations. Please try again.
      </Alert>
    );
  }

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
          Security Recommendations
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          AI-powered security recommendations and implementation tracking
        </Typography>
      </motion.div>

      {/* AI Recommendations Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Alert 
          severity="info" 
          className="mb-6"
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => getAIRecommendations('user-john.doe')}
            >
              Get AI Recommendations
            </Button>
          }
        >
          <Typography variant="body2">
            Use AI-powered recommendations for specific entities. Click to get personalized security recommendations.
          </Typography>
        </Alert>
      </motion.div>

      {/* Recommendations Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3}>
          {recommendations?.map((recommendation, index) => (
            <Grid item xs={12} md={6} key={recommendation.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <Box className="flex justify-between items-start mb-4">
                      <Typography variant="h6" className="font-semibold text-black dark:text-white mb-2">
                        {recommendation.title}
                      </Typography>
                      <Chip
                        label={recommendation.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(recommendation.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mb-4">
                      {recommendation.description}
                    </Typography>

                    <Box className="grid grid-cols-2 gap-4 mb-4">
                      <Box>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          Priority
                        </Typography>
                        <Chip
                          label={recommendation.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(recommendation.priority),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          Impact
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {recommendation.impact}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          Effort
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {recommendation.effort}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                          Category
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {recommendation.category}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="mb-4">
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
                        Risk Reduction: {recommendation.estimatedRiskReduction}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={recommendation.estimatedRiskReduction}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#10b981',
                          },
                        }}
                      />
                    </Box>

                    <Box className="flex gap-2">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => handleImplement(recommendation)}
                        disabled={recommendation.status === 'Completed'}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        Implement
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Schedule />}
                        onClick={() => handleSchedule(recommendation)}
                        className="border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Schedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Implementation Dialog */}
      <Dialog 
        open={implementationDialogOpen} 
        onClose={() => setImplementationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Implement Recommendation
          </Typography>
          <IconButton onClick={() => setImplementationDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={implementationData.title}
              onChange={(e) => setImplementationData({...implementationData, title: e.target.value})}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={implementationData.description}
              onChange={(e) => setImplementationData({...implementationData, description: e.target.value})}
            />
            <Box className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={implementationData.priority}
                  onChange={(e) => setImplementationData({...implementationData, priority: e.target.value})}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Effort</InputLabel>
                <Select
                  value={implementationData.effort}
                  onChange={(e) => setImplementationData({...implementationData, effort: e.target.value})}
                  label="Effort"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Timeline"
                value={implementationData.timeline}
                onChange={(e) => setImplementationData({...implementationData, timeline: e.target.value})}
              />
              <TextField
                fullWidth
                label="Assignee"
                value={implementationData.assignee}
                onChange={(e) => setImplementationData({...implementationData, assignee: e.target.value})}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImplementationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleImplementationSubmit}
            disabled={implementMutation.isLoading}
            startIcon={implementMutation.isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {implementMutation.isLoading ? 'Implementing...' : 'Start Implementation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Schedule Recommendation
          </Typography>
          <IconButton onClick={() => setScheduleDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4">
            <Typography variant="body1" className="font-medium">
              {selectedRecommendation?.title}
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              {selectedRecommendation?.description}
            </Typography>
            <TextField
              fullWidth
              label="Scheduled Date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleScheduleSubmit}
            disabled={scheduleMutation.isLoading}
            startIcon={scheduleMutation.isLoading ? <CircularProgress size={20} /> : <Schedule />}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {scheduleMutation.isLoading ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Recommendations; 