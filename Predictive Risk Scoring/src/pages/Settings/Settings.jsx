import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security,
  Notifications,
  Storage,
  Speed,
  Refresh,
  Save,
  Close,
  Edit,
  Delete,
  Add,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    autoRefresh: true,
    refreshInterval: 30,
    darkMode: false,
    notifications: true,
    
    // Security Settings
    riskThreshold: 35,
    alertLevel: 'medium',
    autoBlock: false,
    mfaRequired: true,
    
    // ML Settings
    mlEnabled: true,
    modelRetrainInterval: 24,
    anomalyDetection: true,
    predictiveScoring: true,
    
    // System Settings
    dataRetention: 90,
    logLevel: 'info',
    backupEnabled: true,
    performanceMode: 'balanced',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSetting = (setting) => {
    setEditingSetting(setting);
    setEditDialogOpen(true);
  };

  const getPerformanceColor = (mode) => {
    switch (mode) {
      case 'high': return '#ef4444';
      case 'balanced': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#10b981';
      default: return '#6b7280';
    }
  };

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
          System Settings
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          Configure system preferences and security parameters
        </Typography>
      </motion.div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <SettingsIcon className="text-black dark:text-white" />
              <Typography variant="h6" className="font-semibold text-black dark:text-white">
                General Settings
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                    />
                  }
                  label="Auto Refresh Dashboard"
                />
                <Typography variant="caption" className="text-gray-600 dark:text-gray-400 block mt-1">
                  Automatically refresh dashboard data
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="mb-2">
                  Refresh Interval (seconds)
                </Typography>
                <Slider
                  value={settings.refreshInterval}
                  onChange={(e, value) => handleSettingChange('refreshInterval', value)}
                  min={10}
                  max={60}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '60s' },
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <Security className="text-black dark:text-white" />
              <Typography variant="h6" className="font-semibold text-black dark:text-white">
                Security Settings
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="mb-2">
                  Risk Threshold: {settings.riskThreshold}
                </Typography>
                <Slider
                  value={settings.riskThreshold}
                  onChange={(e, value) => handleSettingChange('riskThreshold', value)}
                  min={20}
                  max={50}
                  marks={[
                    { value: 20, label: '20' },
                    { value: 35, label: '35' },
                    { value: 50, label: '50' },
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Level</InputLabel>
                  <Select
                    value={settings.alertLevel}
                    onChange={(e) => handleSettingChange('alertLevel', e.target.value)}
                    label="Alert Level"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBlock}
                      onChange={(e) => handleSettingChange('autoBlock', e.target.checked)}
                    />
                  }
                  label="Auto Block High Risk Entities"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.mfaRequired}
                      onChange={(e) => handleSettingChange('mfaRequired', e.target.checked)}
                    />
                  }
                  label="Require MFA for Admin Access"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* ML Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <Speed className="text-black dark:text-white" />
              <Typography variant="h6" className="font-semibold text-black dark:text-white">
                Machine Learning Settings
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.mlEnabled}
                      onChange={(e) => handleSettingChange('mlEnabled', e.target.checked)}
                    />
                  }
                  label="Enable ML Risk Scoring"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="mb-2">
                  Model Retrain Interval (hours): {settings.modelRetrainInterval}
                </Typography>
                <Slider
                  value={settings.modelRetrainInterval}
                  onChange={(e, value) => handleSettingChange('modelRetrainInterval', value)}
                  min={6}
                  max={72}
                  marks={[
                    { value: 6, label: '6h' },
                    { value: 24, label: '24h' },
                    { value: 72, label: '72h' },
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.anomalyDetection}
                      onChange={(e) => handleSettingChange('anomalyDetection', e.target.checked)}
                    />
                  }
                  label="Anomaly Detection"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.predictiveScoring}
                      onChange={(e) => handleSettingChange('predictiveScoring', e.target.checked)}
                    />
                  }
                  label="Predictive Risk Scoring"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <Storage className="text-black dark:text-white" />
              <Typography variant="h6" className="font-semibold text-black dark:text-white">
                System Settings
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" className="mb-2">
                  Data Retention (days): {settings.dataRetention}
                </Typography>
                <Slider
                  value={settings.dataRetention}
                  onChange={(e, value) => handleSettingChange('dataRetention', value)}
                  min={30}
                  max={365}
                  marks={[
                    { value: 30, label: '30d' },
                    { value: 90, label: '90d' },
                    { value: 365, label: '365d' },
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={settings.logLevel}
                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                    label="Log Level"
                  >
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warn">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="debug">Debug</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backupEnabled}
                      onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Automatic Backups"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Performance Mode</InputLabel>
                  <Select
                    value={settings.performanceMode}
                    onChange={(e) => handleSettingChange('performanceMode', e.target.value)}
                    label="Performance Mode"
                  >
                    <MenuItem value="low">Low (Battery Saver)</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="high">High Performance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" className="font-semibold text-black dark:text-white mb-4">
              System Status
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box className="text-center p-3 bg-green-50 dark:bg-green-900 rounded">
                  <CheckCircle className="text-green-600 dark:text-green-400 text-2xl mb-2" />
                  <Typography variant="body2" className="font-medium">
                    ML Models
                  </Typography>
                  <Typography variant="caption" className="text-green-600 dark:text-green-400">
                    Active
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded">
                  <CheckCircle className="text-blue-600 dark:text-blue-400 text-2xl mb-2" />
                  <Typography variant="body2" className="font-medium">
                    Database
                  </Typography>
                  <Typography variant="caption" className="text-blue-600 dark:text-blue-400">
                    Connected
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box className="text-center p-3 bg-orange-50 dark:bg-orange-900 rounded">
                  <Warning className="text-orange-600 dark:text-orange-400 text-2xl mb-2" />
                  <Typography variant="body2" className="font-medium">
                    API Services
                  </Typography>
                  <Typography variant="caption" className="text-orange-600 dark:text-orange-400">
                    Warning
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box className="text-center p-3 bg-red-50 dark:bg-red-900 rounded">
                  <Error className="text-red-600 dark:text-red-400 text-2xl mb-2" />
                  <Typography variant="body2" className="font-medium">
                    Backup System
                  </Typography>
                  <Typography variant="caption" className="text-red-600 dark:text-red-400">
                    Failed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end"
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </motion.div>

      {/* Edit Setting Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Edit Setting
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {editingSetting && (
            <Box className="space-y-4">
              <Typography variant="body1" className="font-medium">
                {editingSetting.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                {editingSetting.description}
              </Typography>
              <TextField
                fullWidth
                label="Value"
                defaultValue={editingSetting.value}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              toast.success('Setting updated');
              setEditDialogOpen(false);
            }}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Settings; 