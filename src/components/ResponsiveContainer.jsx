import React from 'react';
import Box from '@mui/material/Box';

const ResponsiveContainer = ({ children, maxWidth = 'lg', ...props }) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',
          sm: 600,
          md: maxWidth === 'sm' ? 600 : maxWidth === 'md' ? 900 : maxWidth === 'lg' ? 1200 : 1400,
          lg: maxWidth === 'sm' ? 600 : maxWidth === 'md' ? 900 : maxWidth === 'lg' ? 1200 : 1400,
          xl: maxWidth === 'sm' ? 600 : maxWidth === 'md' ? 900 : maxWidth === 'lg' ? 1200 : 1600,
        },
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer; 