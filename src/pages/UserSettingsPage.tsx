import SettingsIcon from "@mui/icons-material/Settings"
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { FormEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import {
  updateEmail,
  updatePassword,
  updateUsername,
} from "../adapters/bpy-api/user"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { type Identity, useIdentityContext } from "../context/Identity"
import { UserPrivileges } from "../privileges"

const ChangeUsernameButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
  identity,
  setIdentity,
  isSupporter,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
  identity: Identity | null
  setIdentity: (identity: Identity | null) => void
  isSupporter: boolean
}) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Tooltip title={t("user_settings.supporter_only_feature")}>
        <Box display="flex" justifyContent="center">
          <Button
            disabled={!isSupporter}
            onClick={handleClickOpen}
            sx={{ color: "white", textTransform: "none" }}
          >
            <Typography variant="body1">
              {t("user_settings.change_display_name")}
            </Typography>
          </Button>
        </Box>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const currentPassword = formJson["current-password"].toString()
            const newUsername = formJson["new-username"].toString()
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateUsername(userId, currentPassword, newUsername)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            if (identity !== null) {
              setIdentity({ ...identity, username: newUsername })
            }

            handleClose()
          },
        }}
      >
        <DialogTitle>{t("user_settings.change_display_name")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("user_settings.supporters_can_use_this_feature")}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id="current-password"
            name="current-password"
            label={t("user_settings.current_password")}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="username"
            margin="dense"
            id="new-username"
            name="new-username"
            label={t("user_settings.new_display_name")}
            type="text"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("user_settings.cancel")}</Button>
          <Button type="submit">{t("user_settings.save")}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ChangePasswordButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
}) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: "white", textTransform: "none" }}
      >
        <Typography variant="body1">
          {t("user_settings.change_password")}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const currentPassword = formJson["current-password"].toString()
            const newPassword = formJson["new-password"].toString()

            console.log(currentPassword, newPassword)
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updatePassword(userId, currentPassword, newPassword)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            handleClose()
          },
        }}
      >
        <DialogTitle>{t("user_settings.change_password")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("user_settings.change_password_here")}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id="current-password"
            name="current-password"
            label={t("user_settings.current_password")}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="new-password"
            margin="dense"
            id="new-password"
            name="new-password"
            label={t("user_settings.new_password")}
            type="password"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("user_settings.cancel")}</Button>
          <Button type="submit">{t("user_settings.save")}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ChangeEmailAddressButton = ({
  userId,
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  userId: number
  setSnackbarOpen: (open: boolean) => void
  setSnackbarMessage: (message: string) => void
}) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: "white", textTransform: "none" }}
      >
        <Typography variant="body1">
          {t("user_settings.change_email_address")}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const currentPassword = formJson["current-password"].toString()
            const newEmailAddress = formJson["new-email-address"].toString()
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateEmail(userId, currentPassword, newEmailAddress)
            } catch (e: any) {
              setSnackbarOpen(true)
              setSnackbarMessage(e.message)
              return
            }
            handleClose()
          },
        }}
      >
        <DialogTitle>{t("user_settings.change_email_address")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("user_settings.change_email_address_here")}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id="current-password"
            name="current-password"
            label={t("user_settings.current_password")}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="email"
            margin="dense"
            id="new-email-address"
            name="new-email-address"
            label={t("user_settings.new_email_address")}
            type="email"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("user_settings.cancel")}</Button>
          <Button type="submit">{t("user_settings.save")}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const getUserIdFromQueryParams = (identifier?: string): number => {
  let userId = parseInt(identifier || "")
  if (isNaN(userId)) {
    // TODO: do API lookup
    userId = 0
  }
  return userId
}

export const UserSettingsPage = () => {
  const { t } = useTranslation()

  const queryParams = useParams()
  const pageUserId = getUserIdFromQueryParams(queryParams["userId"])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { identity, setIdentity } = useIdentityContext()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="xs" sx={{ mt: isMobile ? 0 : -20 }}>
        <Stack direction="column" borderRadius={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <SettingsIcon />
              <Typography variant="h5">{t("user_settings.title")}</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Stack direction="column" spacing={2} p={2}>
              <ChangePasswordButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeEmailAddressButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeUsernameButton
                userId={pageUserId}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                identity={identity}
                setIdentity={setIdentity}
                isSupporter={
                  ((identity?.privileges ?? 0) & UserPrivileges.SUPPORTER) !== 0
                }
              />
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
