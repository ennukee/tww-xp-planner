import React, { useEffect, useMemo, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { deepPurple } from '@mui/material/colors';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
import CssBaseline from '@mui/material/CssBaseline'
import QuestlinePicker from './QuestlinePicker';

const zones = ['Isle of Dorn', 'Ringing Deeps', 'Hallowfall', 'Ahj-Kahet'];

export default function Main() {
  const [zone, setZone] = useState(0);
  const [darkMode, setDarkMode] = useState();

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        purple: {
          main: deepPurple[500],
        }
      },
    });
  }, [darkMode]);

  const handleZoneChange = (direction) => {
    if (direction === 'left') {
      setZone((prevZone) => Math.max(prevZone - 1, 0));
    } else {
      setZone((prevZone) => Math.min(prevZone + 1, 3));
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}>
          <IconButton
            size="large"
            sx={{transform: "scale(1.5)", margin: "0 10px"}}
            onClick={() => handleZoneChange('left')}
            disabled={zone === 0}
          >
            <KeyboardDoubleArrowLeftIcon fontSize="inherit" />
          </IconButton>
          <Typography
            variant="h1"
            fontWeight="bold"
            width={700}
            textAlign="center"
          >
            {zones[zone]}
          </Typography>
          <IconButton
            size="large"
            sx={{transform: "scale(1.5)", margin: "0 10px"}}
            onClick={() => handleZoneChange('right')}
            disabled={zone === 3}
          >
            <KeyboardDoubleArrowRight fontSize="inherit" />
          </IconButton>
        </Box>
        <QuestlinePicker zone={zone} />
      </Box>
    </ThemeProvider>
  )
}
