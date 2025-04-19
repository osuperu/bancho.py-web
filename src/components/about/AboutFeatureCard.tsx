import { Box, Typography } from "@mui/material"

export const AboutFeatureCard = ({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children?: React.ReactNode
}) => {
  return (
    <Box
      sx={{
        background: "rgba(32, 28, 44, 0.95)",
        borderRadius: 2,
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography gutterBottom variant="h5" color="white" fontWeight="bold">
        {icon} {title}
      </Typography>
      <Box
        sx={{
          borderRadius: 1,
          p: 2,
          mt: 2,
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
