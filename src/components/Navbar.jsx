import React, { useState, useEffect } from "react";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from '../services/api';
import { userService } from '../services/userService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  
  const baseNavItems = [
    { label: "Главная", icon: <HomeIcon />, path: "/" },
    { label: "Рекомендации", icon: <StarIcon />, path: "/recommendations" },
    { label: "Профиль", icon: <PersonIcon />, path: "/profile" },
  ];

  // Добавляем админ-панель для модераторов
  const navItems = isModerator 
    ? [...baseNavItems, { label: "Админ", icon: <AdminPanelSettingsIcon />, path: "/admin" }]
    : baseNavItems;

  const currentIndex = navItems.findIndex(item => location.pathname.startsWith(item.path));

  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
    setIsModerator(userService.isModerator());
  }, [location.pathname]);

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0,
      left: 0, 
      right: 0, 
      zIndex: 100 
    }} elevation={6}>
      <BottomNavigation
        showLabels
        value={currentIndex === -1 ? 0 : currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{ 
          borderTop: '1px solid #eee',
          bgcolor: '#fff', 
          outline: 'none', 
          boxShadow: 'none' 
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            disabled={!isAuthenticated && item.path !== '/'}
            sx={{ 
              outline: 'none', 
              boxShadow: 'none',
              opacity: !isAuthenticated && item.path !== '/' ? 0.5 : 1,
              '&.Mui-disabled': {
                opacity: 0.5
              }
            }}
            focusVisibleClassName="Mui-focusVisible-none"
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar; 