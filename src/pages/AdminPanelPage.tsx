import { Box, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserResponse } from '../adapters/bpy-api/user';
import { AdminEditUser } from '../components/admin/AdminEditUser';
import { AdminMenu } from '../components/admin/AdminMenu';
import { AdminRecentPlays } from '../components/admin/AdminRecentPlays';
import { AdminUsers } from '../components/admin/AdminUsers';
import { PageTitle } from '../components/PageTitle';
import { useIdentityContext } from '../context/Identity';
import { UserPrivileges } from '../privileges';

type AdminView = 'users' | 'scores';

const DRAWER_WIDTH = 240;

export const AdminPanelPage = () => {
  const { t } = useTranslation();

  const { identity } = useIdentityContext();
  const [currentView, setCurrentView] = useState<AdminView>('users');
  const [editUser, setEditUser] = useState<UserResponse | null>(null);

  const handleEditUser = (user: UserResponse) => setEditUser(user);
  const handleBackFromEdit = () => setEditUser(null);

  if (identity == null) {
    return (
      <Container maxWidth="md" sx={{ pt: { xs: 3, sm: 10 }, pb: 3 }}>
        <Box sx={{ p: 3, color: 'white', bgcolor: '#191527', borderRadius: 2 }}>
          <Typography>{t('identity.sign_in_required')}</Typography>
        </Box>
      </Container>
    );
  }

  if (!(identity.privileges & UserPrivileges.ADMINISTRATOR)) {
    return (
      <Container maxWidth="md" sx={{ pt: { xs: 3, sm: 10 }, pb: 3 }}>
        <Box sx={{ p: 3, color: 'white', bgcolor: '#191527', borderRadius: 2 }}>
          <Typography>{t('identity.not_authorized')}</Typography>
        </Box>
      </Container>
    );
  }

  const renderContent = () => {
    if (editUser !== null) {
      return <AdminEditUser user={editUser} onBack={handleBackFromEdit} />;
    }
    switch (currentView) {
      case 'users':
        return <AdminUsers onEditUser={handleEditUser} />;
      case 'scores':
        return <AdminRecentPlays />;
      default:
        return null;
    }
  };

  return (
    <>
      <PageTitle title="osu!Peru - Admin Panel" />
      <Container maxWidth="lg" sx={{ pt: { xs: 3, sm: 10 }, pb: 3 }}>
        <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
          <AdminMenu
            currentView={currentView}
            onViewChange={setCurrentView}
            drawerWidth={DRAWER_WIDTH}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: '#191527',
              p: 3,
              color: 'white',
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Container>
    </>
  );
};
