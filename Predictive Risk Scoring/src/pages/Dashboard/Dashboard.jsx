import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Refresh,
  Visibility,
  Security,
  Speed,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

// Mock data - replace with actual API calls
const mockRiskData = {
  overallRiskScore: 28,
  riskTrend: 'increasing',
  totalEntities: 1247,
  highRiskEntities: 23,
  mediumRiskEntities: 156,
  lowRiskEntities: 1068,
  recentAlerts: 12,
  falsePositives: 2,
};

const mockTrendData = [
  { time: '00:00', score: 25 },
  { time: '04:00', score: 27 },
  { time: '08:00', score: 30 },
  { time: '12:00', score: 28 },
  { time: '16:00', score: 32 },
  { time: '20:00', score: 29 },
  { time: '24:00', score: 28 },
];

const mockTopEntities = [
  { id: 1, name: 'user-john.doe', department: 'Engineering', riskScore: 45, status: 'high', lastActivity: '2 min ago' },
  { id: 2, name: 'server-prod-01', department: 'Infrastructure', riskScore: 38, status: 'medium', lastActivity: '5 min ago' },
  { id: 3, name: 'user-sarah.smith', department: 'Finance', riskScore: 42, status: 'high', lastActivity: '8 min ago' },
  { id: 4, name: 'database-main', department: 'IT', riskScore: 35, status: 'medium', lastActivity: '12 min ago' },
  { id: 5, name: 'user-mike.wilson', department: 'HR', riskScore: 31, status: 'medium', lastActivity: '15 min ago' },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 1068, color: '#4caf50' },
  { name: 'Medium Risk', value: 156, color: '#ff9800' },
  { name: 'High Risk', value: 23, color: '#f44336' },
];

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock API query - replace with actual API call
  const { data: dashboardData, isLoading, refetch } = useQuery(
    'dashboardData',
    () => new Promise((resolve) => setTimeout(() => resolve(mockRiskData), 1000)),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success('Dashboard refreshed successfully');
  };

  const getRiskColor = (score) => {
    if (score >= 40) return '#f44336';
    if (score >= 25) return '#ff9800';
    return '#4caf50';
  };

  const getRiskStatus = (score) => {
    if (score >= 40) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Risk Assessment Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </Box>

      {/* Alert Banner */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>High Risk Alert:</strong> 3 entities have exceeded risk threshold. 
          <Button size="small" sx={{ ml: 1 }}>View Details</Button>
        </Typography>
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Overall Risk Score
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: getRiskColor(dashboardData.overallRiskScore) }}>
                    {dashboardData.overallRiskScore}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {dashboardData.riskTrend === 'increasing' ? (
                      <TrendingUp sx={{ color: '#f44336', mr: 1 }} />
                    ) : (
                      <TrendingDown sx={{ color: '#4caf50', mr: 1 }} />
                    )}
                    <Typography variant="body2" color="textSecondary">
                      {dashboardData.riskTrend === 'increasing' ? '+3.2%' : '-1.8%'} from yesterday
                    </Typography>
                  </Box>
                </Box>
                <Security sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Entities
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.totalEntities.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Monitored assets
                  </Typography>
                </Box>
                <Speed sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    High Risk Entities
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ color: '#f44336' }}>
                    {dashboardData.highRiskEntities}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Require immediate attention
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: '#f44336' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Recent Alerts
                  </Typography>
                  <Typography variant="h4" component="div">
                    {dashboardData.recentAlerts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Last 24 hours
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        {/* Risk Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Score Trend (24 Hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 50]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Risk Entities */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Risk Entities
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Entity Name</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Risk Score</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTopEntities.map((entity) => (
                      <TableRow key={entity.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {entity.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{entity.department}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              variant="body2"
                              sx={{ color: getRiskColor(entity.riskScore), mr: 1 }}
                            >
                              {entity.riskScore}
                            </Typography>
                            <Chip
                              label={getRiskStatus(entity.riskScore)}
                              size="small"
                              sx={{
                                backgroundColor: getRiskColor(entity.riskScore),
                                color: 'white',
                              }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entity.status}
                            size="small"
                            color={entity.status === 'high' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{entity.lastActivity}</TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 