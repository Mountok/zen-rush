import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// data: [{date: '2024-06-01', mood: 'Весело'}, ...]
// moodsList: ['Грустно', 'Нейтрально', 'Весело', ...]
// colors: { 'Грустно': '#90A4AE', 'Нейтрально': '#FFD60A', ... }

const MoodStatsChart = ({ data, moodsList, colors, loading, period, onPeriodChange, periods }) => {
  // Преобразуем mood в индекс для Y
  const moodToIndex = mood => moodsList.indexOf(mood);
  const indexToMood = idx => moodsList[idx] || 'Нет данных';

  // Для оси Y нужны индексы
  const chartData = data.map(item => ({
    ...item,
    moodIndex: moodToIndex(item.mood),
  }));

  return (
    <Box sx={{ width: '100%', mb: 3, p: 2, background: '#fff', borderRadius: 2, boxShadow: '0 2px 12px #A3BFFA22' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography fontWeight={700} fontSize={18} color="#213547">Статистика настроения</Typography>
        <Select
          size="small"
          value={period}
          onChange={e => onPeriodChange(e.target.value)}
          sx={{ ml: 'auto', minWidth: 80 }}
        >
          {periods.map(p => (
            <MenuItem key={p} value={p}>{p} дней</MenuItem>
          ))}
        </Select>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
          <CircularProgress sx={{ color: '#FFD60A' }} />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 13 }} />
            <YAxis
              dataKey="moodIndex"
              type="number"
              domain={[0, moodsList.length - 1]}
              tickFormatter={indexToMood}
              ticks={Array.from({ length: moodsList.length }, (_, i) => i)}
              tick={{ fontSize: 13 }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'moodIndex') {
                  return indexToMood(value);
                }
                return value;
              }}
              labelFormatter={label => `Дата: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="moodIndex"
              stroke="#FFD60A"
              strokeWidth={3}
              dot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: d => colors[data[d.payloadIndex]?.mood] || '#FFD60A' }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {data.length === 0 && !loading && (
        <Typography color="#888" fontSize={15} align="center" mt={2}>Нет данных для выбранного периода.</Typography>
      )}
    </Box>
  );
};

export default MoodStatsChart; 