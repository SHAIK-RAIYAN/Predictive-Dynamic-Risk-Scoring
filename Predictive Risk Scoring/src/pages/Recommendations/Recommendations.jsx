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
} from '@mui/icons-material';
import { useQuery } from 'react-query';

// Mock data
const mockRecommendations = [
  {
    id: 1,
    title: 'Implement Multi-Factor Authentication',
    description: 'Enable MFA for all user accounts to prevent unauthorized access',
    priority: 'High',
    impact: 'Critical',
    effort: 'Medium',
    status: 'Pending',
    category: 'Authentication',
    affectedEntities: 45,
    estimatedRiskReduction: 35,
  },
  {
    id: 2,
    title: 'Review Firewall Rules',
    description: 'Audit and tighten firewall configurations to restrict unnecessary access',
    priority: 'Medium',
    impact: 'High',
    effort: 'Low',
    status: 'In Progress',
    category: 'Network Security',
    affectedEntities: 12,
    estimatedRiskReduction: 25,
  },
  {
    id: 3,
    title: 'Update Access Controls',
    description: 'Implement least privilege principle for database access',
    priority: 'High',
    impact: 'High',
    effort: 'High',
    status: 'Pending',
    category: 'Access Control',
    affectedEntities: 8,
    estimatedRiskReduction: 40,
  },
  {
    id: 4,
    title: 'Enable File Integrity Monitoring',
    description: 'Monitor critical system files for unauthorized changes',
    priority: 'Medium',
    impact: 'Medium',
    effort: 'Medium',
    status: 'Completed',
    category: 'System Security',
    affectedEntities: 23,
    estimatedRiskReduction: 20,
  },
  {
    id: 5,
    title: 'Implement Data Loss Prevention',
    description: 'Deploy DLP solution to prevent sensitive data exfiltration',
    priority: 'High',
    impact: 'Critical',
    effort: 'High',
    status: 'Pending',
    category: 'Data Protection',
    affectedEntities: 156,
    estimatedRiskReduction: 45,
  },
];

const Recommendations = () => {
  const [expanded, setExpanded] = useState(false);

  const { data: recommendations, isLoading } = useQuery(
    'recommendations',
    () => new Promise((resolve) => setTimeout(() => resolve(mockRecommendations), 1000))
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'In Progress': return '#2196f3';
      case 'Pending': return '#ff9800';
      default: return '#757575';
    }
  };

  const handleImplement = (recommendation) => {
    // Implementation logic
    console.log('Implementing:', recommendation.title);
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Security Recommendations
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>AI-Powered Insights:</strong> These recommendations are generated based on real-time risk analysis 
          and machine learning models. Implement them to reduce your organization's risk exposure.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Recommendations
              </Typography>
              <Typography variant="h4" component="div">
                {recommendations?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#f44336' }}>
                {recommendations?.filter(r => r.priority === 'High').length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#4caf50' }}>
                {recommendations?.filter(r => r.status === 'Completed').length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Risk Reduction Potential
              </Typography>
              <Typography variant="h4" component="div" sx={{ color: '#2196f3' }}>
                {Math.round(recommendations?.reduce((sum, r) => sum + r.estimatedRiskReduction, 0) / recommendations?.length) || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actionable Recommendations
              </Typography>
              
              {recommendations?.map((recommendation) => (
                <Accordion key={recommendation.id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{recommendation.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {recommendation.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                        <Chip
                          label={recommendation.priority}
                          size="small"
                          sx={{ backgroundColor: getPriorityColor(recommendation.priority), color: 'white' }}
                        />
                        <Chip
                          label={recommendation.status}
                          size="small"
                          sx={{ backgroundColor: getStatusColor(recommendation.status), color: 'white' }}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="subtitle1" gutterBottom>
                          Details
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {recommendation.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Chip label={`Impact: ${recommendation.impact}`} size="small" />
                          <Chip label={`Effort: ${recommendation.effort}`} size="small" />
                          <Chip label={`Category: ${recommendation.category}`} size="small" />
                        </Box>

                        <Typography variant="body2" color="textSecondary">
                          Affects {recommendation.affectedEntities} entities • 
                          Estimated risk reduction: {recommendation.estimatedRiskReduction}%
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<AutoFixHigh />}
                            onClick={() => handleImplement(recommendation)}
                            disabled={recommendation.status === 'Completed'}
                          >
                            {recommendation.status === 'Completed' ? 'Completed' : 'Implement'}
                          </Button>
                          
                          <Button variant="outlined" size="small">
                            View Details
                          </Button>
                          
                          <Button variant="outlined" size="small">
                            Schedule Implementation
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommendations; 