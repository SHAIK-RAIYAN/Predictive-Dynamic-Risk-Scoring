import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Button,
  Alert,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Save,
  Security,
  Notifications,
  DataUsage,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  StyledCard, 
  AnimatedButton,
} from "../../components/UI/index.jsx";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Security Settings
    autoRefresh: true,
    riskThreshold: 30,
    alertNotifications: true,
    dataRetention: 90,
    
    // Data Settings
    dataExport: false,
    backupFrequency: 'daily',
    dataEncryption: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      toast.success('Settings saved successfully!');
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
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
          Settings
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          Configure your risk scoring system preferences
        </Typography>
      </motion.div>

      {/* Success Alert */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            onClose={() => setShowSuccess(false)}
          >
            Settings have been saved successfully!
          </Alert>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StyledCard variant="hover" className="p-6">
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Security className="mr-2 text-black dark:text-white" />
                  <Typography variant="h6" className="font-semibold text-black dark:text-white">
                    Security Settings
                  </Typography>
                </Box>

                <Box className="space-y-4">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoRefresh}
                        onChange={handleSettingChange('autoRefresh')}
                        color="primary"
                      />
                    }
                    label="Auto-refresh dashboard data"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.alertNotifications}
                        onChange={handleSettingChange('alertNotifications')}
                        color="primary"
                      />
                    }
                    label="Alert notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataEncryption}
                        onChange={handleSettingChange('dataEncryption')}
                        color="primary"
                      />
                    }
                    label="Data encryption"
                  />

                  <Box>
                    <Typography variant="body2" className="mb-2 text-black dark:text-white">
                      Risk Threshold
                    </Typography>
                    <TextField
                      type="number"
                      value={settings.riskThreshold}
                      onChange={handleSettingChange('riskThreshold')}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, max: 100 }}
                      fullWidth
                    />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Data Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard variant="hover" className="p-6">
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <DataUsage className="mr-2 text-black dark:text-white" />
                  <Typography variant="h6" className="font-semibold text-black dark:text-white">
                    Data Settings
                  </Typography>
                </Box>

                <Box className="space-y-4">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataExport}
                        onChange={handleSettingChange('dataExport')}
                        color="primary"
                      />
                    }
                    label="Allow data export"
                  />

                  <Box>
                    <Typography variant="body2" className="mb-2 text-black dark:text-white">
                      Data Retention (days)
                    </Typography>
                    <TextField
                      type="number"
                      value={settings.dataRetention}
                      onChange={handleSettingChange('dataRetention')}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1, max: 365 }}
                      fullWidth
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" className="mb-2 text-black dark:text-white">
                      Backup Frequency
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={settings.backupFrequency}
                        onChange={handleSettingChange('backupFrequency')}
                        variant="outlined"
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end mt-6"
      >
        <AnimatedButton
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          startIcon={<Save />}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
};

export default Settings; 