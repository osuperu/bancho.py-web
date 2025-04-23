import { Box, Container, GridLegacy, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  fetchTotalPPEarned,
  fetchTotalScoresSet,
} from "../adapters/bpy-api/scores"
import { fetchTotalRegisteredUsers } from "../adapters/bpy-api/user"
import { HomepageScoresCarousel } from "../components/homepage/HomepageScoresCarousel"
import { HomepageStatDisplay } from "../components/homepage/HomepageStatDisplay"
import HomepageBanner from "../components/images/banners/homepage_banner.svg"
import { HomepagePPIcon } from "../components/images/icons/HomepagePPIcon"
import { HomepageScoresIcon } from "../components/images/icons/HomepageScoresIcon"
import { HomepageUsersIcon } from "../components/images/icons/HomepageUsersIcon"
import { WhiteoutOsuPeruLogo } from "../components/images/logos/WhiteoutOsuPeruLogo"
import { PageTitle } from "../components/PageTitle"

export const HomePage = () => {
  const { t } = useTranslation()

  const [totalPPEarned, setTotalPPEarned] = useState(0)
  const [totalScoresSet, setTotalScoresSet] = useState(0)
  const [totalUsersRegistered, setTotalUsersRegistered] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const totalPPEarned = await fetchTotalPPEarned()
        setTotalPPEarned(totalPPEarned)
      } catch (error) {
        console.error("Failed to fetch total PP earned:", error)
        return
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const totalScoresSet = await fetchTotalScoresSet()
        setTotalScoresSet(totalScoresSet)
      } catch (error) {
        console.error("Failed to fetch total scores set:", error)
        return
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const totalUsersRegistered = await fetchTotalRegisteredUsers()
        setTotalUsersRegistered(totalUsersRegistered)
      } catch (error) {
        console.error("Failed to fetch total users registered:", error)
        return
      }
    })()
  }, [])

  return (
    <Box>
      <PageTitle title={`osu!Peru - ${t("web_titles.home")}`} />
      <Stack direction="column" justifyContent="space-between" spacing={2}>
        <Box
          py={{ xs: 4, sm: 22 }} /** TODO: sm default is 16 */
          sx={{
            backgroundImage: `url(${HomepageBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          {/* TODO: figure out how to scale this */}
          {/* <Box
            position="absolute"
            zIndex={0}
            pt={{ sm: 10 }}
            top={{ sm: 0 }}
            left={0}
            width="100%"
            height="calc(600px - 10%)"
            sx={{
              opacity: { xs: 0.5, sm: 0.25 },
              pointerEvents: "none",
            }}
          >
            <HomepageTextOutline />
          </Box> */}
          <Container>
            <GridLegacy
              container
              direction={{ xs: "column", sm: "row-reverse" }}
              spacing={{ xs: 2, sm: 22 }} /** TODO: sm default is 16 */
              justifyContent="center"
            >
              <GridLegacy item xs={6}>
                <Stack
                  direction="column"
                  alignItems={{ xs: "center", sm: "flex-end" }}
                  spacing={3}
                >
                  <Box width={315} height={68}>
                    <WhiteoutOsuPeruLogo />
                  </Box>
                  <Typography textAlign={{ xs: "center", sm: "right" }}>
                    {process.env.REACT_APP_APP_NAME} {t("home.welcome")}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {/*<Link to="/register">
                      <Button
                        variant="contained"
                        sx={{
                          color: "black",
                          bgcolor: "white",
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                        }}
                      >
                        <Typography variant="body1">
                          {t("home.get_started")}
                        </Typography>
                      </Button>
                    </Link>*/}
                    {/* TODO: hook this up to open the navbar auth menu */}
                    {/* <Link to="/register">
                      <Button
                        variant="contained"
                        sx={{
                          color: "white",
                          bgcolor: "rgba(21, 18, 34, 0.2)",
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                        }}
                      >
                        <Typography variant="body1">Sign up</Typography>
                      </Button>
                    </Link> */}
                  </Stack>
                </Stack>
              </GridLegacy>
              <GridLegacy item xs={6}>
                <Stack direction="column">
                  <Stack direction="row" width="100%" spacing={2}>
                    <HomepageStatDisplay
                      title={t("home.pp_earned")}
                      value={totalPPEarned}
                      icon={<HomepagePPIcon />}
                      lessRoundedCorner="bottom-right"
                      shadowDirection="bottom-left"
                      justifyText="bottom"
                      textAlign="left"
                    />
                  </Stack>
                  <Stack
                    direction="row-reverse"
                    width="100%"
                    mt={-1}
                    spacing={2}
                    justifyContent="flex-start"
                  >
                    <HomepageStatDisplay
                      title={t("home.scores_set")}
                      value={totalScoresSet}
                      icon={<HomepageScoresIcon />}
                      lessRoundedCorner="bottom-left"
                      shadowDirection="bottom-right"
                      justifyText="bottom"
                      textAlign="right"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    width="100%"
                    mt={5}
                    spacing={2}
                    justifyContent="center"
                  >
                    <HomepageStatDisplay
                      title={t("home.registered_users")}
                      value={totalUsersRegistered}
                      icon={<HomepageUsersIcon />}
                      lessRoundedCorner="top-right"
                      shadowDirection="bottom-left"
                      justifyText="top"
                      textAlign="left"
                    />
                  </Stack>
                </Stack>
              </GridLegacy>
            </GridLegacy>
          </Container>
        </Box>
        <HomepageScoresCarousel />
      </Stack>
    </Box>
  )
}
