import React, { useMemo, useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { Toaster } from "react-hot-toast";

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
      main: mode === "dark" ? "#2196f3" : "#1976d2",
    },
    secondary: {
      main: mode === "dark" ? "#f50057" : "#d32f2f",
    },
    background: {
      default: mode === "dark" ? "#0a1929" : "#f5f5f5",
      paper: mode === "dark" ? "#132f4c" : "#fff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: "#2196f3",
    },
    risk: {
      low: "#4caf50",
      medium: "#ff9800",
      high: "#f44336",
      info: "#2196f3",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "dark" ? "#132f4c" : "#fff",
          border: mode === "dark" ? "1px solid #173a5e" : "1px solid #e0e0e0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
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

function App() {
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
                  </Routes>
                </Layout>
              </Box>
            </Router>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
