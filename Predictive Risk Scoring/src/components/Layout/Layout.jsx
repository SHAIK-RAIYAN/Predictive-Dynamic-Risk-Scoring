import React, { useState, useContext } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { ColorModeContext } from "../../App";
import { motion, AnimatePresence } from "framer-motion";
import { StatusIndicator } from "../UI/index.jsx";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Risk Assessment", icon: <SecurityIcon />, path: "/risk-assessment" },
  { text: "Entity Management", icon: <PeopleIcon />, path: "/entities" },
  {
    text: "Recommendations",
    icon: <LightbulbIcon />,
    path: "/recommendations",
  },
  { text: "Analytics", icon: <AnalyticsIcon />, path: "/analytics" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white dark:bg-black"
    >
      <Toolbar className="px-6 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Typography
            variant="h6"
            component="div"
            className="font-bold text-black dark:text-white tracking-tight"
          >
            RiskGuard AI
          </Typography>
        </motion.div>
      </Toolbar>
      
      <Box className="p-4">
        <StatusIndicator status="online" size="small" />
      </Box>
      
      <Divider className="border-gray-200 dark:border-gray-700" />
      
      <List className="px-2 py-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <ListItem disablePadding className="mb-1">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                className={`
                  rounded-xl mx-2 transition-all duration-300 hover:scale-105
                  ${location.pathname === item.path 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  borderRadius: '12px',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#f5f5f5' : '#212121',
                    },
                  },
                }}
              >
                <ListItemIcon
                  className={`min-w-0 mr-3 ${
                    location.pathname === item.path
                      ? 'text-white dark:text-black'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  sx={{
                    color: location.pathname === item.path 
                      ? theme.palette.mode === 'dark' ? '#000000' : '#ffffff'
                      : 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  className="font-medium"
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </motion.div>
  );

  return (
    <Box className="flex min-h-screen bg-white dark:bg-black">
      <AppBar
        position="fixed"
        elevation={0}
        className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "background.default",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }}
      >
        <Toolbar className="px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center w-full"
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="mr-4 text-black dark:text-white lg:hidden"
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              component="div"
              className="flex-1 font-semibold text-black dark:text-white tracking-tight"
            >
              Predictive Dynamic Risk Scoring Platform
            </Typography>

            <Box className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label="Live Monitoring"
                  size="small"
                  className="bg-gray-900 text-white dark:bg-gray-100 dark:text-black font-medium animate-pulse"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#f5f5f5' : '#212121',
                    color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                    fontWeight: 500,
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton 
                  className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  sx={{ color: 'text.primary' }}
                >
                  <Badge 
                    badgeContent={4} 
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                      }
                    }}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={colorMode.toggleColorMode}
                  className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  sx={{ color: 'text.primary' }}
                >
                  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton 
                  onClick={handleProfileMenuOpen}
                  className="ml-2"
                >
                  <Avatar 
                    className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black"
                    sx={{ 
                      width: 32, 
                      height: 32,
                      backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                      color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                    }}
                  >
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        className="flex-shrink-0"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          className="lg:hidden"
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          className="hidden lg:block"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        className="flex-1 bg-white dark:bg-black min-h-screen"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="animate-fade-in"
        >
          {children}
        </motion.div>
      </Box>

      <AnimatePresence>
        {Boolean(anchorEl) && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            className="mt-2"
            PaperProps={{
              elevation: 0,
              className: "bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg",
              sx: {
                overflow: "visible",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                filter: theme.palette.mode === 'dark' 
                  ? "drop-shadow(0px 8px 32px rgba(255,255,255,0.1))"
                  : "drop-shadow(0px 8px 32px rgba(0,0,0,0.15))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <MenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-2 my-1">
                <Avatar 
                  className="bg-black dark:bg-white text-white dark:text-black"
                  sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    color: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                  }}
                />
                <Typography className="text-black dark:text-white font-medium">
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-2 my-1">
                <ExitToApp className="text-black dark:text-white mr-2" />
                <Typography className="text-black dark:text-white font-medium">
                  Logout
                </Typography>
              </MenuItem>
            </motion.div>
          </Menu>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Layout;
