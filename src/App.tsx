import { ContactPage } from "@mui/icons-material"
import {
  Box,
  createTheme,
  CssBaseline,
  Stack,
  ThemeProvider,
} from "@mui/material"
import React from "react"
import { I18nextProvider } from "react-i18next"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom"

import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { IdentityContextProvider } from "./context/Identity"
import { _i18n } from "./i18n"
import { AboutPage } from "./pages/AboutPage"
import { BeatmapPage } from "./pages/BeatmapPage"
import { HomePage } from "./pages/HomePage"
import { LeaderboardPage } from "./pages/LeaderboardPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { ProfilePage } from "./pages/ProfilePage"
import { ScorePage } from "./pages/ScorePage"
import { SupportPage } from "./pages/SupportPage"
import { TeamPage } from "./pages/TeamPage"
import { TermsOfServicePage } from "./pages/TermsOfServicePage"
import { UserFriendsPage } from "./pages/UserFriendsPage"
import { UserSettingsPage } from "./pages/UserSettingsPage"

const AppLayout = () => {
  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        minHeight="100vh"
      >
        <Navbar />
        <Box flexGrow={1}>
          <Outlet />
        </Box>
        <Footer />
      </Stack>
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/u/:userId" element={<ProfilePage />} />
      <Route path="/u/:userId/settings" element={<UserSettingsPage />} />
      <Route path="/u/:userId/friends" element={<UserFriendsPage />} />
      <Route path="/b/:beatmapId" element={<BeatmapPage />} />
      <Route path="/scores/:scoreId" element={<ScorePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Route>
  )
)

export default function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          primary: {
            main: "#2c97fb",
          },
          secondary: {
            main: "#ef43fe",
          },
          background: {
            default: "#110E1B",
          },
        },
        typography: {
          fontFamily: "Nunito",
        },
      }),
    []
  )

  return (
    <React.StrictMode>
      <I18nextProvider i18n={_i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <IdentityContextProvider>
            <RouterProvider router={router} />
          </IdentityContextProvider>
        </ThemeProvider>
      </I18nextProvider>
    </React.StrictMode>
  )
}
