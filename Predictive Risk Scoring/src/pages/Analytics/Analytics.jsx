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

// Mock data
const mockAnalyticsData = {
  riskTrends: [
    { month: 'Jan', avgScore: 28, highRisk: 15, mediumRisk: 45, lowRisk: 120 },
    { month: 'Feb', avgScore: 32, highRisk: 18, mediumRisk: 52, lowRisk: 115 },
    { month: 'Mar', avgScore: 35, highRisk: 22, mediumRisk: 58, lowRisk: 110 },
    { month: 'Apr', avgScore: 31, highRisk: 19, mediumRisk: 49, lowRisk: 118 },
    { month: 'May', avgScore: 38, highRisk: 25, mediumRisk: 62, lowRisk: 105 },
    { month: 'Jun', avgScore: 42, highRisk: 30, mediumRisk: 68, lowRisk: 98 },
  ],
  departmentRisk: [
    { department: 'Engineering', avgScore: 35, entities: 45 },
    { department: 'Finance', avgScore: 28, entities: 23 },
    { department: 'IT', avgScore: 42, entities: 38 },
    { department: 'HR', avgScore: 22, entities: 15 },
    { department: 'Marketing', avgScore: 31, entities: 28 },
  ],
  threatTypes: [
    { type: 'Privilege Escalation', count: 45, percentage: 35 },
    { type: 'Data Exfiltration', count: 32, percentage: 25 },
    { type: 'Unauthorized Access', count: 28, percentage: 22 },
    { type: 'Malware Activity', count: 15, percentage: 12 },
    { type: 'Other', count: 8, percentage: 6 },
  ],
  timeAnalysis: [
    { hour: '00:00', incidents: 5, avgScore: 25 },
    { hour: '04:00', incidents: 3, avgScore: 22 },
    { hour: '08:00', incidents: 12, avgScore: 35 },
    { hour: '12:00', incidents: 18, avgScore: 42 },
    { hour: '16:00', incidents: 15, avgScore: 38 },
    { hour: '20:00', incidents: 8, avgScore: 28 },
  ],
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('riskScore');

  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', timeRange],
    () => new Promise((resolve) => setTimeout(() => resolve(mockAnalyticsData), 1000))
  );

  const COLORS = ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0'];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Risk Analytics
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
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
                <InputLabel>Primary Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  label="Primary Metric"
                >
                  <MenuItem value="riskScore">Risk Score</MenuItem>
                  <MenuItem value="incidents">Security Incidents</MenuItem>
                  <MenuItem value="threats">Threat Count</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Live Data" color="success" />
                <Chip label="ML Enhanced" color="primary" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Risk Trends Over Time */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Score Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData?.riskTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 50]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#2196f3"
                    strokeWidth={3}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution by Department */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Risk Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.departmentRisk}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 50]} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Threat Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Threat Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.threatTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                  >
                    {analyticsData?.threatTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Hourly Incident Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hourly Incident Pattern
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData?.timeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stackId="1"
                    stroke="#ff9800"
                    fill="#ff9800"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgScore"
                    stackId="2"
                    stroke="#f44336"
                    fill="#f44336"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Score Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Score Distribution Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData?.riskTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="highRisk" stackId="a" fill="#f44336" name="High Risk" />
                  <Bar dataKey="mediumRisk" stackId="a" fill="#ff9800" name="Medium Risk" />
                  <Bar dataKey="lowRisk" stackId="a" fill="#4caf50" name="Low Risk" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 