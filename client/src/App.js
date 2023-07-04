import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from 'react-redux';

function App() {
  const theme = createTheme(themeSettings());
  const isAuth = Boolean(useSelector((state) => state.token));

  return <div className='app'>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/home" 
            element={<HomePage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </div>;
}

export default App;
