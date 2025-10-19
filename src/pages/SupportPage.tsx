/** biome-ignore-all lint/complexity/noUselessFragments: <TODO element> */
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from '../context/Identity';

export const SupportPage = () => {
  const { t } = useTranslation();

  const { identity } = useIdentityContext();

  if (identity === null) {
    return <Typography>{t('identity.sign_in_required')}</Typography>;
  }

  return <></>;
};
