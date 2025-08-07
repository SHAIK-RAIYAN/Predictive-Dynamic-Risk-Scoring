import React, { useState } from "react";
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
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardActions,
} from "@mui/material";
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
  ExpandMore,
  Psychology,
  Lightbulb,
  Schedule,
  PriorityHigh,
} from "@mui/icons-material";
import { useQuery, useMutation } from "react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  StyledCard,
  MetricCard,
  RiskChip,
  LoadingBar,
  AnimatedButton,
  StatusIndicator,
} from "../../components/UI/index.jsx";
import apiService from "../../services/apiService";

const RiskAssessment = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [entityId, setEntityId] = useState("");
  const [isAssessing, setIsAssessing] = useState(false);
  const [entityNotFound, setEntityNotFound] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentRiskData, setCurrentRiskData] = useState(null);
  const theme = useTheme();

  // Real API queries
  const {
    data: riskData,
    isLoading,
    refetch,
  } = useQuery(
    ["riskAssessment", entityId],
    () => apiService.assessEntityRisk(entityId),
    {
      enabled: !!entityId && !isAssessing, // Don't run query when we're manually assessing
      retry: false,
    }
  );

  const assessRiskMutation = useMutation(
    (entityId) => apiService.assessEntityRisk(entityId),
    {
      onSuccess: async (data) => {
        toast.success("Risk assessment completed successfully");
        setIsAssessing(false);
        setEntityNotFound(false);
        setCurrentRiskData(data); // Store the risk data locally
        
        // Get AI recommendations after successful assessment
        try {
          setIsLoadingAI(true);
          const aiRecs = await apiService.getAIRecommendations(entityId, data);
          setAiRecommendations(aiRecs);
          toast.success("AI recommendations generated");
        } catch (error) {
          console.error("Error getting AI recommendations:", error);
          toast.error("Failed to generate AI recommendations");
        } finally {
          setIsLoadingAI(false);
        }
        
        // Don't call refetch here as it can cause re-renders that clear AI recommendations
        // The data is already available from the mutation
      },
      onError: (error) => {
        toast.error("Risk assessment failed");
        setIsAssessing(false);
      },
    }
  );

  const handleAssessRisk = async () => {
    if (!entityId.trim()) {
      toast.error("Please enter an entity ID");
      return;
    }

    setIsAssessing(true);
    setEntityNotFound(false);
    setAiRecommendations(null);
    setCurrentRiskData(null);

    try {
      // First check if entity exists in Firebase database
      const entities = await apiService.getAllEntities();
      console.log("All entities:", entities);
      console.log("Searching for entity ID:", entityId.trim());

      const entityExists = entities.some(
        (entity) => entity.id === entityId.trim()
      );
      console.log("Entity exists:", entityExists);

      if (!entityExists) {
        setEntityNotFound(true);
        setIsAssessing(false);
        return;
      }

      // If entity exists, proceed with risk assessment
      assessRiskMutation.mutate(entityId.trim());
    } catch (error) {
      console.error("Error in handleAssessRisk:", error);
      toast.error("Failed to validate entity ID");
      setIsAssessing(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 40) return "#ef4444";
    if (score >= 25) return "#f59e0b";
    return "#10b981";
  };

  const getRiskLevel = (score) => {
    if (score >= 40) return "Critical";
    if (score >= 30) return "High";
    if (score >= 20) return "Medium";
    return "Low";
  };

  const getRiskLevelKey = (score) => {
    if (score >= 40) return "critical";
    if (score >= 30) return "high";
    if (score >= 20) return "medium";
    return "low";
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <Typography
          variant="h4"
          component="h1"
          className="font-bold text-black dark:text-white mb-2 tracking-tight">
          Risk Assessment
        </Typography>
        <Typography
          variant="body1"
          className="text-gray-600 dark:text-gray-400">
          Assess security risk for individual entities using AI-powered analysis
        </Typography>
      </motion.div>

      {/* Entity Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}>
        <StyledCard variant="hover" className="p-6 mb-8">
          <CardContent>
            <Typography
              variant="h6"
              className="font-semibold text-black dark:text-white mb-4">
              Entity Assessment
            </Typography>

            <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <TextField
                fullWidth
                label="Entity ID"
                variant="outlined"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="Enter entity ID (e.g., user-john.doe, server-prod-01)"
                className="sm:flex-1"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <AnimatedButton
                variant="contained"
                onClick={handleAssessRisk}
                disabled={isAssessing || !entityId.trim()}
                startIcon={
                  isAssessing ? <CircularProgress size={20} /> : <Assessment />
                }
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                {isAssessing ? "Assessing..." : "Assess Risk"}
              </AnimatedButton>
            </Box>

            {entityId && (
              <Alert severity="info" className="mt-4">
                <Typography variant="body2">
                  Enter any entity ID to get a dynamic risk assessment. The
                  system will generate different risk scores based on the entity
                  ID and provide AI-powered recommendations.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </StyledCard>
      </motion.div>

      {/* Assessment Results */}
      {entityNotFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8">
          <StyledCard variant="hover" className="p-6">
            <CardContent className="text-center">
              <Typography
                variant="h6"
                className="font-semibold text-red-600 mb-4">
                No data on this entity in database
              </Typography>
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-400">
                The entity ID "{entityId}" was not found in our database. Please
                enter a valid entity ID.
              </Typography>
            </CardContent>
          </StyledCard>
        </motion.div>
      )}

      {/* Success Message */}
      {(currentRiskData || riskData) && !entityNotFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8">
          <Alert severity="success" className="mb-4">
            <Typography variant="body2">
              Entity "{(currentRiskData || riskData).entityId}" found and risk assessment completed
              successfully!
            </Typography>
          </Alert>
        </motion.div>
      )}

      {(currentRiskData || riskData) && !entityNotFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8">
          <Grid container spacing={4}>
            {/* Risk Score Card */}
            <Grid item xs={12} md={4}>
              <MetricCard
                title="Overall Risk Score"
                value={(currentRiskData || riskData).overallScore}
                subtitle={`${getRiskLevel((currentRiskData || riskData).overallScore)} Risk Level`}
                icon={
                  <Security
                    className="text-black dark:text-white opacity-80"
                    style={{ fontSize: 40 }}
                  />
                }
                className="card-hover"
              />
            </Grid>

            {/* Risk Level Card */}
            <Grid item xs={12} md={4}>
              <StyledCard variant="hover" className="p-6 h-full">
                <CardContent className="text-center">
                  <Typography
                    variant="h6"
                    className="font-semibold text-black dark:text-white mb-4">
                    Risk Level
                  </Typography>
                  <RiskChip
                    level={getRiskLevelKey((currentRiskData || riskData).overallScore)}
                    score={(currentRiskData || riskData).overallScore}
                  />
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-400 mt-2">
                    {getRiskLevel((currentRiskData || riskData).overallScore)} Risk
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Entity Info Card */}
            <Grid item xs={12} md={4}>
              <StyledCard variant="hover" className="p-6 h-full">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="font-semibold text-black dark:text-white mb-4">
                    Entity Information
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Entity ID:</strong> {(currentRiskData || riskData).entityId}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Name:</strong> {(currentRiskData || riskData).entityName || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Type:</strong> {(currentRiskData || riskData).entityType || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Department:</strong>{" "}
                    {(currentRiskData || riskData).entityDepartment || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Email:</strong> {(currentRiskData || riskData).entityEmail || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>IP Address:</strong> {(currentRiskData || riskData).entityIP || "N/A"}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Assessment Date:</strong>{" "}
                    {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Assessment Time:</strong>{" "}
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Detailed Assessment */}
      {(currentRiskData || riskData) && !entityNotFound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8">
          <StyledCard variant="hover" className="p-6">
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                className="mb-6">
                <Tab label="Risk Factors" icon={<Rule />} />
                <Tab label="Activity History" icon={<Timeline />} />
                <Tab label="AI Recommendations" icon={<Psychology />} />
                <Tab label="Basic Recommendations" icon={<CheckCircle />} />
              </Tabs>

              <AnimatePresence mode="wait">
                {selectedTab === 0 && (
                  <motion.div
                    key="factors"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}>
                    <Typography
                      variant="h6"
                      className="font-semibold text-black dark:text-white mb-4">
                      Risk Factors Analysis
                    </Typography>
                    <Grid container spacing={3}>
                      {(currentRiskData || riskData).factors?.map((factor, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <StyledCard variant="hover" className="p-4">
                            <CardContent>
                              <Box className="flex justify-between items-start mb-2">
                                <Typography
                                  variant="subtitle1"
                                  className="font-semibold text-black dark:text-white">
                                  {factor.name}
                                </Typography>
                                <Chip
                                  label={`${factor.score} pts`}
                                  size="small"
                                  sx={{
                                    backgroundColor: getRiskColor(factor.score),
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="body2"
                                className="text-gray-600 dark:text-gray-400 mb-2">
                                {factor.description}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={(factor.score / 15) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "#374151"
                                      : "#e5e7eb",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: getRiskColor(factor.score),
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                className="text-gray-500 dark:text-gray-400 mt-1 block">
                                Weight: {(factor.weight * 100).toFixed(0)}%
                              </Typography>
                            </CardContent>
                          </StyledCard>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                )}

                {selectedTab === 1 && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}>
                    <Typography
                      variant="h6"
                      className="font-semibold text-black dark:text-white mb-4">
                      Recent Activity History
                    </Typography>
                    <List>
                      {(currentRiskData || riskData).history?.map((event, index) => (
                        <ListItem
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <ListItemIcon>
                            <Warning
                              sx={{ color: getRiskColor(event.score) }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={event.event}
                            secondary={`${event.timestamp} • Risk Score: ${event.score}`}
                            primaryTypographyProps={{
                              className:
                                "font-medium text-black dark:text-white",
                            }}
                            secondaryTypographyProps={{
                              className: "text-gray-600 dark:text-gray-400",
                            }}
                          />
                          <Chip
                            label={`${event.score} pts`}
                            size="small"
                            sx={{
                              backgroundColor: getRiskColor(event.score),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </motion.div>
                )}

                {selectedTab === 2 && (
                  <motion.div
                    key="ai-recommendations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}>
                    <Box className="flex items-center gap-2 mb-4">
                      <Psychology className="text-blue-600" />
                      <Typography
                        variant="h6"
                        className="font-semibold text-black dark:text-white">
                        AI-Powered Security Recommendations
                      </Typography>
                      {isLoadingAI && <CircularProgress size={20} />}
                    </Box>

                    {aiRecommendations ? (
                      <Box className="space-y-6">
                        {/* Summary */}
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <CardContent>
                            <Typography variant="h6" className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                              AI Analysis Summary
                            </Typography>
                            <Typography variant="body2" className="text-blue-700 dark:text-blue-300">
                              {aiRecommendations.summary}
                            </Typography>
                            <Box className="flex gap-4 mt-3">
                              <Chip
                                label={`${aiRecommendations.overallRiskReduction}% Risk Reduction`}
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={`${aiRecommendations.recommendations?.length || 0} Recommendations`}
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
                          Detailed Recommendations
                        </Typography>
                        
                        {aiRecommendations.recommendations?.map((rec, index) => (
                          <Accordion key={index} className="mb-3">
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Box className="flex items-center gap-3 w-full">
                                <Lightbulb className="text-yellow-600" />
                                <Box className="flex-1">
                                  <Typography variant="subtitle1" className="font-semibold text-black dark:text-white">
                                    {rec.title}
                                  </Typography>
                                  <Box className="flex gap-2 mt-1">
                                    <Chip
                                      label={rec.priority}
                                      size="small"
                                      sx={{
                                        backgroundColor: getPriorityColor(rec.priority),
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    />
                                    <Chip
                                      label={rec.effort}
                                      size="small"
                                      sx={{
                                        backgroundColor: getEffortColor(rec.effort),
                                        color: "white",
                                        fontWeight: "bold",
                                      }}
                                    />
                                    <Chip
                                      label={`${rec.riskReduction}% reduction`}
                                      size="small"
                                      color="success"
                                      variant="outlined"
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box className="space-y-4">
                                <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                  {rec.description}
                                </Typography>
                                
                                <Box>
                                  <Typography variant="subtitle2" className="font-semibold text-black dark:text-white mb-2">
                                    Implementation Steps:
                                  </Typography>
                                  <List dense>
                                    {rec.implementationSteps?.map((step, stepIndex) => (
                                      <ListItem key={stepIndex} className="py-1">
                                        <ListItemIcon>
                                          <CheckCircle className="text-green-600" fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={step}
                                          primaryTypographyProps={{
                                            className: "text-sm text-gray-700 dark:text-gray-300",
                                          }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>

                                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="subtitle2" className="font-semibold text-black dark:text-white mb-1">
                                        Timeline
                                      </Typography>
                                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                        {rec.timeline}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="subtitle2" className="font-semibold text-black dark:text-white mb-1">
                                        Category
                                      </Typography>
                                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                        {rec.category}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Box>

                                <Box>
                                  <Typography variant="subtitle2" className="font-semibold text-black dark:text-white mb-1">
                                    Potential Challenges:
                                  </Typography>
                                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                    {rec.challenges}
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography variant="subtitle2" className="font-semibold text-black dark:text-white mb-1">
                                    Expected Benefits:
                                  </Typography>
                                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                                    {rec.benefits}
                                  </Typography>
                                </Box>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}

                        {/* Implementation Priority */}
                        <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <CardContent>
                            <Typography variant="h6" className="font-semibold text-green-800 dark:text-green-200 mb-2">
                              Implementation Priority
                            </Typography>
                            <Typography variant="body2" className="text-green-700 dark:text-green-300">
                              {aiRecommendations.implementationPriority}
                            </Typography>
                          </CardContent>
                        </Card>

                        {/* Monitoring Recommendations */}
                        <Card className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                          <CardContent>
                            <Typography variant="h6" className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                              Monitoring Recommendations
                            </Typography>
                            <Typography variant="body2" className="text-purple-700 dark:text-purple-300">
                              {aiRecommendations.monitoringRecommendations}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    ) : (
                      <Box className="text-center py-8">
                        <Psychology className="text-gray-400 mb-4" style={{ fontSize: 60 }} />
                        <Typography variant="h6" className="text-gray-600 dark:text-gray-400 mb-2">
                          AI Recommendations
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 dark:text-gray-500">
                          {isLoadingAI 
                            ? "Generating AI-powered recommendations..." 
                            : "AI recommendations will be generated after risk assessment"
                          }
                        </Typography>
                      </Box>
                    )}
                  </motion.div>
                )}

                {selectedTab === 3 && (
                  <motion.div
                    key="basic-recommendations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}>
                    <Typography
                      variant="h6"
                      className="font-semibold text-black dark:text-white mb-4">
                      Basic Security Recommendations
                    </Typography>
                    <List>
                      {(currentRiskData || riskData).recommendations?.map(
                        (recommendation, index) => (
                          <ListItem
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <ListItemIcon>
                              <CheckCircle sx={{ color: "#10b981" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={recommendation}
                              primaryTypographyProps={{
                                className: "text-black dark:text-white",
                              }}
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </StyledCard>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8">
          <CircularProgress size={60} />
          <Typography
            variant="h6"
            className="mt-4 text-gray-600 dark:text-gray-400">
            Analyzing entity risk...
          </Typography>
        </motion.div>
      )}

      {/* Error State */}
      {!riskData && !isLoading && entityId && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert severity="warning" className="mt-4">
            <Typography variant="body2">
              Enter an entity ID and click "Assess Risk" to get started with the
              risk assessment.
            </Typography>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RiskAssessment;
