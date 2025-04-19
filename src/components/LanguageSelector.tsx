import CheckIcon from "@mui/icons-material/Check"
import LanguageIcon from "@mui/icons-material/Language"
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next"

import { getFlagUrl } from "../utils/countries"

export interface Language {
  code: string
  name: string
}

const languages: Language[] = [
  { code: "us", name: "English" },
  { code: "es", name: "Español" },
]

export const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0]

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    handleClose()
  }

  return (
    <Box>
      <Button
        aria-label="language-selector-button"
        id="language-selector-button"
        aria-controls={open ? "language-selector-button" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          color: "white",
          textTransform: "none",
          minWidth: { xs: "40px", md: "auto" },
          px: { xs: 1, md: 2 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <LanguageIcon />
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {currentLanguage.name}
          </Typography>
          <Box
            component="img"
            height={20}
            width={20}
            alt="flag-image"
            src={getFlagUrl(currentLanguage.code.toUpperCase())}
          />
        </Stack>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-selector-button",
          sx: {
            bgcolor: "#191527",
            paddingTop: 0,
          },
        }}
        slotProps={{ paper: { sx: { width: 242, borderRadius: 3 } } }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            selected={language.code === i18n.language}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.5,
            }}
          >
            <Box
              component="img"
              height={20}
              width={20}
              alt="flag-image"
              src={getFlagUrl(language.code.toUpperCase())}
            />
            <ListItemText primary={language.name} />
            {language.code === i18n.language && (
              <ListItemIcon sx={{ minWidth: "auto", color: "success.main" }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
