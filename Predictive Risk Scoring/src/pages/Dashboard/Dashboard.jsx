import React, { useState, useEffect } from "react";
import {
  Grid,
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
  CardHeader,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Refresh,
  Visibility,
  Security,
  Speed,
  Shield,
  Analytics,
  MonitorHeart,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StyledCard, 
  MetricCard, 
  RiskChip, 
  LoadingBar, 
  AnimatedButton,
  GradientBox,
  StatusIndicator,
  withFadeIn
} from "../../components/UI/index.jsx";

// Mock data - replace with actual API calls
const mockRiskData = {
  overallRiskScore: 28,
  riskTrend: "increasing",
  totalEntities: 1247,
  highRiskEntities: 23,
  mediumRiskEntities: 156,
  lowRiskEntities: 1068,
  recentAlerts: 12,
  falsePositives: 2,
};

const mockTrendData = [
  { time: "00:00", score: 25 },
  { time: "04:00", score: 27 },
  { time: "08:00", score: 30 },
  { time: "12:00", score: 28 },
  { time: "16:00", score: 32 },
  { time: "20:00", score: 29 },
  { time: "24:00", score: 28 },
];

const mockTopEntities = [
  {
    id: 1,
    name: "user-john.doe",
    department: "Engineering",
    riskScore: 45,
    status: "high",
    lastActivity: "2 min ago",
  },
  {
    id: 2,
    name: "server-prod-01",
    department: "Infrastructure",
    riskScore: 38,
    status: "medium",
    lastActivity: "5 min ago",
  },
  {
    id: 3,
    name: "user-sarah.smith",
    department: "Finance",
    riskScore: 42,
    status: "high",
    lastActivity: "8 min ago",
  },
  {
    id: 4,
    name: "database-main",
    department: "IT",
    riskScore: 35,
    status: "medium",
    lastActivity: "12 min ago",
  },
  {
    id: 5,
    name: "user-mike.wilson",
    department: "HR",
    riskScore: 31,
    status: "medium",
    lastActivity: "15 min ago",
  },
];

