import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  debounce,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  authenticate,
  initPasswordReset,
  logout,
  register,
} from '../adapters/bpy-api/authentication';
import {
  type SingleUserSearchResult,
  searchUsers,
} from '../adapters/bpy-api/search';
import HomepageBanner from '../components/images/banners/homepage_banner.svg';
import { type Identity, useIdentityContext } from '../context/Identity';
import { UserPrivileges } from '../privileges';
import { LoginDoorIcon } from './images/logos/icons/LoginDoorIcon';
import { UserFriendsIcon } from './images/logos/icons/UserFriendsIcon';
import { UserLogoutIcon } from './images/logos/icons/UserLogoutIcon';
import { UserProfileIcon } from './images/logos/icons/UserProfileIcon';
import { UserSettingsIcon } from './images/logos/icons/UserSettingsIcon';
import { OsuPeruLogo } from './images/logos/OsuPeruLogo';
import { LanguageSelector } from './LanguageSelector';

const PAGES_WITH_VISIBLE_OUTLINE = ['/'];

const shouldUseVisibleOutline = (pagePathName: string) =>
  PAGES_WITH_VISIBLE_OUTLINE.includes(pagePathName);

export const AuthenticationSettingsMenu = ({
  setIdentity,
}: {
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
}) => {
  const { t } = useTranslation();
  const captchaRef = useRef<HCaptcha>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [hCaptchaToken, setCaptchaToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [passwordResetPending, setPasswordResetPending] = useState(false);

  const handleLogin = async () => {
    if (!hCaptchaToken) {
      setServerError('Please complete the captcha');
      return;
    }

    let identity: Identity;
    try {
      setLoading(true);
      identity = await authenticate(username, password, hCaptchaToken);
    } catch (e: any) {
      setLoading(false);
      setServerError(e.message);
      return;
    }

    setLoading(false);
    setServerError('');
    setIdentity(identity);
    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);
  };

  const handlePasswordReset = async () => {
    if (!hCaptchaToken) {
      setServerError('Please complete the captcha.');
      return;
    }

    try {
      setLoading(true);
      await initPasswordReset(username, hCaptchaToken);
    } catch (e: any) {
      setLoading(false);
      setServerError(e.message);
      return;
    }

    setPasswordResetPending(true);
    setLoading(false);
    setServerError('');
  };

  const handleRegister = async () => {
    if (!hCaptchaToken) {
      setServerError('Please complete the captcha');
      return;
    }

    try {
      setLoading(true);
      const identity = await register({
        username,
        password,
        email,
        hCaptchaToken,
      });
      setIdentity(identity);
      setLoading(false);
      setServerError('');
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } catch (e: any) {
      setLoading(false);
      setServerError(e.message);
      return;
    }
  };

  return (
    <>
      <Button
        aria-label="authentication-settings-button"
        id={useId()}
        aria-controls={open ? 'authentication-settings-button' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          p: 2,
          borderRadius: 8,
          color: 'white',
        }}
      >
        <Typography variant="body1">
          {t('navbar.log_in_or_register')}
        </Typography>
      </Button>
      <Menu
        id={useId()}
        MenuListProps={{
          'aria-labelledby': 'authentication-settings-button',
          sx: {
            bgcolor: '#191527',
            paddingTop: 0,
            p: 1.5,
          },
          onKeyDown: (e) => {
            e.stopPropagation();
            e.preventDefault();
          },
        }}
        slotProps={{
          paper: {
            sx: { width: 326, borderRadius: 3 },
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (isRegistering) {
                await handleRegister();
              } else {
                await handleLogin();
              }
            },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <TextField
          fullWidth
          required={isRegistering}
          id={useId()}
          label={t('navbar.username')}
          type="text"
          autoComplete="username"
          value={username}
          InputProps={{
            sx: { borderRadius: 3, bgcolor: '#110E1B' },
            onKeyDown: (e) => {
              e.stopPropagation();
            },
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        {isRegistering && (
          <TextField
            fullWidth
            required
            //id={useId()} // TODO: see this later
            label={t('navbar.email')}
            type="email"
            value={email}
            autoComplete="email"
            InputProps={{
              sx: {
                borderRadius: 3,
                bgcolor: '#110E1B',
                mt: 1,
              },
              onKeyDown: (e) => {
                e.stopPropagation();
              },
            }}
            InputLabelProps={{ sx: { mt: 1 } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        )}
        <TextField
          fullWidth
          required={isRegistering}
          id={useId()}
          label={t('navbar.password')}
          type="password"
          value={password}
          autoComplete={isRegistering ? 'new-password' : 'current-password'}
          InputProps={{
            sx: {
              borderRadius: 3,
              bgcolor: '#110E1B',
              mt: 1,
            },
            onKeyDown: (e) => {
              e.stopPropagation();
            },
          }}
          InputLabelProps={{ sx: { mt: 1 } }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
          <HCaptcha
            ref={captchaRef}
            sitekey={process.env.PUBLIC_APP_HCAPTCHA_SITE_KEY || ''}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />
        </Box>
        {passwordResetPending && (
          <Alert sx={{ mt: 1 }} severity="info">
            {t('navbar.password_reset_email_sended')}
          </Alert>
        )}
        {serverError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {serverError}
          </Alert>
        )}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            backgroundImage:
              'linear-gradient(90.09deg, #387EFC -0.08%, #C940FD 99.3%)',
            mt: 1.5,
            borderRadius: 3,
          }}
          disabled={loading}
        >
          <Stack direction="row" alignItems="center">
            <Box width={24} height={24}>
              <LoginDoorIcon />
            </Box>
            <Typography variant="body2">
              {isRegistering ? t('navbar.register') : t('navbar.login')}
            </Typography>
          </Stack>
        </Button>
        <Stack direction="row" justifyContent="space-around">
          <Box sx={{ width: '45%', height: 2, bgcolor: '#3B345F', mt: 1.5 }} />
          <Typography variant="body1">or</Typography>
          <Box sx={{ width: '45%', height: 2, bgcolor: '#3B345F', mt: 1.5 }} />
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="space-around">
          <Button
            fullWidth
            onClick={handlePasswordReset}
            sx={{
              textTransform: 'none',
              color: 'white',
              bgcolor: '#262238',
              p: 1.25,
              borderRadius: 3,
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Tab') {
                e?.stopPropagation();
              }
            }}
            disabled={username === '' || loading || passwordResetPending}
          >
            <Typography variant="body1">
              {t('navbar.reset_password')}
            </Typography>
          </Button>
          <Button
            fullWidth
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsRegistering(!isRegistering);
            }}
            sx={{
              textTransform: 'none',
              color: 'white',
              bgcolor: '#262238',
              borderRadius: 3,
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Tab') {
                e?.stopPropagation();
              }
            }}
          >
            <Typography variant="body1">
              {isRegistering ? t('navbar.login') : t('navbar.create_account')}
            </Typography>
          </Button>
        </Stack>
      </Menu>
    </>
  );
};

