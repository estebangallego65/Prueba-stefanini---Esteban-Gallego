import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//MUI
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

//colores de interfaz
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary:    { main: "#e55800" },
    secondary:  { main: "#7c4dff" },
    background: { default: "#323232", paper: "#13131a" },
    text:       { primary: "#e2e2f0", secondary: "#9898b8" },
  },
  typography: {
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #2a2a3a",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);