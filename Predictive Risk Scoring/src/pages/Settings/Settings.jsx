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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security,
  Notifications,
  DataUsage,
  Tune,
  Save,
  Refresh,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import UserProfile from '../../components/UserProfile/UserProfile';

// Mock settings data
const mockSettings = {
  riskScoring: {
    enabled: true,
    updateInterval: 30,
    thresholdHigh: 40,
    thresholdMedium: 25,
    autoRefresh: true,
    mlModel: 'isolation_forest',
  },
  notifications: {
    emailAlerts: true,
    slackIntegration: false,
    highRiskThreshold: 35,
    dailyDigest: true,
    realTimeAlerts: true,
  },
  system: {
    dataRetention: 90,
    backupEnabled: true,
    autoScaling: true,
    performanceMode: 'balanced',
  },
  integrations: {
    siemEnabled: true,
    siemEndpoint: 'https://siem.company.com/api',
    ldapEnabled: true,
    ldapServer: 'ldap://ldap.company.com',
    apiEnabled: true,
    apiKey: 'sk-************************',
  },
};

const Settings = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: currentSettings, isLoading } = useQuery(
    'settings',
    () => new Promise((resolve) => setTimeout(() => resolve(mockSettings), 1000))
  );

  const saveSettingsMutation = useMutation(
    (newSettings) => new Promise((resolve) => {
      setTimeout(() => {
        console.log('Saving settings:', newSettings);
        resolve({ success: true });
      }, 2000);
    }),
    {
      onSuccess: () => {
        toast.success('Settings saved successfully');
        setHasChanges(false);
      },
      onError: () => {
        toast.error('Failed to save settings');
      },
    }
  );

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleReset = () => {
    setSettings(currentSettings);
    setHasChanges(false);
    toast.success('Settings reset to defaults');
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
      </Typography>

      {hasChanges && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have unsaved changes. Please save your settings to apply changes.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Profile */}
        <Grid item xs={12} md={4}>
          <UserProfile />
        </Grid>

        {/* Risk Scoring Configuration */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Scoring</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.riskScoring.enabled}
                    onChange={(e) => handleSettingChange('riskScoring', 'enabled', e.target.checked)}
                  />
                }
                label="Enable Risk Scoring"
              />

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Update Interval (seconds)</Typography>
                <Slider
                  value={settings.riskScoring.updateInterval}
                  onChange={(e, value) => handleSettingChange('riskScoring', 'updateInterval', value)}
                  min={10}
                  max={300}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 60, label: '1m' },
                    { value: 300, label: '5m' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>High Risk Threshold</Typography>
                <Slider
                  value={settings.riskScoring.thresholdHigh}
                  onChange={(e, value) => handleSettingChange('riskScoring', 'thresholdHigh', value)}
                  min={30}
                  max={50}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Medium Risk Threshold</Typography>
                <Slider
                  value={settings.riskScoring.thresholdMedium}
                  onChange={(e, value) => handleSettingChange('riskScoring', 'thresholdMedium', value)}
                  min={15}
                  max={35}
                  valueLabelDisplay="auto"
                />
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>ML Model</InputLabel>
                <Select
                  value={settings.riskScoring.mlModel}
                  onChange={(e) => handleSettingChange('riskScoring', 'mlModel', e.target.value)}
                  label="ML Model"
                >
                  <MenuItem value="isolation_forest">Isolation Forest</MenuItem>
                  <MenuItem value="random_forest">Random Forest</MenuItem>
                  <MenuItem value="autoencoder">Autoencoder</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                  />
                }
                label="Email Alerts"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.slackIntegration}
                    onChange={(e) => handleSettingChange('notifications', 'slackIntegration', e.target.checked)}
                  />
                }
                label="Slack Integration"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.dailyDigest}
                    onChange={(e) => handleSettingChange('notifications', 'dailyDigest', e.target.checked)}
                  />
                }
                label="Daily Digest"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.realTimeAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'realTimeAlerts', e.target.checked)}
                  />
                }
                label="Real-time Alerts"
              />

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>High Risk Alert Threshold</Typography>
                <Slider
                  value={settings.notifications.highRiskThreshold}
                  onChange={(e, value) => handleSettingChange('notifications', 'highRiskThreshold', value)}
                  min={25}
                  max={45}
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Tune sx={{ mr: 1 }} />
                <Typography variant="h6">System</Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Data Retention (days)</Typography>
                <Slider
                  value={settings.system.dataRetention}
                  onChange={(e, value) => handleSettingChange('system', 'dataRetention', value)}
                  min={30}
                  max={365}
                  marks={[
                    { value: 30, label: '30d' },
                    { value: 90, label: '90d' },
                    { value: 365, label: '1y' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.backupEnabled}
                    onChange={(e) => handleSettingChange('system', 'backupEnabled', e.target.checked)}
                  />
                }
                label="Enable Auto Backup"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.autoScaling}
                    onChange={(e) => handleSettingChange('system', 'autoScaling', e.target.checked)}
                  />
                }
                label="Auto Scaling"
              />

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Performance Mode</InputLabel>
                <Select
                  value={settings.system.performanceMode}
                  onChange={(e) => handleSettingChange('system', 'performanceMode', e.target.value)}
                  label="Performance Mode"
                >
                  <MenuItem value="balanced">Balanced</MenuItem>
                  <MenuItem value="performance">High Performance</MenuItem>
                  <MenuItem value="efficiency">Energy Efficient</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Integrations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DataUsage sx={{ mr: 1 }} />
                <Typography variant="h6">Integrations</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations.siemEnabled}
                    onChange={(e) => handleSettingChange('integrations', 'siemEnabled', e.target.checked)}
                  />
                }
                label="SIEM Integration"
              />

              {settings.integrations.siemEnabled && (
                <TextField
                  fullWidth
                  label="SIEM Endpoint"
                  value={settings.integrations.siemEndpoint}
                  onChange={(e) => handleSettingChange('integrations', 'siemEndpoint', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations.ldapEnabled}
                    onChange={(e) => handleSettingChange('integrations', 'ldapEnabled', e.target.checked)}
                  />
                }
                label="LDAP Integration"
              />

              {settings.integrations.ldapEnabled && (
                <TextField
                  fullWidth
                  label="LDAP Server"
                  value={settings.integrations.ldapServer}
                  onChange={(e) => handleSettingChange('integrations', 'ldapServer', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations.apiEnabled}
                    onChange={(e) => handleSettingChange('integrations', 'apiEnabled', e.target.checked)}
                  />
                }
                label="API Access"
              />

              {settings.integrations.apiEnabled && (
                <TextField
                  fullWidth
                  label="API Key"
                  value={settings.integrations.apiKey}
                  onChange={(e) => handleSettingChange('integrations', 'apiKey', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleReset}
                  disabled={saveSettingsMutation.isLoading}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={!hasChanges || saveSettingsMutation.isLoading}
                >
                  {saveSettingsMutation.isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings; 