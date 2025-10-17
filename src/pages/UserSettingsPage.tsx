import SettingsIcon from '@mui/icons-material/Settings';
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
} from '@mui/material';
import { type FormEvent, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  updateAvatar,
  updateEmail,
  updatePassword,
  updateUsername,
} from '../adapters/bpy-api/user';
import StaticPageBanner from '../components/images/banners/static_page_banner.svg';
import { PageTitle } from '../components/PageTitle';
import { type Identity, useIdentityContext } from '../context/Identity';
import { UserPrivileges } from '../privileges';

const ChangeUsernameButton = ({
  setSnackbarOpen,
  setSnackbarMessage,
  identity,
  setIdentity,
  isSupporter,
}: {
  setSnackbarOpen: (open: boolean) => void;
  setSnackbarMessage: (message: string) => void;
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
  isSupporter: boolean;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title={t('user_settings.supporter_only_feature')}>
        <Box display="flex" justifyContent="center">
          <Button
            disabled={!isSupporter}
            onClick={handleClickOpen}
            sx={{ color: 'white', textTransform: 'none' }}
          >
            <Typography variant="body1">
              {t('user_settings.change_display_name')}
            </Typography>
          </Button>
        </Box>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const currentPassword = formJson['current-password'].toString();
            const newUsername = formJson['new-username'].toString();
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateUsername(currentPassword, newUsername);
            } catch (e: any) {
              setSnackbarOpen(true);
              setSnackbarMessage(e.message);
              return;
            }
            if (identity !== null) {
              setIdentity({ ...identity, username: newUsername });
            }

            handleClose();
          },
        }}
      >
        <DialogTitle>{t('user_settings.change_display_name')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('user_settings.supporters_can_use_this_feature')}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id={useId()}
            name="current-password"
            label={t('user_settings.current_password')}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="username"
            margin="dense"
            id={useId()}
            name="new-username"
            label={t('user_settings.new_display_name')}
            type="text"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('user_settings.cancel')}</Button>
          <Button type="submit">{t('user_settings.save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ChangePasswordButton = ({
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  setSnackbarOpen: (open: boolean) => void;
  setSnackbarMessage: (message: string) => void;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: 'white', textTransform: 'none' }}
      >
        <Typography variant="body1">
          {t('user_settings.change_password')}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const currentPassword = formJson['current-password'].toString();
            const newPassword = formJson['new-password'].toString();

            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updatePassword(currentPassword, newPassword);
            } catch (e: any) {
              setSnackbarOpen(true);
              setSnackbarMessage(e.message);
              return;
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>{t('user_settings.change_password')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('user_settings.change_password_here')}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id={useId()}
            name="current-password"
            label={t('user_settings.current_password')}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="new-password"
            margin="dense"
            id={useId()}
            name="new-password"
            label={t('user_settings.new_password')}
            type="password"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('user_settings.cancel')}</Button>
          <Button type="submit">{t('user_settings.save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ChangeEmailAddressButton = ({
  setSnackbarOpen,
  setSnackbarMessage,
}: {
  setSnackbarOpen: (open: boolean) => void;
  setSnackbarMessage: (message: string) => void;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: 'white', textTransform: 'none' }}
      >
        <Typography variant="body1">
          {t('user_settings.change_email_address')}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const currentPassword = formJson['current-password'].toString();
            const newEmailAddress = formJson['new-email-address'].toString();
            // TODO: potentially automatically validate debounced input
            //       is available server-side as-they-type?
            try {
              await updateEmail(currentPassword, newEmailAddress);
            } catch (e: any) {
              setSnackbarOpen(true);
              setSnackbarMessage(e.message);
              return;
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>{t('user_settings.change_email_address')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('user_settings.change_email_address_here')}
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="current-password"
            margin="dense"
            id={useId()}
            name="current-password"
            label={t('user_settings.current_password')}
            type="password"
            variant="standard"
          />
          <TextField
            autoFocus
            required
            fullWidth
            autoComplete="email"
            margin="dense"
            id={useId()}
            name="new-email-address"
            label={t('user_settings.new_email_address')}
            type="email"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('user_settings.cancel')}</Button>
          <Button type="submit">{t('user_settings.save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ChangeAvatarButton = ({
  setSnackbarOpen,
  setSnackbarMessage,
  identity,
  setIdentity,
}: {
  setSnackbarOpen: (open: boolean) => void;
  setSnackbarMessage: (message: string) => void;
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        sx={{ color: 'white', textTransform: 'none' }}
      >
        <Typography variant="body1">
          {t('user_settings.change_avatar')}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            try {
              if (selectedFile) {
                await updateAvatar(selectedFile);
                if (identity !== null) {
                  setIdentity({ ...identity });
                }
              }
            } catch (e: any) {
              setSnackbarOpen(true);
              setSnackbarMessage(e.message);
              return;
            }
            handleClose();
          },
        }}
      >
        <DialogTitle>{t('user_settings.change_avatar')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('user_settings.change_avatar_here')}
          </DialogContentText>
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id={useId()}
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="avatar-upload">
              <Button variant="contained" component="span">
                {t('user_settings.select_avatar')}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('user_settings.selected_file')}: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('user_settings.cancel')}</Button>
          <Button type="submit">{t('user_settings.save')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const UserSettingsPage = () => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { identity, setIdentity } = useIdentityContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <PageTitle title={`osu!Peru - ${t('web_titles.settings')}`} />
      <Box
        height={{ xs: 0, sm: 340 }}
        sx={{
          backgroundSize: 'cover',
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
              backgroundSize: 'cover',
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <SettingsIcon />
              <Typography variant="h5">{t('user_settings.title')}</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Stack direction="column" spacing={2} p={2}>
              <ChangeAvatarButton
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                identity={identity}
                setIdentity={setIdentity}
              />
              <Divider />
              <ChangePasswordButton
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeEmailAddressButton
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
              />
              <Divider />
              <ChangeUsernameButton
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
  );
};
