import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const MOOD_OPTIONS = [
  { label: "Очень грустно", color: "#4A90E2" },
  { label: "Грустно", color: "#A0A0A0" },
  { label: "Спокойно", color: "#A3BFFA" },
  { label: "Нейтрально", color: "#FFD60A" },
  { label: "Хорошо", color: "#A9CBA4" },
  { label: "Весело", color: "#4CD964" },
  { label: "Вдохновлён", color: "#FF9500" },
];

const getMoodColor = (moodIndex) => MOOD_OPTIONS[moodIndex]?.color || "#A9CBA4";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [mood, setMood] = useState(3); // по умолчанию "Нейтрально"
  const [time, setTime] = useState(1);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(10000);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(coords);
        },
        (error) => {
          setGeoError(error.message);
        }
      );
    } else {
      setGeoError("Геолокация не поддерживается браузером");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/recommendations", {
      state: { mood: MOOD_OPTIONS[mood].label, time, minBudget, maxBudget, userLocation },
    });
  };

  return (
    <Box sx={{
      minHeight: '100dvh',
      position: 'relative',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      overflow: 'hidden',
      pb: 7, // для нижнего меню
    }}>
      <Paper elevation={3} sx={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 3,
        px: 2,
        py: 0.5,
        bgcolor: '#fff',
        color: '#4A4039',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 10,
        fontSize: 14,
      }}>
        <Typography variant="body2" fontWeight={600}>
          ☀️ {userLocation ? `lat: ${userLocation.lat.toFixed(2)}, lon: ${userLocation.lon.toFixed(2)}` : "Грозный"}: 18°C
        </Typography>
      </Paper>
      {/* Волны */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}>
        <svg height="80" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          <path d="M0,60 C480,120 960,0 1440,60 L1440,0 L0,0 Z" fill="#A3BFFA" fillOpacity="0.18" />
        </svg>
      </Box>
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        pt: 7,
        pb: 0,
      }}>
        <Typography variant="h5" fontWeight={700} sx={{
          color: '#213547',
          textShadow: '0 2px 8px #fff8, 0 1px 0 #fff',
          mb: 2,
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 22,
          lineHeight: 1.1,
        }}>
          Куда сходить? Получи рекомендации!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2.5,
          background: 'none',
          boxShadow: 'none',
          border: 'none',
          p: 0,
        }}>
          {/* Настроение */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '100%' }}>
            <Typography htmlFor="mood" fontWeight={600} mb={0.2} fontSize={15}>
              Настроение
            </Typography>
            <Typography fontSize={17} fontWeight={700} color={getMoodColor(mood)} mb={0.5} minHeight={22}>
              {MOOD_OPTIONS[mood].label}
            </Typography>
            <Slider
              id="mood"
              min={0}
              max={MOOD_OPTIONS.length - 1}
              value={mood}
              onChange={(_, val) => setMood(Number(val))}
              step={1}
              marks={false}
              sx={{
                width: 170,
                color: getMoodColor(mood),
                mb: 0,
                mt: 0.5,
                '& .MuiSlider-thumb': {
                  bgcolor: getMoodColor(mood),
                  border: '2px solid #fff',
                  width: 18,
                  height: 18,
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  bgcolor: getMoodColor(mood),
                },
                '& .MuiSlider-track': {
                  bgcolor: getMoodColor(mood),
                },
                height: 6,
              }}
            />
          </Box>
          {/* Время */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '100%' }}>
            <Typography htmlFor="time" fontWeight={600} mb={0.2} fontSize={15}>Время (часы)</Typography>
            <Slider
              id="time"
              min={1}
              max={24}
              value={time}
              onChange={(_, val) => setTime(Number(val))}
              step={1}
              sx={{
                color: '#A9CBA4',
                width: 170,
                mb: 0.5,
                '& .MuiSlider-thumb': {
                  width: 18,
                  height: 18,
                },
                height: 6,
              }}
            />
            <Typography textAlign="center" fontWeight={500} fontSize={15}>{time} {time === 1 ? "час" : time < 5 ? "часа" : "часов"}</Typography>
          </Box>
          {/* Бюджет */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '100%' }}>
            <Typography htmlFor="budget" fontWeight={600} mb={0.2} fontSize={15}>Бюджет (₽)</Typography>
            <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography fontSize={13} color="#888">от</Typography>
                <input
                  type="number"
                  min={0}
                  max={maxBudget}
                  value={minBudget}
                  onChange={e => setMinBudget(Number(e.target.value))}
                  style={{
                    width: 60,
                    borderRadius: 6,
                    border: '1px solid #A3BFFA',
                    padding: '4px 8px',
                    fontSize: 15,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography fontSize={13} color="#888">до</Typography>
                <input
                  type="number"
                  min={minBudget}
                  max={10000}
                  value={maxBudget}
                  onChange={e => setMaxBudget(Number(e.target.value))}
                  style={{
                    width: 60,
                    borderRadius: 6,
                    border: '1px solid #A3BFFA',
                    padding: '4px 8px',
                    fontSize: 15,
                    outline: 'none',
                    textAlign: 'center',
                  }}
                />
              </Box>
            </Box>
          </Box>
          {/* Кнопка */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 6,
              background: '#4CD964',
              color: '#fff',
              fontWeight: 700,
              fontSize: 17,
              py: 1,
              boxShadow: '0 2px 12px rgba(169,203,164,0.18)',
              mt: 1,
              textShadow: '0 1px 4px #0002',
              width: 170,
              minHeight: 38,
              '&:hover': {
                background: '#43c85a',
              },
            }}
          >
            Получить рекомендации
          </Button>
        </Box>
        {geoError && <Typography color="#e74c3c" mt={1}>{geoError}</Typography>}
      </Box>
    </Box>
  );
};

export default Home; 