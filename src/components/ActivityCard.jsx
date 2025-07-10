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
import Paper from '@mui/material/Paper';

const weatherIcon = {
  sunny: <WbSunnyIcon sx={{ color: '#FFD60A' }} />, // жёлтый
  cloudy: <CloudIcon sx={{ color: '#A3BFFA' }} />, // голубой
  rainy: <UmbrellaIcon sx={{ color: '#4A90E2' }} />, // синий
};

const getWeatherIcon = (weather) => weatherIcon[weather] || <WbSunnyIcon sx={{ color: '#FFD60A' }} />;

const ActivityCard = ({ activity, onFavorite, onRate }) => {
  const { name, description, budget, time, weather } = activity;
  const favKey = `fav_${name}`;
  const rateKey = `rate_${name}`;
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setFavorite(!!localStorage.getItem(favKey));
    setRating(Number(localStorage.getItem(rateKey)) || 0);
    // eslint-disable-next-line
  }, []);

  const handleFavorite = () => {
    if (favorite) {
      localStorage.removeItem(favKey);
      setFavorite(false);
    } else {
      localStorage.setItem(favKey, '1');
      setFavorite(true);
      if (onFavorite) onFavorite();
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
        p: 2.2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.2,
        boxShadow: '0 4px 24px #A3BFFA22',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'scale(1.025)',
          boxShadow: '0 8px 32px #A3BFFA33',
        },
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '50%', bgcolor: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5,
        }}>
          {getWeatherIcon(weather)}
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1, fontSize: 18, color: '#213547' }}>{name}</Typography>
        <IconButton onClick={handleFavorite} sx={{ color: favorite ? '#FFD60A' : '#bbb', transition: 'color 0.2s' }}>
          <FavoriteIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ color: '#4A4039', mb: 0.5, fontSize: 15, minHeight: 20 }}>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
        <Chip icon={<AttachMoneyIcon sx={{ color: '#A3BFFA' }} />} label={`${budget} ₽`} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        <Chip icon={<AccessTimeIcon sx={{ color: '#A9CBA4' }} />} label={`${time} ч`} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
        <Chip icon={getWeatherIcon(weather)} label={weather === 'sunny' ? 'Солнечно' : weather === 'cloudy' ? 'Облачно' : 'Дождь'} size="small" sx={{ bgcolor: '#F5F8FF', fontWeight: 600 }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        {[1,2,3,4,5].map((val) => (
          <IconButton
            key={val}
            size="small"
            onClick={() => handleRate(val)}
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