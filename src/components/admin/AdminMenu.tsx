import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserFriendsIcon } from '../images/icons/UserFriendsIcon';
import { LeaderboardIcon } from '../images/logos/icons/LeaderboardIcon';

type AdminView = 'users' | 'scores';

interface AdminDashboardMenuProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  drawerWidth: number;
}

export const AdminMenu = ({
  currentView,
  onViewChange,
  drawerWidth,
}: AdminDashboardMenuProps) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      label: t('admin_panel.menu.users'),
      view: 'users' as AdminView,
      icon: (
        <Box width={22} height={22}>
          <UserFriendsIcon />
        </Box>
      ),
    },
    {
      label: t('admin_panel.menu.recent_plays'),
      view: 'scores' as AdminView,
      icon: (
        <Box width={22} height={22}>
          <LeaderboardIcon />
        </Box>
      ),
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#151223',
          color: 'hsl(0deg 0% 100% / 60%)',
          borderRight: '1px solid #211D35',
          position: 'relative',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="white">
          {t('admin_panel.title')}
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={currentView === item.view}
                onClick={() => onViewChange(item.view)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(30, 27, 47, 1)',
                    color: 'white',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(30, 27, 47, 0.8)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
