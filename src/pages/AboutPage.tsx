import { Box, Container, Divider, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

import { AboutFeatureCard } from "../components/about/AboutFeatureCard"
import { AboutSectionCard } from "../components/about/AboutSectionCard"
import LeaderboardBanner from "../components/images/banners/leaderboard_banner.svg"
import ScoreAndPPLeaderboard from "../components/images/features/score_and_pp_lb.png"
import { AboutIcon } from "../components/images/logos/icons/AboutIcon"

export const AboutPage = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Box
        height={211}
        pt={{ xs: 0, sm: 10 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `
            linear-gradient(0deg, rgba(21, 18, 34, 0) 0%, rgba(21, 18, 34, 0.9) 100%),
            url(${LeaderboardBanner})
          `,
        }}
      >
        <Container sx={{ height: "100%" }}>
          <Stack
            px={3}
            height="100%"
            direction={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "space-around", sm: "space-between" }}
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={3}>
              <Box width={70} height={70}>
                <AboutIcon />
              </Box>
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{ bgcolor: "#ffffff", opacity: "20%" }}
              />
              <Typography
                variant="body1"
                fontSize={25}
                fontWeight={300}
                color="white"
              >
                {t("about.title")}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box width="100%" color="#FFFFFF80">
        <Container>
          <Stack spacing={4} py={4}>
            <AboutSectionCard
              title={t("about.what_makes_us_special")}
              content={t("about.what_makes_us_special_content")}
            />

            <AboutSectionCard
              title={t("about.pp_for_relax")}
              content={t("about.pp_for_relax_content", {
                appName: process.env.REACT_APP_APP_NAME,
              })}
              align="right"
            />

            <AboutSectionCard
              title={t("about.free_osudirect")}
              content={t("about.free_osudirect_content")}
            />
          </Stack>
        </Container>
      </Box>

      <Container sx={{ backgroundColor: "#191527" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            py: 4,
          }}
        >
          <AboutFeatureCard title={t("about.features.pp_or_score")} icon="📊">
            <Box
              pt={{ xs: 50, sm: 50 }}
              sx={{
                backgroundSize: "cover",
                backgroundImage: `url(${ScoreAndPPLeaderboard})`,
                backgroundPosition: "center",
              }}
            ></Box>
          </AboutFeatureCard>

          <AboutFeatureCard
            title={t("about.features.beatmap_submission")}
            icon="⬆️"
          >
            TODO
          </AboutFeatureCard>

          <AboutFeatureCard title="TODO" icon="⏱️">
            TODO
          </AboutFeatureCard>
        </Box>
      </Container>
    </Box>
  )
}
