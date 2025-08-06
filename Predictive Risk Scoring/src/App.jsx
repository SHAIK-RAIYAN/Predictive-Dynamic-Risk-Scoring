import React, { useMemo, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { Toaster } from "react-hot-toast";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { clerkConfig } from './lib/clerk';

// Components
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import RiskAssessment from "./pages/RiskAssessment/RiskAssessment";
import EntityManagement from "./pages/EntityManagement/EntityManagement";
import Recommendations from "./pages/Recommendations/Recommendations";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";

// Theme context for toggling
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "dark" ? "#ffffff" : "#000000",
      light: mode === "dark" ? "#f5f5f5" : "#424242",
      dark: mode === "dark" ? "#e0e0e0" : "#212121",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    secondary: {
      main: mode === "dark" ? "#9e9e9e" : "#757575",
      light: mode === "dark" ? "#e0e0e0" : "#bdbdbd",
      dark: mode === "dark" ? "#616161" : "#424242",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    background: {
      default: mode === "dark" ? "#000000" : "#ffffff",
      paper: mode === "dark" ? "#212121" : "#fafafa",
    },
    text: {
      primary: mode === "dark" ? "#ffffff" : "#000000",
      secondary: mode === "dark" ? "#bdbdbd" : "#616161",
      disabled: mode === "dark" ? "#757575" : "#9e9e9e",
    },
    divider: mode === "dark" ? "#424242" : "#e0e0e0",
    error: {
      main: mode === "dark" ? "#ffffff" : "#000000",
      light: mode === "dark" ? "#f5f5f5" : "#424242",
      dark: mode === "dark" ? "#e0e0e0" : "#212121",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    warning: {
      main: mode === "dark" ? "#e0e0e0" : "#616161",
      light: mode === "dark" ? "#f5f5f5" : "#9e9e9e",
      dark: mode === "dark" ? "#bdbdbd" : "#424242",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    success: {
      main: mode === "dark" ? "#bdbdbd" : "#757575",
      light: mode === "dark" ? "#e0e0e0" : "#bdbdbd",
      dark: mode === "dark" ? "#9e9e9e" : "#424242",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    info: {
      main: mode === "dark" ? "#9e9e9e" : "#757575",
      light: mode === "dark" ? "#e0e0e0" : "#bdbdbd",
      dark: mode === "dark" ? "#757575" : "#424242",
      contrastText: mode === "dark" ? "#000000" : "#ffffff",
    },
    // Custom risk colors in grayscale
    risk: {
      low: mode === "dark" ? "#e0e0e0" : "#f5f5f5",
      medium: mode === "dark" ? "#9e9e9e" : "#757575",
      high: mode === "dark" ? "#616161" : "#424242",
      critical: mode === "dark" ? "#212121" : "#000000",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.015em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      letterSpacing: '-0.015em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    mode === "dark" 
      ? '0px 2px 1px -1px rgba(255,255,255,0.02),0px 1px 1px 0px rgba(255,255,255,0.04),0px 1px 3px 0px rgba(255,255,255,0.12)'
      : '0px 2px 1px -1px rgba(0,0,0,0.02),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.12)',
    mode === "dark"
      ? '0px 3px 1px -2px rgba(255,255,255,0.02),0px 2px 2px 0px rgba(255,255,255,0.04),0px 1px 5px 0px rgba(255,255,255,0.12)'
      : '0px 3px 1px -2px rgba(0,0,0,0.02),0px 2px 2px 0px rgba(0,0,0,0.04),0px 1px 5px 0px rgba(0,0,0,0.12)',
    // Add more shadows as needed...
    ...Array(22).fill(mode === "dark" 
      ? '0px 8px 10px -5px rgba(255,255,255,0.02),0px 16px 24px 2px rgba(255,255,255,0.04),0px 6px 30px 5px rgba(255,255,255,0.12)'
      : '0px 8px 10px -5px rgba(0,0,0,0.02),0px 16px 24px 2px rgba(0,0,0,0.04),0px 6px 30px 5px rgba(0,0,0,0.12)'
    )
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "dark" ? "#212121" : "#ffffff",
          border: mode === "dark" ? "1px solid #424242" : "1px solid #e0e0e0",
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === "dark" 
              ? '0 20px 40px rgba(255,255,255,0.1)'
              : '0 20px 40px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 500,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: mode === "dark" ? "#ffffff" : "#000000",
          color: mode === "dark" ? "#000000" : "#ffffff",
          '&:hover': {
            backgroundColor: mode === "dark" ? "#f5f5f5" : "#212121",
          },
        },
        outlined: {
          borderColor: mode === "dark" ? "#ffffff" : "#000000",
          color: mode === "dark" ? "#ffffff" : "#000000",
          '&:hover': {
            backgroundColor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#000000" : "#ffffff",
          color: mode === "dark" ? "#ffffff" : "#000000",
          borderBottom: mode === "dark" ? "1px solid #424242" : "1px solid #e0e0e0",
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === "dark" ? "#000000" : "#ffffff",
          borderRight: mode === "dark" ? "1px solid #424242" : "1px solid #e0e0e0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "dark" ? "#212121" : "#fafafa",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: mode === "dark" ? "#424242" : "#e0e0e0",
        },
        head: {
          fontWeight: 600,
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardWarning: {
          backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
        standardError: {
          backgroundColor: mode === "dark" ? "#212121" : "#f5f5f5",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
        standardSuccess: {
          backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
        standardInfo: {
          backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected App Component
const AppContent = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3}>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
            <Router>
              <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <SignedIn>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route
                        path="/risk-assessment"
                        element={<RiskAssessment />}
                      />
                      <Route path="/entities" element={<EntityManagement />} />
                      <Route
                        path="/recommendations"
                        element={<Recommendations />}
                      />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/sign-in/*" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/sign-up/*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </Box>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ColorModeContext.Provider>
  );
};

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
    >
      <AppContent />
    </ClerkProvider>
  );
}

export default App;