const riskDistributionData = [
  { name: "Low Risk", value: 1068, color: "#4caf50" },
  { name: "Medium Risk", value: 156, color: "#ff9800" },
  { name: "High Risk", value: 23, color: "#f44336" },
];

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme();

  // Mock API query - replace with actual API call
  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useQuery(
    "dashboardData",
    () =>
      new Promise((resolve) => setTimeout(() => resolve(mockRiskData), 1000)),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Dashboard refreshed successfully", {
      style: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
      },
    });
  };

  const getRiskColor = (score) => {
    if (score >= 40) return theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
    if (score >= 25) return theme.palette.mode === 'dark' ? '#bdbdbd' : '#757575';
    return theme.palette.mode === 'dark' ? '#9e9e9e' : '#424242';
  };

  const getRiskStatus = (score) => {
    if (score >= 40) return "Critical";
    if (score >= 30) return "High";
    if (score >= 20) return "Medium";
    return "Low";
  };

  const getRiskLevel = (score) => {
    if (score >= 40) return "critical";
    if (score >= 30) return "high";
    if (score >= 20) return "medium";
    return "low";
  };

  if (isLoading) {
    return (
      <Box className="w-full p-8">
        <LoadingBar className="rounded-lg" />
        <Typography className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Loading dashboard data...
        </Typography>
      </Box>
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
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1"
            className="font-bold text-black dark:text-white mb-2 tracking-tight"
          >
            Risk Assessment Dashboard
          </Typography>
          <Typography 
            variant="body1" 
            className="text-gray-600 dark:text-gray-400"
          >
            Real-time monitoring and predictive risk analysis
          </Typography>
        </Box>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatedButton
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`${isRefreshing ? 'animate-spin' : ''} bg-white dark:bg-black text-black dark:text-white border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900`}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </AnimatedButton>
        </motion.div>
      </motion.div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Alert 
          severity="warning" 
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
          <Box className="flex items-center justify-between w-full">
            <Typography variant="body2" className="font-medium">
              <span className="font-bold">High Risk Alert:</span> 3 entities have exceeded risk threshold.
            </Typography>
            <AnimatedButton 
              size="small" 
              variant="contained"
              className="ml-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              View Details
            </AnimatedButton>
          </Box>
        </Alert>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Overall Risk Score"
              value={dashboardData.overallRiskScore}
              subtitle={`${dashboardData.riskTrend === "increasing" ? "+3.2%" : "-1.8%"} from yesterday`}
              icon={<Shield className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              trend={
                dashboardData.riskTrend === "increasing" ? (
                  <TrendingUp className="text-red-500 dark:text-red-400" />
                ) : (
                  <TrendingDown className="text-green-500 dark:text-green-400" />
                )
              }
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Entities"
              value={dashboardData.totalEntities.toLocaleString()}
              subtitle="Monitored assets"
              icon={<MonitorHeart className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="High Risk Entities"
              value={dashboardData.highRiskEntities}
              subtitle="Require immediate attention"
              icon={<Warning className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Recent Alerts"
              value={dashboardData.recentAlerts}
              subtitle="Last 24 hours"
              icon={<Analytics className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              className="card-hover"
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts and Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Grid container spacing={3} className="mb-8">
          {/* Risk Trend Chart */}
          <Grid item xs={12} md={8}>
            <StyledCard variant="hover" className="p-6">
              <CardContent>
                <Typography 
                  variant="h6" 
                  className="font-semibold text-black dark:text-white mb-6"
                >
                  Risk Score Trend (24 Hours)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0'}
                    />
                    <XAxis 
                      dataKey="time" 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <YAxis 
                      domain={[0, 50]} 
                      stroke={theme.palette.text.secondary}
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        color: theme.palette.text.primary,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
                      strokeWidth={3}
                      dot={{ 
                        fill: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', 
                        strokeWidth: 2, 
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        fill: theme.palette.mode === 'dark' ? '#f5f5f5' : '#212121' 
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Risk Distribution */}
          <Grid item xs={12} md={4}>
            <StyledCard variant="hover" className="p-6">
              <CardHeader
                title={
                  <Typography 
                    variant="h6" 
                    className="font-semibold text-black dark:text-white"
                  >
                    Risk Distribution
                  </Typography>
                }
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: "Low Risk", 
                          value: 1068, 
                          color: theme.palette.mode === 'dark' ? '#9e9e9e' : '#e0e0e0'
                        },
                        { 
                          name: "Medium Risk", 
                          value: 156, 
                          color: theme.palette.mode === 'dark' ? '#757575' : '#bdbdbd'
                        },
                        { 
                          name: "High Risk", 
                          value: 23, 
                          color: theme.palette.mode === 'dark' ? '#424242' : '#757575'
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelStyle={{
                        fill: theme.palette.text.primary,
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {[
                        { 
                          name: "Low Risk", 
                          value: 1068, 
                          color: theme.palette.mode === 'dark' ? '#9e9e9e' : '#e0e0e0'
                        },
                        { 
                          name: "Medium Risk", 
                          value: 156, 
                          color: theme.palette.mode === 'dark' ? '#757575' : '#bdbdbd'
                        },
                        { 
                          name: "High Risk", 
                          value: 23, 
                          color: theme.palette.mode === 'dark' ? '#424242' : '#757575'
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        color: theme.palette.text.primary,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </motion.div>

      {/* Top Risk Entities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <StyledCard variant="hover" className="overflow-hidden">
          <CardContent className="p-6">
            <Typography 
              variant="h6" 
              className="font-semibold text-black dark:text-white mb-6"
            >
              Top Risk Entities
            </Typography>
            <TableContainer
              component={Paper}
              className="bg-transparent shadow-none"
              sx={{ 
                backgroundColor: "transparent",
                boxShadow: 'none',
              }}
            >
              <Table>
                <TableHead 
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' ? '#212121' : '#fafafa',
                  }}
                >
                  <TableRow>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Entity Name
                    </TableCell>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Department
                    </TableCell>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Risk Score
                    </TableCell>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Status
                    </TableCell>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Last Activity
                    </TableCell>
                    <TableCell className="font-semibold text-black dark:text-white">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTopEntities.map((entity, index) => (
                    <motion.tr
                      key={entity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      component={TableRow}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          className="font-medium text-black dark:text-white"
                        >
                          {entity.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {entity.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box className="flex items-center gap-2">
                          <Typography
                            variant="body2"
                            className="font-bold text-black dark:text-white"
                          >
                            {entity.riskScore}
                          </Typography>
                          <RiskChip 
                            level={getRiskLevel(entity.riskScore)} 
                            score={entity.riskScore}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator status={entity.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          className="text-gray-600 dark:text-gray-400"
                        >
                          {entity.lastActivity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton 
                            size="small"
                            className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Visibility />
                          </IconButton>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </StyledCard>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
