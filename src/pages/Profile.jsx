import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ActivityCard from '../components/ActivityCard';

const USER = {
  name: 'Иван',
  role: 'Пользователь',
  status: 'Твой день в твоих руках',
};

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  // Получаем избранные активности из localStorage
  useEffect(() => {
    const favs = [];
    for (let key in localStorage) {
      if (key.startsWith('fav_') && localStorage.getItem(key) === '1') {
        const name = key.replace('fav_', '');
        // Для MVP ищем активность по имени (можно улучшить по id)
        try {
          const all = require('../data/activities').activities;
          const act = all.find(a => a.name === name);
          if (act) favs.push(act);
        } catch {}
      }
    }
    setFavorites(favs);
    // История
    const hist = JSON.parse(localStorage.getItem('history') || '[]');
    setHistory(hist.slice(-10).reverse());
  }, []);

  // Удалить из избранного
  const handleRemoveFavorite = (name) => {
    localStorage.removeItem('fav_' + name);
    setFavorites(favorites.filter(a => a.name !== name));
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      pt: 2,
      pb: 8,
      px: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Шапка профиля */}
      <Paper elevation={4} sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        borderRadius: 2,
        p: 2,
        mb: 2,
        background: 'linear-gradient(90deg, #F5F5F5 0%, #E6ECEF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 24px #A3BFFA22',
      }}>
        <Avatar sx={{
          width: 64, height: 64,
          fontSize: 32,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #A9CBA4 0%, #FFD60A 100%)',
          color: '#4A4039',
          mb: 1.5,
        }}>{getInitials(USER.name)}</Avatar>
        <Typography fontWeight={700} fontSize={22} color="#4A4039" sx={{ fontFamily: 'Poppins, sans-serif' }}>{USER.name}</Typography>
        <Typography fontWeight={500} fontSize={15} sx={{
          background: 'linear-gradient(90deg, #A9CBA4 0%, #FFD60A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}>{USER.status}</Typography>
        <Chip label={USER.role} size="small" sx={{ bgcolor: '#fff', color: '#4A4039', fontWeight: 600, fontSize: 13 }} />
      </Paper>
      {/* Избранное */}
      <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto', mb: 2, px: 0 }}>
        <Typography fontWeight={700} fontSize={18} mb={1} color="#213547">Избранное</Typography>
        {favorites.length === 0 ? (
          <Typography color="#888" fontSize={15} mb={2}>Нет избранных активностей.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 320, overflowY: 'auto' }}>
            {favorites.map((activity) => (
              <Paper key={activity.name} elevation={2} sx={{
                borderRadius: 3,
                p: 1.5,
                background: 'linear-gradient(90deg, #A3BFFA 0%, #fff 100%)',
                position: 'relative',
                boxShadow: '0 2px 12px #A3BFFA22',
              }}>
                <IconButton size="small" onClick={() => handleRemoveFavorite(activity.name)} sx={{ position: 'absolute', top: 6, right: 6, color: '#F4A261' }}>
                  <CloseIcon />
                </IconButton>
                <ActivityCard activity={activity} />
              </Paper>
            ))}
          </Box>
        )}
      </Box>
      {/* История */}
      <Box sx={{ width: '100%', maxWidth: 420, mx: 'auto', mb: 2, px: 0 }}>
        <Typography fontWeight={700} fontSize={18} mb={1} color="#213547">История</Typography>
        {history.length === 0 ? (
          <Typography color="#888" fontSize={15}>Нет истории просмотров.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {history.map((item, idx) => (
              <Box key={item.name + idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #eee', pb: 0.5 }}>
                <Typography fontWeight={600} color="#4A4039" fontSize={15}>{item.name}</Typography>
                <Typography color="#888" fontSize={13} ml={1}>{item.date}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile; 