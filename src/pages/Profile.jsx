import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ActivityCard from '../components/ActivityCard';
import { favoritesAPI, historyAPI, authAPI } from '../services/api';
import { userService } from '../services/userService';

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

const Profile = () => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Получаем информацию о пользователе
  const currentUser = userService.getCurrentUser();
  const USER = {
    name: currentUser?.username || 'Пользователь',
    role: currentUser?.role === 'admin' ? 'Администратор' : 
          currentUser?.role === 'moderator' ? 'Модератор' : 'Пользователь',
    status: 'Твой день в твоих руках',
  };

  // Загружаем данные из API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔄 Загружаем данные профиля...');
        
        const [favoritesData, historyData] = await Promise.all([
          favoritesAPI.getFavorites(),
          historyAPI.getHistory()
        ]);
        
        console.log('📦 Полученные данные избранного:', favoritesData);
        console.log('📦 Полученные данные истории:', historyData);
        
        // Проверяем, что данные не null/undefined
        if (favoritesData && Array.isArray(favoritesData)) {
          setFavorites(favoritesData);
        } else {
          console.log('⚠️ Избранное не является массивом, устанавливаем пустой массив');
          setFavorites([]);
        }
        
        if (historyData && Array.isArray(historyData)) {
          setHistory(historyData);
        } else {
          console.log('⚠️ История не является массивом, устанавливаем пустой массив');
          setHistory([]);
        }
        
      } catch (err) {
        console.error('❌ Ошибка загрузки данных профиля:', err);
        setError('Не удалось загрузить данные профиля');
        // Устанавливаем пустые массивы при ошибке
        setFavorites([]);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Удалить из избранного
  const handleRemoveFavorite = async (activityId) => {
    try {
      console.log('🗑️ Удаляем из избранного:', activityId);
      await favoritesAPI.removeFromFavorites(activityId);
      setFavorites(favorites.filter(a => a.id !== activityId));
      console.log('✅ Успешно удалено из избранного');
    } catch (err) {
      console.error('❌ Ошибка удаления из избранного:', err);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      pt: { xs: 2, md: 4 },
      pb: { xs: 8, md: 4 },
      px: { xs: 0, md: 4 },
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Шапка профиля */}
      <Paper elevation={4} sx={{
        width: '100%',
        maxWidth: { xs: 420, md: 600, lg: 800 },
        mx: 'auto',
        borderRadius: 2,
        p: { xs: 2, md: 3 },
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
      <Box sx={{ width: '100%', maxWidth: { xs: 420, md: 600, lg: 800 }, mx: 'auto', mb: 2, px: 0 }}>
        <Typography fontWeight={700} fontSize={{ xs: 18, md: 20 }} mb={1} color="#213547">Избранное</Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
            <CircularProgress sx={{ color: '#FFD60A' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        ) : favorites.length === 0 ? (
          <Typography color="#888" fontSize={15} mb={2}>Нет избранных активностей.</Typography>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: { md: 'wrap' },
            gap: 2, 
            maxHeight: { xs: 320, md: 'none' }, 
            overflowY: { xs: 'auto', md: 'visible' }
          }}>
            {favorites.map((activity) => (
              <Paper key={activity.id} elevation={2} sx={{
                borderRadius: 3,
                p: 1.5,
                background: 'linear-gradient(90deg, #A3BFFA 0%, #fff 100%)',
                position: 'relative',
                boxShadow: '0 2px 12px #A3BFFA22',
                width: { xs: '100%', md: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' },
                minWidth: { md: 280 }
              }}>
                <IconButton size="small" onClick={() => handleRemoveFavorite(activity.id)} sx={{ position: 'absolute', top: 6, right: 6, color: '#F4A261' }}>
                  <CloseIcon />
                </IconButton>
                <ActivityCard activity={activity} />
              </Paper>
            ))}
          </Box>
        )}
      </Box>
      {/* История */}
      <Box sx={{ width: '100%', maxWidth: { xs: 420, md: 600, lg: 800 }, mx: 'auto', mb: 2, px: 0 }}>
        <Typography fontWeight={700} fontSize={{ xs: 18, md: 20 }} mb={1} color="#213547">История</Typography>
        {history.length === 0 ? (
          <Typography color="#888" fontSize={15}>Нет истории просмотров.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {history.map((activity, idx) => (
              <Box key={activity.id + idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #eee', pb: 0.5 }}>
                <Typography fontWeight={600} color="#4A4039" fontSize={15}>{activity.name}</Typography>
                <Typography color="#888" fontSize={13} ml={1}>
                  {new Date(activity.created_at).toLocaleDateString('ru-RU')}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile; 