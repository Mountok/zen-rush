import React from "react";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Главная", icon: <HomeIcon />, path: "/" },
  { label: "Рекомендации", icon: <StarIcon />, path: "/recommendations" },
  { label: "Профиль", icon: <PersonIcon />, path: "/profile" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = navItems.findIndex(item => location.pathname.startsWith(item.path));

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={6}>
      <BottomNavigation
        showLabels
        value={currentIndex === -1 ? 0 : currentIndex}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{ borderTop: '1px solid #eee', bgcolor: '#fff', outline: 'none', boxShadow: 'none' }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            sx={{ outline: 'none', boxShadow: 'none' }}
            focusVisibleClassName="Mui-focusVisible-none"
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar; 