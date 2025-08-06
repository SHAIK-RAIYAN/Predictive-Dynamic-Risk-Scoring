import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Refresh,
  Warning,
  Error,
  CheckCircle,
  Info
} from '@mui/icons-material';
import firebaseService from '../../services/firebaseService';

const LiveMonitoring = () => {
  const [isActive, setIsActive] = useState(false);
  const [monitoringData, setMonitoringData] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to live monitoring data
    const unsubscribeMonitoring = firebaseService.subscribeToLiveMonitoring((data) => {
      setMonitoringData(data);
      if (data?.isActive !== undefined) {
        setIsActive(data.isActive);
      }
    });

    // Subscribe to users and events for real-time updates
    const unsubscribeUsers = firebaseService.subscribeToUsers(setUsers);
    const unsubscribeEvents = firebaseService.subscribeToRiskEvents(setEvents);

    return () => {
      unsubscribeMonitoring();
      unsubscribeUsers();
      unsubscribeEvents();
    };
  }, []);

  const handleToggleMonitoring = async () => {
    setLoading(true);
    try {
      const newStatus = !isActive;
      await firebaseService.updateLiveMonitoringStatus(newStatus);
      setIsActive(newStatus);
    } catch (error) {
      console.error('Error toggling monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Force refresh by updating the monitoring status
      await firebaseService.updateLiveMonitoringStatus(isActive);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'LOW': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    if (loading) return <CircularProgress size={20} />;
    return isActive ? <PlayArrow color="success" /> : <Pause color="disabled" />;
  };

  const getStatusColor = () => {
    return isActive ? 'success' : 'default';
  };

  const getActiveUsersCount = () => {
    return users.filter(user => {
      const lastActivity = new Date(user.lastActivity);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return lastActivity > oneHourAgo;
    }).length;
  };

  const getRecentEventsCount = () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return events.filter(event => new Date(event.timestamp) > oneHourAgo).length;
  };

  const getHighRiskUsersCount = () => {
    return users.filter(user => user.riskLevel === 'HIGH').length;
  };

  const getAverageRiskScore = () => {
    if (users.length === 0) return 0;
    const totalScore = users.reduce((sum, user) => sum + (user.riskScore || 0), 0);
    return (totalScore / users.length).toFixed(1);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            Live Monitoring
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={handleToggleMonitoring}
                  disabled={loading}
                  color="success"
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {getStatusIcon()}
                  <Typography variant="body2" color={getStatusColor()}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>

        {isActive ? (
          <Box>
            {/* Status Alert */}
            <Alert 
              severity="success" 
              icon={<CheckCircle />}
              sx={{ mb: 2 }}
            >
              Live monitoring is active. Real-time data is being collected and analyzed.
            </Alert>

            {/* Key Metrics */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {getActiveUsersCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {getRecentEventsCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Events
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {getHighRiskUsersCount()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Risk Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main">
                    {getAverageRiskScore()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Risk Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Recent High-Risk Events */}
            <Typography variant="h6" gutterBottom>
              Recent High-Risk Events
            </Typography>
            <Box maxHeight={200} overflow="auto">
              {events
                .filter(event => event.severity === 'HIGH')
                .slice(0, 5)
                .map((event) => (
                  <Box
                    key={event.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    mb={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(event.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={event.severity}
                      color={getSeverityColor(event.severity)}
                      size="small"
                    />
                  </Box>
                ))}
              {events.filter(event => event.severity === 'HIGH').length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  No high-risk events in the last hour
                </Typography>
              )}
            </Box>

            {/* User Risk Distribution */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              User Risk Distribution
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`Low: ${users.filter(u => u.riskLevel === 'LOW').length}`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`Medium: ${users.filter(u => u.riskLevel === 'MEDIUM').length}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`High: ${users.filter(u => u.riskLevel === 'HIGH').length}`}
                color="error"
                variant="outlined"
              />
            </Box>
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Pause sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Monitoring Inactive
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enable live monitoring to start collecting real-time risk data
            </Typography>
          </Box>
        )}

        {/* Last Updated */}
        {monitoringData?.lastUpdated && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Last updated: {new Date(monitoringData.lastUpdated).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveMonitoring; 