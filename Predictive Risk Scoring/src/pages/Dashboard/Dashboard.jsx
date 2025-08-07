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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Close,
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
import LiveMonitoring from "../../components/LiveMonitoring/LiveMonitoring";
import apiService from "../../services/apiService";

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const theme = useTheme();

  // Real API queries
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useQuery(
    "dashboardStats",
    () => apiService.getDashboardStats(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const {
    data: trendData,
    isLoading: trendLoading,
  } = useQuery(
    "riskTrend",
    () => apiService.getRiskTrend(),
    {
      refetchInterval: 60000, // Refresh every minute
    }
  );

  const {
    data: topEntities,
    isLoading: entitiesLoading,
  } = useQuery(
    "topEntities",
    () => apiService.getTopRiskEntities(),
    {
      refetchInterval: 45000, // Refresh every 45 seconds
    }
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchDashboard();
      toast.success("Dashboard refreshed successfully", {
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        },
      });
    } catch (error) {
      toast.error("Failed to refresh dashboard", {
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        },
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = async (entity) => {
    try {
      const assessment = await apiService.assessEntityRisk(entity.name);
      setSelectedEntity({ ...entity, assessment });
      setDetailsDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load entity details", {
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
        },
      });
    }
  };

  const getRiskColor = (score) => {
    if (score >= 40) return '#ef4444'; // Red for critical/high risk
    if (score >= 25) return '#f59e0b'; // Orange for medium risk
    return '#10b981'; // Green for low risk
  };

  const getRiskColorThemed = (score) => {
    if (score >= 40) return theme.palette.mode === 'dark' ? '#fca5a5' : '#dc2626';
    if (score >= 25) return theme.palette.mode === 'dark' ? '#fbbf24' : '#d97706';
    return theme.palette.mode === 'dark' ? '#6ee7b7' : '#059669';
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

  if (dashboardLoading || trendLoading || entitiesLoading) {
    return (
      <Box className="w-full p-8">
        <LoadingBar className="rounded-lg" />
        <Typography className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  const riskDistributionData = dashboardData ? [
    { name: "Low Risk", value: dashboardData.lowRiskEntities, color: "#10b981" },
    { name: "Medium Risk", value: dashboardData.mediumRiskEntities, color: "#f59e0b" },
    { name: "High Risk", value: dashboardData.highRiskEntities, color: "#ef4444" },
  ] : [];

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
              <span className="font-bold">High Risk Alert:</span> {dashboardData?.highRiskEntities || 0} entities have exceeded risk threshold.
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
              value={dashboardData?.overallRiskScore || 0}
              subtitle={`${dashboardData?.riskTrend === "increasing" ? "+3.2%" : "-1.8%"} from yesterday`}
              icon={<Shield className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              trend={
                dashboardData?.riskTrend === "increasing" ? (
                  <TrendingUp className="text-red-500" />
                ) : (
                  <TrendingDown className="text-green-500" />
                )
              }
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Entities"
              value={(dashboardData?.totalEntities || 0).toLocaleString()}
              subtitle="Monitored assets"
              icon={<MonitorHeart className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="High Risk Entities"
              value={dashboardData?.highRiskEntities || 0}
              subtitle="Require immediate attention"
              icon={<Warning className="text-black dark:text-white opacity-80" style={{ fontSize: 40 }} />}
              className="card-hover"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Recent Alerts"
              value={dashboardData?.recentAlerts || 0}
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
          <Grid item xs={12} md={6}>
            <StyledCard variant="hover" className="p-6">
              <CardContent>
                <Typography 
                  variant="h6" 
                  className="font-semibold text-black dark:text-white mb-6"
                >
                  Risk Score Trend (24 Hours)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData || []}>
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
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ 
                        fill: "#3b82f6", 
                        strokeWidth: 2, 
                        r: 5,
                        stroke: "#ffffff"
                      }}
                      activeDot={{ 
                        r: 8, 
                        fill: "#1d4ed8",
                        stroke: "#ffffff",
                        strokeWidth: 2
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Live Monitoring */}
          <Grid item xs={12} md={6}>
            <LiveMonitoring />
          </Grid>
        </Grid>
      </motion.div>

      {/* Risk Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Grid container spacing={3} className="mb-8">
          <Grid item xs={12}>
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
                      data={riskDistributionData}
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
                      {riskDistributionData.map((entry, index) => (
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
                  {topEntities?.map((entity, index) => (
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
                            onClick={() => handleViewDetails(entity)}
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

      {/* Entity Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Entity Details: {selectedEntity?.name}
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEntity?.assessment && (
            <Box className="space-y-4">
              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Risk Assessment
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Risk Score:</strong> {selectedEntity.assessment.overallScore}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Risk Level:</strong> {selectedEntity.assessment.riskLevel}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Department:</strong> {selectedEntity.department}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Last Activity:</strong> {selectedEntity.lastActivity}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Status:</strong> {selectedEntity.status}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Risk Factors
                </Typography>
                {selectedEntity.assessment.factors?.map((factor, index) => (
                  <Box key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography variant="body2" className="font-medium">
                      {factor.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                      {factor.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Recommendations
                </Typography>
                {selectedEntity.assessment.recommendations?.map((rec, index) => (
                  <Typography key={index} variant="body2" className="mb-1">
                    • {rec}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Dashboard;
