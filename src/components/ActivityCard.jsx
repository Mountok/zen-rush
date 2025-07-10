import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import GroupIcon from '@mui/icons-material/Group';
import Paper from '@mui/material/Paper';
import { favoritesAPI } from '../services/api';

const weatherIcon = {
  sunny: <WbSunnyIcon sx={{ color: '#FFD60A' }} />, // жёлтый
  cloudy: <CloudIcon sx={{ color: '#A3BFFA' }} />, // голубой
  rainy: <UmbrellaIcon sx={{ color: '#4A90E2' }} />, // синий
};

const getWeatherIcon = (weather) => weatherIcon[weather] || <WbSunnyIcon sx={{ color: '#FFD60A' }} />;

const ActivityCard = ({ activity, onFavorite, onRate, onClick }) => {
  const { id, name, description, budget, time, weather, moods, people_count } = activity;
  const rateKey = `rate_${id || name}`;
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRating(Number(localStorage.getItem(rateKey)) || 0);
    // eslint-disable-next-line
  }, []);

  // Проверяем, есть ли активность в избранном
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await favoritesAPI.getFavorites();
        console.log('🔍 Проверяем избранное для активности', id, ':', favorites);
        
        // Проверяем, что favorites - это массив
        if (favorites && Array.isArray(favorites)) {
          const isFav = favorites.some(fav => fav.id === id);
          console.log('🔍 Активность в избранном:', isFav);
          setFavorite(isFav);
        } else {
          console.log('⚠️ Избранное не является массивом, устанавливаем false');
          setFavorite(false);
        }
      } catch (err) {
        console.error('❌ Ошибка проверки избранного:', err);
        setFavorite(false);
      }
    };
    
    if (id) {
      checkFavorite();
    }
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      if (favorite) {
        await favoritesAPI.removeFromFavorites(id);
        setFavorite(false);
      } else {
        await favoritesAPI.addToFavorites(id);
        setFavorite(true);
        if (onFavorite) onFavorite();
      }
    } catch (err) {
      console.error('Ошибка работы с избранным:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = (val) => {
    setRating(val);
    localStorage.setItem(rateKey, String(val));
    if (onRate) onRate();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        p: { xs: 2.2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.2, md: 1.5 },
        boxShadow: '0 4px 24px #A3BFFA22',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'scale(1.025)' : 'none',
          boxShadow: onClick ? '0 8px 32px #A3BFFA33' : '0 4px 24px #A3BFFA22',
        },
        minWidth: 0,
        height: 'fit-content',
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '50%', bgcolor: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5,
        }}>
          {getWeatherIcon(weather)}
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ 
          flex: 1, 
          fontSize: { xs: 18, md: 20, lg: 22 }, 
          color: '#213547' 
        }}>{name}</Typography>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            handleFavorite();
          }}
          disabled={loading}
          sx={{ 
            color: favorite ? '#FFD60A' : '#bbb', 
            transition: 'color 0.2s',
            '&:disabled': {
              color: '#ddd'
            }
          }}
        >
          <FavoriteIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ 
        color: '#4A4039', 
        mb: 0.5, 
        fontSize: { xs: 15, md: 16 }, 
        minHeight: { xs: 20, md: 24 },
        lineHeight: 1.4
      }}>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
        <Chip icon={<AttachMoneyIcon sx={{ color: '#A3BFFA' }} />} label={`${budget} ₽`} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        <Chip icon={<AccessTimeIcon sx={{ color: '#A9CBA4' }} />} label={`${time} ч`} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        {people_count && (
          <Chip icon={<GroupIcon sx={{ color: '#FF6B6B' }} />} label={`${people_count} чел`} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        )}
        <Chip icon={getWeatherIcon(weather)} label={weather === 'sunny' ? 'Солнечно' : weather === 'cloudy' ? 'Облачно' : weather === 'rainy' ? 'Дождь' : 'Любая'} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        {moods && moods.length > 0 && (
          <Chip label={moods[0]} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600, color: '#4A4039' }} />
        )}
      </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          {[1,2,3,4,5].map((val) => (
            <IconButton
              key={val}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRate(val);
              }}
              sx={{ color: val <= rating ? '#4CD964' : '#bbb', p: 0.5 }}
            >
              <StarIcon fontSize="small" />
            </IconButton>
          ))}
          <Typography variant="body2" sx={{ color: '#888', ml: 1, fontSize: 14 }}>
            Оценить
          </Typography>
        </Box>
    </Paper>
  );
};

export default ActivityCard; 