import React, { useEffect, useMemo, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { deepPurple } from '@mui/material/colors';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
import CssBaseline from '@mui/material/CssBaseline'
import QuestlinePicker from './QuestlinePicker';

import isleOfDornImg from './img/0.jpeg';
import ringingDeepsImg from './img/1.jpeg';
import hallowfallImg from './img/2.jpeg';
import ajzKahetImg from './img/3.jpeg';

const zones = ['Isle of Dorn', 'Ringing Deeps', 'Hallowfall', 'Azj-Kahet'];
const zoneBgs = [isleOfDornImg, ringingDeepsImg, hallowfallImg, ajzKahetImg];

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
        ...(
          darkMode
            ? {
              purple: {
                main: deepPurple[500],
                light: deepPurple[200],
              }
            }
            : {
              purple: {
                main: deepPurple[900],
                light: deepPurple[500],
              }
            }
        ),
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

  const bg = useMemo(() => {
    if (darkMode) {
      return `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.7), rgba(0,0,0,.9)), url(${zoneBgs[zone]})`;
    } else {
      return `linear-gradient(rgba(255,255,255,.7), rgba(255,255,255,.3), rgba(0,0,0,.9)), url(${zoneBgs[zone]})`;
    }
  }, [darkMode, zone])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: bg,
          backgroundSize: 'cover',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
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
            sx={{
              fontFamily: 'LifeCraft',
            }}
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
        <QuestlinePicker zone={zone} darkMode={darkMode} setDarkMode={setDarkMode} />
      </Box>
    </ThemeProvider>
  )
}
