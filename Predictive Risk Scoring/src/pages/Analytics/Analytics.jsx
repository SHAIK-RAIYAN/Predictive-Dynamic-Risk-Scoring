import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import apiService from '../../services/apiService';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('riskScore');

  const { data: analyticsData, isLoading, error } = useQuery(
    ['analytics', timeRange],
    () => apiService.getAnalytics(),
    {
      refetchInterval: 120000, // Refresh every 2 minutes
    }
  );

  const COLORS = ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0'];

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <CircularProgress size={60} />
        <Typography variant="h6" className="ml-4 text-gray-600 dark:text-gray-400">
          Loading analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="mt-4">
        <Typography variant="h6" color="error">
          Failed to load analytics. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
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
          Risk Analytics
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          Comprehensive risk analysis and trend visualization
        </Typography>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    label="Time Range"
                  >
                    <MenuItem value="1week">Last Week</MenuItem>
                    <MenuItem value="1month">Last Month</MenuItem>
                    <MenuItem value="3months">Last 3 Months</MenuItem>
                    <MenuItem value="6months">Last 6 Months</MenuItem>
                    <MenuItem value="1year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Metric</InputLabel>
                  <Select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    label="Metric"
                  >
                    <MenuItem value="riskScore">Risk Score</MenuItem>
                    <MenuItem value="incidents">Security Incidents</MenuItem>
                    <MenuItem value="threats">Threat Types</MenuItem>
                    <MenuItem value="departments">Department Analysis</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="flex gap-2">
                  <Chip label="Real-time" color="primary" variant="outlined" />
                  <Chip label="AI-powered" color="secondary" variant="outlined" />
                  <Chip label="Predictive" color="success" variant="outlined" />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Risk Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
              Risk Score Trends
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData?.riskTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#1d4ed8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Department Risk Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Grid container spacing={4} className="mb-6">
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                  Department Risk Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.departmentRisk || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                  Threat Type Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.threatTypes || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                    >
                      {(analyticsData?.threatTypes || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Time-based Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
              Hourly Incident Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analyticsData?.timeAnalysis || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="incidents" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgScore" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-black dark:text-white">
                  {analyticsData?.riskTrends?.length || 0}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Months Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-red-600">
                  {analyticsData?.departmentRisk?.length || 0}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Departments Monitored
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-blue-600">
                  {analyticsData?.threatTypes?.length || 0}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Threat Types Identified
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-green-600">
                  {analyticsData?.timeAnalysis?.length || 0}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                  Time Periods Tracked
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </motion.div>
  );
};

export default Analytics; 