import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  GridLegacy,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type UserResponse, updateUser } from '../../adapters/bpy-api/user';
import { formatPrivilegeName, UserPrivileges } from '../../privileges';
import { ALPHA2_COUNTRY_LIST, getFlagUrl } from '../../utils/countries';

const CARD_BG_COLOR = 'rgba(30, 27, 47, 1)';
const CARD_BORDER_COLOR = 'rgba(255,255,255,0.07)';

export const AdminEditUser = ({
  user,
  onBack,
}: {
  user: UserResponse;
  onBack: () => void;
}) => {
  const [error, setError] = useState('');
  const [privileges, setPrivileges] = useState<number>(user.privileges);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  // NUEVOS ESTADOS PARA CAMPOS EDITABLES
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [country, setCountry] = useState(user.country.toUpperCase());

  const { t } = useTranslation();

  const handlePrivilegeChange = (flag: number) => {
    setPrivileges((prev) => (prev & flag ? prev & ~flag : prev | flag));
  };

  const handleRemoveAvatar = () => {
    setAvatarRemoved(true);
  };

  const handleSave = async () => {
    try {
      await updateUser(
        user.id,
        username,
        email,
        country,
        privileges,
        avatarRemoved,
      );
      onBack();
    } catch {
      setError('Failed to update user');
      return;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: CARD_BG_COLOR,
        border: `1px solid ${CARD_BORDER_COLOR}`,
        borderRadius: 3,
        p: { xs: 2, sm: 4 },
        maxWidth: 600,
        mx: 'auto',
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" mb={3} fontWeight={700}>
        {t('admin_panel.user_edit.title')}
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        spacing={2}
        mb={3}
        sx={{ position: 'relative' }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            alt="user-avatar"
            src={
              avatarRemoved
                ? `${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/1`
                : `${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/${user.id}`
            }
            variant="square"
            sx={{ width: 80, height: 80, borderRadius: 2, boxShadow: 1 }}
          />
          {!avatarRemoved && (
            <IconButton
              size="small"
              color="error"
              onClick={handleRemoveAvatar}
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'error.light' },
              }}
              title={t('admin_panel.user_edit.remove_avatar')}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography fontWeight="bold" variant="h6" sx={{ fontSize: 22 }}>
          {user.username}
        </Typography>
      </Stack>
      <Divider sx={{ sx: { mb: 3, borderColor: CARD_BORDER_COLOR } }} />
      <Stack spacing={2}>
        <TextField
          label={t('admin_panel.user_edit.username')}
          value={username}
          fullWidth
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label={t('admin_panel.user_edit.email')}
          value={email}
          fullWidth
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          select
          label={t('admin_panel.user_edit.country')}
          value={country}
          fullWidth
          variant="outlined"
          onChange={(e) => setCountry(e.target.value)}
        >
          {Object.entries(ALPHA2_COUNTRY_LIST).map(([code, name]) => (
            <MenuItem key={code} value={code}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Box
                  component="img"
                  src={getFlagUrl(code)}
                  alt={code}
                  height={20}
                  width={20}
                />
                <Typography variant="body1">{name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </TextField>
        <FormGroup>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('admin_panel.user_edit.privileges')}
          </Typography>
          <Grid container spacing={0.5}>
            {Object.entries(UserPrivileges)
              .filter(
                ([_key, value]) =>
                  typeof value === 'number' &&
                  Number.isInteger(value) &&
                  ((value as number) & ((value as number) - 1)) === 0,
              )
              .map(([key, value], _idx) => (
                <GridLegacy item xs={4} key={key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={Boolean(privileges & (value as number))}
                        onChange={() => handlePrivilegeChange(value as number)}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatPrivilegeName(key)}
                      </Typography>
                    }
                    sx={{ ml: 0 }}
                  />
                </GridLegacy>
              ))}
          </Grid>
        </FormGroup>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {t('admin_panel.user_edit.save')}
          </Button>
          <Button variant="outlined" onClick={onBack}>
            {t('admin_panel.user_edit.back_to_users')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
