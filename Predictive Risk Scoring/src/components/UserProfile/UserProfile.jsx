import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  Security,
  Logout,
  Settings,
  Edit,
  Shield,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { useUser, useClerk } from '@clerk/clerk-react';

const UserProfile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setOpenLogoutDialog(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserRiskLevel = () => {
    // Mock risk level based on user data
    const riskScore = Math.floor(Math.random() * 50) + 1;
    if (riskScore < 15) return { level: 'LOW', color: 'success', score: riskScore };
    if (riskScore < 30) return { level: 'MEDIUM', color: 'warning', score: riskScore };
    return { level: 'HIGH', color: 'error', score: riskScore };
  };

  const riskInfo = getUserRiskLevel();

  const userStats = [
    {
      label: 'Total Logins',
      value: '1,247',
      icon: <Person />,
      color: 'primary'
    },
    {
      label: 'Risk Score',
      value: riskInfo.score,
      icon: <Shield />,
      color: riskInfo.color
    },
    {
      label: 'Alerts',
      value: '3',
      icon: <Warning />,
      color: 'warning'
    },
    {
      label: 'Trend',
      value: '+2.3%',
      icon: <TrendingUp />,
      color: 'success'
    }
  ];

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          {/* User Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              src={user?.imageUrl}
              alt={user?.fullName}
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {user?.fullName || 'User Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
              </Typography>
              <Chip
                label={riskInfo.level}
                color={riskInfo.color}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Tooltip title="Edit Profile">
              <IconButton size="small">
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* User Stats */}
          <Typography variant="h6" gutterBottom>
            Activity Overview
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={3}>
            {userStats.map((stat, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                p={2}
                border={1}
                borderColor="divider"
                borderRadius={1}
              >
                <Box
                  sx={{
                    color: `${stat.color}.main`,
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* User Details */}
          <Typography variant="h6" gutterBottom>
            Profile Details
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Full Name"
                secondary={user?.fullName || 'Not provided'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={user?.primaryEmailAddress?.emailAddress || 'Not provided'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Business color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Department"
                secondary="IT Security"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Role"
                secondary="Security Analyst"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              fullWidth
              size="small"
            >
              Settings
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              fullWidth
              size="small"
              onClick={() => setOpenLogoutDialog(true)}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout? You will need to sign in again to access the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile; 