import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { authAPI } from '../services/api';
import AuthModal from '../components/AuthModal';
import ResponsiveContainer from '../components/ResponsiveContainer';

const MOOD_OPTIONS = [
  { label: "Очень грустно", icon: <SentimentVeryDissatisfiedIcon />, color: "#4A90E2" },
  { label: "Грустно", icon: <SentimentDissatisfiedIcon />, color: "#A0A0A0" },
  { label: "Спокойно", icon: <SentimentNeutralIcon />, color: "#A3BFFA" },
  { label: "Нейтрально", icon: <SentimentNeutralIcon />, color: "#FFD60A" },
  { label: "Хорошо", icon: <SentimentSatisfiedIcon />, color: "#A9CBA4" },
  { label: "Весело", icon: <SentimentVerySatisfiedIcon />, color: "#4CD964" },
  { label: "Вдохновлён", icon: <SentimentVerySatisfiedIcon />, color: "#FF9500" },
];

const TIME_OPTIONS = [
  { value: 1, label: "1 час" },
  { value: 2, label: "2 часа" },
  { value: 4, label: "4 часа" },
  { value: 6, label: "6 часов" },
  { value: 8, label: "8 часов" },
];

const getMoodColor = (moodIndex) => MOOD_OPTIONS[moodIndex]?.color || "#A9CBA4";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [mood, setMood] = useState(3.0); // по умолчанию "Нейтрально"
  const [time, setTime] = useState(2);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(2000);
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState('Город');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[Geo] useEffect запущен');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          console.log('[Geo] Получены координаты:', coords);
          setUserLocation(coords);
        },
        (error) => {
          console.log('[Geo] Ошибка геолокации:', error);
          setGeoError(error.message);
        }
      );
    } else {
      console.log('[Geo] Геолокация не поддерживается браузером');
      setGeoError("Геолокация не поддерживается браузером");
    }
  }, []);

  useEffect(() => {
    console.log('[Geo] userLocation изменился:', userLocation);
  }, [userLocation]);

  useEffect(() => {
    console.log('[Geo] geoError изменился:', geoError);
  }, [geoError]);

  useEffect(() => {
    if (userLocation) {
      const fetchWeather = async () => {
        const accessKey = 'c482ac0a-4de8-4540-a232-da6c72b6d770';
        const headers = {
          'X-Yandex-Weather-Key': accessKey
        };
        const url = `https://api.weather.yandex.ru/v2/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}`;
        try {
          console.log('[Weather] Запрос:', url, headers);
          const response = await axios.get(url, { headers });
          console.log('[Weather] Ответ:', response.data);
          setTemperature(Math.round(response.data.fact.temp));
        } catch (err) {
          console.log('[Weather] Ошибка:', err);
          setTemperature(null);
        }
      };
      fetchWeather();
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      // Получение города через Geoapify
      const fetchCity = async () => {
        const apiKey = '1b8c4d845762401eadc02ee91389b1ff';
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${userLocation.lat}&lon=${userLocation.lon}&type=city&lang=ru&apiKey=${apiKey}`;
        try {
          const response = await axios.get(url);
          const cityName = response.data.features[0]?.properties?.city;
          setCity(cityName || 'Город');
        } catch (err) {
          setCity('Город');
        }
      };
      fetchCity();
    }
  }, [userLocation]);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    setIsAuthenticated(authAPI.isAuthenticated());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    const moodIndex = Math.round(mood);
    navigate("/recommendations", {
      state: { 
        mood: MOOD_OPTIONS[moodIndex].label, 
        time, 
        minBudget, 
        maxBudget, 
        userLocation: {
          ...userLocation,
          temperature
        }
      },
    });
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  return (
    <Box sx={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden',
      pb: { xs: 7, md: 0 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      px: { xs: 2, md: 4 },
    }}>
      {/* Погода и аутентификация */}
      <Box sx={{
        position: 'absolute',
        top: { xs: 16, md: 24 },
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 10,
      }}>
        <Paper elevation={3} sx={{
          borderRadius: 3,
          px: 2,
          py: 0.5,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          color: '#4A4039',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: 14,
          width: 'fit-content',
        }}>
          <Typography variant="body2" fontWeight={600}>
            ☀️ {city}
            {temperature !== null ? `: ${temperature}°C` : ""}
          </Typography>
        </Paper>
        
        {isAuthenticated ? (
          <IconButton
            onClick={handleLogout}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              color: '#F4A261',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.95)',
                color: '#E76F51',
              }
            }}
          >
            <LogoutIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => setShowAuthModal(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              color: '#4A90E2',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.95)',
                color: '#357ABD',
              }
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        )}
      </Box>

      {/* Основной контент */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        pt: { xs: 6, md: 8 },
        px: 0,
      }}>
        <ResponsiveContainer maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" fontWeight={700} sx={{ 
              color: '#fff', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              Куда сходить?
            </Typography>
            <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              textShadow: '0 1px 5px rgba(0,0,0,0.3)'
            }}>
              Получи персональные рекомендации
            </Typography>
          </Box>

          {/* Настроение */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: '#fff', 
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              textShadow: '0 1px 5px rgba(0,0,0,0.3)'
            }}>
              Как твое настроение?
            </Typography>
            
            {/* Анимированная иконка настроения */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2,
              width: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s ease',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}>
                <Box sx={{
                  color: getMoodColor(Math.round(mood)),
                  fontSize: { xs: '6rem', md: '7rem' },
                  transition: 'all 0.3s ease',
                  animation: 'pulse 2s infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.08)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}>
                  {MOOD_OPTIONS[Math.round(mood)].icon}
                </Box>
              </Box>
            </Box>
            
            {/* Ползунок настроения */}
            <Box sx={{ width: '100%', px: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 1,
                minHeight: 40
              }}>
                <Typography fontSize={16} fontWeight={700} color="#fff" textAlign="center" sx={{
                  textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  width: 'fit-content',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(5px)'
                }}>
                  {MOOD_OPTIONS[Math.round(mood)].label}
                </Typography>
              </Box>
              <Slider
                min={0}
                max={MOOD_OPTIONS.length - 1}
                value={mood}
                onChange={(_, val) => setMood(Number(val))}
                step={0.01}
                marks={false}
                sx={{
                  width: '100%',
                  color: getMoodColor(Math.round(mood)),
                  mb: 0,
                  '& .MuiSlider-thumb': {
                    bgcolor: getMoodColor(Math.round(mood)),
                    border: '3px solid #fff',
                    width: 20,
                    height: 20,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    }
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.3,
                    bgcolor: getMoodColor(Math.round(mood)),
                    transition: 'background 0.3s',
                    height: 6,
                    borderRadius: 3,
                  },
                  '& .MuiSlider-track': {
                    bgcolor: getMoodColor(Math.round(mood)),
                    transition: 'background 0.3s',
                    height: 6,
                    borderRadius: 3,
                  },
                  height: 6,
                }}
              />
            </Box>
          </Box>

          {/* Время */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: '#fff', 
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              textShadow: '0 1px 5px rgba(0,0,0,0.3)'
            }}>
              Сколько времени у тебя есть?
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              justifyContent: 'center' 
            }}>
              {TIME_OPTIONS.map((option) => (
                <Paper
                  key={option.value}
                  elevation={time === option.value ? 8 : 2}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    bgcolor: time === option.value ? '#A9CBA4' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: time === option.value ? '2px solid #A9CBA4' : '2px solid transparent',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    }
                  }}
                  onClick={() => setTime(option.value)}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    <AccessTimeIcon sx={{ 
                      color: time === option.value ? '#fff' : '#A9CBA4',
                      fontSize: { xs: '1.5rem', md: '2rem' }
                    }} />
                    <Typography sx={{ 
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      fontWeight: 600,
                      color: time === option.value ? '#fff' : '#333'
                    }}>
                      {option.label}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Бюджет */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ 
              color: '#fff', 
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              textShadow: '0 1px 5px rgba(0,0,0,0.3)'
            }}>
              Какой бюджет?
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <TextField
                label="От"
                type="number"
                size="medium"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                inputProps={{ 
                  min: 0, 
                  max: maxBudget,
                  style: { 
                    textAlign: 'center', 
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 600
                  } 
                }}
                sx={{
                  width: { xs: 120, md: 140 },
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255,255,255,1)',
                      borderColor: '#FFD60A',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#FFD60A',
                    }
                  }
                }}
              />
              <Typography sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                textShadow: '0 1px 5px rgba(0,0,0,0.3)'
              }}>
                —
              </Typography>
              <TextField
                label="До"
                type="number"
                size="medium"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                inputProps={{ 
                  min: minBudget, 
                  max: 10000,
                  style: { 
                    textAlign: 'center', 
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 600
                  } 
                }}
                sx={{
                  width: { xs: 120, md: 140 },
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255,255,255,1)',
                      borderColor: '#FFD60A',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#FFD60A',
                    }
                  }
                }}
              />
              <Typography sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                textShadow: '0 1px 5px rgba(0,0,0,0.3)'
              }}>
                ₽
              </Typography>
            </Box>
          </Box>

          {/* Кнопка */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                color: '#333',
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.2rem' },
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(255,255,255,1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                },
              }}
            >
              Получить рекомендации
            </Button>
          </Box>

          {geoError && (
            <Typography color="#ffebee" sx={{ mt: 2, textAlign: 'center', fontSize: 14 }}>
              {geoError}
            </Typography>
          )}
        </ResponsiveContainer>
      </Box>
      
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </Box>
  );
};

export default Home; 