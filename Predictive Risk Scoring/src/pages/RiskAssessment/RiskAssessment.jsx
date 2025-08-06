import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore,
  Security,
  Warning,
  CheckCircle,
  Error,
  TrendingUp,
  Assessment,
  Rule,
  Timeline,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import toast from 'react-hot-toast';

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
    if (score >= 40) return '#f44336';
    if (score >= 25) return '#ff9800';
    return '#4caf50';
  };

  const getRiskLevel = (score) => {
    if (score >= 40) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Risk Assessment
      </Typography>

      {/* Entity Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Assess Entity Risk
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entity ID"
                placeholder="Enter user ID, server name, or IP address"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAssessRisk}
                disabled={isAssessing || !entityId.trim()}
                startIcon={<Assessment />}
                sx={{ height: 56 }}
              >
                {isAssessing ? 'Assessing...' : 'Assess Risk'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {riskData && (
        <>
          {/* Risk Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Risk Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h2"
                      sx={{ color: getRiskColor(riskData.overallScore), mr: 2 }}
                    >
                      {riskData.overallScore}
                    </Typography>
                    <Chip
                      label={riskData.riskLevel}
                      color={riskData.riskLevel === 'High' ? 'error' : riskData.riskLevel === 'Medium' ? 'warning' : 'success'}
                      size="large"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(riskData.overallScore / 50) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRiskColor(riskData.overallScore),
                      },
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Score range: 5-50
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Risk Factors Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    {riskData.factors.map((factor) => (
                      <Grid item xs={12} key={factor.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {factor.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: getRiskColor(factor.score) }}>
                            {factor.score} pts
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(factor.score / 15) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getRiskColor(factor.score),
                            },
                          }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          Weight: {factor.weight * 100}% • {factor.description}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Analysis */}
          <Card>
            <CardContent>
              <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
                <Tab label="Risk History" icon={<Timeline />} />
                <Tab label="Recommendations" icon={<Rule />} />
                <Tab label="Pattern Analysis" icon={<Assessment />} />
              </Tabs>

              {selectedTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recent Risk Events
                  </Typography>
                  <List>
                    {riskData.history.map((event, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Warning sx={{ color: getRiskColor(event.score) }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={event.event}
                            secondary={event.timestamp}
                          />
                          <Chip
                            label={`+${event.score}`}
                            size="small"
                            sx={{
                              backgroundColor: getRiskColor(event.score),
                              color: 'white',
                            }}
                          />
                        </ListItem>
                        {index < riskData.history.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              )}

              {selectedTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Actionable Recommendations
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Based on the current risk assessment, here are the recommended actions to reduce risk exposure.
                  </Alert>
                  <List>
                    {riskData.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Pattern Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Behavioral Patterns
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            • Unusual login times detected<br />
                            • Increased file transfer activity<br />
                            • Access to restricted resources<br />
                            • Network traffic anomalies
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Risk Indicators
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            • Privilege escalation attempts<br />
                            • Failed authentication events<br />
                            • Large data transfers<br />
                            • Unusual access patterns
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {isLoading && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinearProgress sx={{ flexGrow: 1, mr: 2 }} />
              <Typography variant="body2">Analyzing entity risk...</Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RiskAssessment; 