export const ProfileSettingsMenu = ({
  identity,
  setIdentity,
}: {
  identity: Identity;
  setIdentity: (identity: Identity | null) => void;
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    if (identity === null) {
      console.warn('User attempted a logout without being logged in');
      setIdentity(null);
      return;
    }
    try {
      await logout();
    } catch (e: any) {
      console.error('Failed to logout on API:', e);
    }
    setIdentity(null);
  };

  return (
    <>
      <Button
        aria-label="profile-settings-button"
        id={useId()}
        aria-controls={open ? 'profile-settings-button' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ textTransform: 'none' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            {identity.username}
          </Typography>
          <Avatar
            alt="user-avatar"
            src={`${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/${identity.userId}?t=${Date.now()}`}
            variant="rounded"
            sx={{ width: 36, height: 36, borderRadius: '16px' }}
          />
        </Stack>
      </Button>
      <Menu
        id={useId()}
        MenuListProps={{
          'aria-labelledby': 'profile-settings-button',
          sx: {
            bgcolor: '#191527',
            paddingTop: 0,
          },
        }}
        slotProps={{ paper: { sx: { width: 242 } } }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box
          p={2}
          mb={1}
          sx={{
            backgroundImage: `url(${HomepageBanner})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Stack direction="column" alignItems="center" spacing={1}>
            <Avatar
              alt="user-avatar"
              src={`${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/${identity.userId}?t=${Date.now()}`}
              variant="circular"
              sx={{ width: 84, height: 84 }}
            />
            <Typography variant="h6">{identity.username}</Typography>
          </Stack>
        </Box>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to={`/u/${identity.userId}`}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={22} height={22}>
              <UserProfileIcon />
            </Box>
            <Typography variant="body1">{t('identity.my_profile')}</Typography>
          </Stack>
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={handleClose}
          to={`/u/${identity.userId}/friends`}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={22} height={22}>
              <UserFriendsIcon />
            </Box>
            <Typography variant="body1">{t('identity.friends')}</Typography>
          </Stack>
        </MenuItem>
        {(identity.privileges & UserPrivileges.ADMINISTRATOR) !== 0 && (
          <MenuItem component={Link} onClick={handleClose} to={'/admin-panel'}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box width={22} height={22}>
                <UserSettingsIcon />
              </Box>
              <Typography variant="body1">
                {t('identity.admin_panel')}
              </Typography>
            </Stack>
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          onClick={handleClose}
          to={`/u/${identity.userId}/settings`}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={22} height={22}>
              <UserSettingsIcon />
            </Box>
            <Typography variant="body1">{t('identity.settings')}</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box width={22} height={22}>
              <UserLogoutIcon />
            </Box>
            <Typography variant="body1">{t('identity.logout')}</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};

export default function Navbar() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { identity, setIdentity } = useIdentityContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryOptions, setSearchQueryOptions] = useState<
    SingleUserSearchResult[] | null
  >([]);
  const [searchQueryValue, setSearchQueryValue] =
    useState<SingleUserSearchResult | null>(null);

  const location = useLocation();
  const useVisibleOutline = shouldUseVisibleOutline(location.pathname);

  const searchForUsers = useMemo(
    () =>
      debounce((query: string) => {
        searchUsers({ query }).then((response) => {
          setSearchQueryOptions(response.users);
        });
      }, 400),
    [],
  );

  useEffect(() => {
    if (!searchQuery) {
      setSearchQueryOptions([]);
      return;
    }

    searchForUsers(searchQuery);
  }, [searchQuery, searchForUsers]);

  return (
    <Box
      width="100%"
      position={{ sm: 'absolute' }}
      top={0}
      left={0}
      zIndex={900}
      sx={{
        background: useVisibleOutline
          ? 'linear-gradient(0deg, rgba(17, 14, 27, 0.6) 0%, rgba(17, 14, 27, 0.528) 100%)'
          : 'transparent',
      }}
    >
      <Container disableGutters>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          minHeight={5}
          py={1.25}
          spacing={{ xs: 1, sm: 0 }}
        >
          {/* Left Navbar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Link to="/">
              <Button>
                <Box width={146.25} height={29.97}>
                  <OsuPeruLogo />
                </Box>
              </Button>
            </Link>
            <Divider flexItem orientation="vertical" />
            <Link to="/">
              <Button sx={{ color: 'white', textTransform: 'none' }}>
                <Typography variant="body1">{t('navbar.home')}</Typography>
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button sx={{ color: 'white', textTransform: 'none' }}>
                <Typography variant="body1">
                  {t('navbar.leaderboards')}
                </Typography>
              </Button>
            </Link>
            <Link to="/about">
              <Button sx={{ color: 'white', textTransform: 'none' }}>
                <Typography variant="body1">{t('navbar.about')}</Typography>
              </Button>
            </Link>

            <Autocomplete
              id={useId()}
              sx={{ width: 225 }} // TODO: does this scale?
              filterOptions={(x) => x}
              value={searchQueryValue}
              options={searchQueryOptions ?? []}
              getOptionLabel={(option) => option.username}
              isOptionEqualToValue={(option, value) =>
                option.username === value.username
              }
              renderInput={(params) => {
                return <TextField {...params} label={t('navbar.search')} />;
              }}
              onInputChange={(_event, newInputValue: string) =>
                setSearchQuery(newInputValue)
              }
              onChange={(_event, newValue) => {
                if (newValue === null) return;
                setSearchQueryValue(newValue);
                setSearchQueryOptions([newValue]);
                navigate(`/u/${newValue.id}`);
              }}
            />
          </Stack>

          {/* Right Navbar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <LanguageSelector />
            {identity !== null ? (
              <ProfileSettingsMenu
                identity={identity}
                setIdentity={setIdentity}
              />
            ) : (
              <AuthenticationSettingsMenu
                identity={identity}
                setIdentity={setIdentity}
              />
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
