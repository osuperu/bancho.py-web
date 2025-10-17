import { Tooltip, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import type { UserResponse } from '../../adapters/bpy-api/user';

export const ProfileActivityDatesCard = ({
  userProfile,
}: {
  userProfile: UserResponse;
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      spacing={{ xs: 1, sm: 3 }}
    >
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          {t('profile.activity_dates.joined')}
        </Typography>
        <Tooltip title={moment(userProfile.registeredOn).format('LLLL')}>
          <Typography variant="body1" fontWeight="bold">
            {moment(userProfile.registeredOn).fromNow()}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1" fontWeight="lighter">
          {t('profile.activity_dates.last_seen')}
        </Typography>
        <Tooltip title={moment(userProfile.latestActivity).format('LLLL')}>
          <Typography variant="body1" fontWeight="bold">
            {moment(userProfile.latestActivity).fromNow()}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
