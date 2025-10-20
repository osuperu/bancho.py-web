import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  IconButton,
  Skeleton,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchUsers, type UserResponse } from '../../adapters/bpy-api/user';
import { FlagIcon } from '../DestinationIcons';

const USER_RANK_BG_COLOR = 'rgba(21, 18, 35, 1)';
const USER_INFO_BG_COLOR = 'rgba(30, 27, 47, 1)';

export const AdminUsers = ({
  onEditUser,
}: {
  onEditUser?: (user: UserResponse) => void;
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<UserResponse[] | null>(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const userResponse = await fetchUsers({
          page: page + 1,
          limit: pageSize,
        });
        setUserData(userResponse);
        setLoading(false);
        setError('');
      } catch (_e: any) {
        setError('Failed to fetch data from server');
        return;
      }
    })();
  }, [page, pageSize]);

  if (loading || !userData) {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={75}></Skeleton>
        ))}
      </>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {t('admin_panel.menu.users')}
      </Typography>
      <Stack direction="row" mb={1}>
        <Box minWidth="75px" p={1} display="flex" justifyContent="center">
          <Typography color="hsl(0deg 0% 100% / 60%)">
            {t('admin_panel.users.id')}
          </Typography>
        </Box>
        <Box flexGrow={1} p={1}>
          <Typography color="hsl(0deg 0% 100% / 60%)">
            {t('admin_panel.users.username')}
          </Typography>
        </Box>
        <Box minWidth="120px" p={1} display="flex" justifyContent="center">
          <Typography color="hsl(0deg 0% 100% / 60%)">
            {t('admin_panel.users.email')}
          </Typography>
        </Box>
        <Box minWidth="120px" p={1} display="flex" justifyContent="center">
          <Typography color="hsl(0deg 0% 100% / 60%)">
            {t('admin_panel.users.actions')}
          </Typography>
        </Box>
      </Stack>
      <Stack>
        {userData?.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            borderRadius={2}
            overflow="hidden"
            mb={1}
            bgcolor={USER_INFO_BG_COLOR}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor={USER_RANK_BG_COLOR}
              minWidth="75px"
              p={1}
            >
              <Typography>{user.id}</Typography>
            </Box>
            <Box flexGrow={1} p={1} display="flex" alignItems="center">
              <Link
                to={`/u/${user.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FlagIcon country={user.country} height={36} width={36} />
                <Typography variant="body1" ml={1}>
                  {user.username}
                </Typography>
              </Link>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minWidth="120px"
              p={1}
            >
              <Typography color="hsl(0deg 0% 100% / 60%)">
                {user.email}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minWidth="120px"
              p={1}
            >
              <IconButton
                aria-label="edit user"
                onClick={() => onEditUser?.(user)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Stack>
        ))}
      </Stack>
      <TablePagination
        component="div"
        sx={{ color: 'hsl(0deg 0% 100% / 60%)' }}
        count={-1}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelDisplayedRows={({ from, to }) => {
          return `Results ${from}-${to}`;
        }}
      />
    </Box>
  );
};
