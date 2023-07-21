import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import SignInAndUpPage from 'pages/signInAndUp';
import AnalyticsPage from 'pages/analytics';
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
          <Route path="/" element={<SignInAndUpPage />} />
          <Route 
            path="/home" 
            element={isAuth ? <HomePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/analytics"
            element={isAuth ? <AnalyticsPage /> : <Navigate to="/" />}
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </div>;
}

export default App;
