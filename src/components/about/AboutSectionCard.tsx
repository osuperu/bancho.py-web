import { Box, Grid, GridLegacy, Typography } from "@mui/material"

export const AboutSectionCard = ({
  title,
  content,
  align = "left",
  image,
}: {
  title: string
  content: string
  align?: "left" | "right"
  image?: {
    src: string
    alt?: string
  }
}) => {
  return (
    <Box
      sx={{
        background: "rgba(32, 28, 44, 0.95)",
        borderRadius: 2,
        p: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={3}>
        <GridLegacy
          item
          xs={12}
          md={image ? 7 : 12}
          sx={{
            order: { xs: 2, md: align === "left" ? 1 : 2 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            gutterBottom
            variant="h3"
            color="white"
            fontWeight="bold"
            sx={{ mb: 3, textAlign: align }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="white"
            sx={{
              opacity: 0.9,
              lineHeight: 1.6,
              fontSize: "1.1rem",
              textAlign: align,
            }}
          >
            {content}
          </Typography>
        </GridLegacy>
        {image && (
          <GridLegacy
            item
            xs={12}
            md={5}
            sx={{
              order: { xs: 1, md: align === "left" ? 2 : 1 },
              display: "flex",
              alignItems: "center",
              justifyContent: align === "left" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              component="img"
              src={image.src}
              alt={image.alt || title}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
                objectFit: "contain",
              }}
            />
          </GridLegacy>
        )}
      </Grid>
    </Box>
  )
}
