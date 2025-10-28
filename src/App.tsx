/// <reference types="@rsbuild/core/types" />

import { ContactPage } from '@mui/icons-material';
import {
  Box,
  CssBaseline,
  createTheme,
  Stack,
  ThemeProvider,
} from '@mui/material';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { I18nextProvider } from 'react-i18next';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Footer from './components/Footer';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import Navbar from './components/Navbar';
import { AudioProvider } from './context/AudioContext';
import { IdentityContextProvider } from './context/Identity';
import { _i18n } from './i18n';
import { AboutPage } from './pages/AboutPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { BeatmapPage } from './pages/BeatmapPage';
import { BeatmapsetsPage } from './pages/BeatmapsetsPage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ScorePage } from './pages/ScorePage';
import { SupportPage } from './pages/SupportPage';
import { TeamPage } from './pages/TeamPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { UserFriendsPage } from './pages/UserFriendsPage';
import { UserSettingsPage } from './pages/UserSettingsPage';

const AppLayout = () => {
  return (
    <AudioProvider>
      <Stack
        direction="column"
        justifyContent="space-between"
        minHeight="100vh"
        position="relative"
      >
        <Navbar />
        <Box flexGrow={1}>
          <Outlet />
        </Box>
        <Footer />
        <GlobalAudioPlayer />
      </Stack>
    </AudioProvider>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/u/:userId" element={<ProfilePage />} />
      <Route path="/u/:userId/settings" element={<UserSettingsPage />} />
      <Route path="/u/:userId/friends" element={<UserFriendsPage />} />
      <Route path="/b/:beatmapId/:mode?/:type?" element={<BeatmapPage />} />
      <Route path="/scores/:scoreId" element={<ScorePage />} />
      <Route path="/admin-panel" element={<AdminPanelPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/beatmapsets" element={<BeatmapsetsPage />} />
    </Route>,
  ),
);

function fallbackRender({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

export default function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#2c97fb',
          },
          secondary: {
            main: '#ef43fe',
          },
          background: {
            default: '#110E1B',
          },
        },
        typography: {
          fontFamily: 'Nunito',
        },
      }),
    [],
  );

  return (
    <React.StrictMode>
      <I18nextProvider i18n={_i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary fallbackRender={fallbackRender}>
            <IdentityContextProvider>
              <RouterProvider router={router} />
            </IdentityContextProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
}
