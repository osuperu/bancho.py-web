import { Avatar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import type { UserResponse } from '../../adapters/bpy-api/user';
import { UserPrivileges } from '../../privileges';
import { FlagIcon } from '../DestinationIcons';

interface UserTitleDisplay {
  text: string;
  color: string;
}

const getDisplayTitle = (userPrivileges: number): UserTitleDisplay | null => {
  if (userPrivileges & UserPrivileges.ADMINISTRATOR) {
    return {
      text: 'profile.titles.core_dev_team',
      color: 'linear-gradient(90deg, #387EFC 0%, #C940FD 100%)',
    };
  } else if (userPrivileges & UserPrivileges.NOMINATOR) {
    return {
      text: 'profile.titles.nomination_quality_assurance',
      color: 'rgba(170, 154, 255, 1)',
    };
  }
  // TODO: the many many others. And perhaps the concept of privilege groups.
  return null;
};

export const ProfileIdentityCard = ({
  userProfile,
}: {
  userProfile: UserResponse;
}) => {
  const { t } = useTranslation();

  const userTitleDisplay = getDisplayTitle(userProfile.privileges);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      p={2}
      width="100%"
      border={1}
      borderRadius={4}
      // TODO: try to figure out the border gradient perhaps?
      borderColor="rgba(255, 255, 255, 0.3)"
    >
      <Avatar
        alt="user-avatar"
        src={`${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/${userProfile.id}`}
        variant="square"
        sx={{ width: 156, height: 156, borderRadius: '16px' }}
      />
      <Stack direction="column" spacing={1}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          spacing={1}
        >
          {/* TODO: clan tag prefixing username */}
          {userProfile.clan.id !== 0 && (
            <Box bgcolor="white" borderRadius={11} py={0.5} px={2}>
              <Typography variant="h5" color="black">
                {userProfile.clan.tag}
              </Typography>
            </Box>
          )}
          <Typography fontWeight="bold" variant="h4">
            {userProfile.username}
          </Typography>
          <FlagIcon country={userProfile.country} height={30} width={30} />
        </Stack>
        {userTitleDisplay !== null && (
          <Typography
            variant="h6"
            sx={{
              background: userTitleDisplay.color,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t(userTitleDisplay.text)}
          </Typography>
        )}
        {!(userProfile.privileges & UserPrivileges.UNRESTRICTED) && (
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(90deg, #FF5E5E 0%, #FFC530 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Restricted
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
