import { Box, IconButton, LinearProgress, Link, Popover, Tooltip, Typography } from '@mui/material'
import { Help, Share, DarkMode, LightMode, Map } from '@mui/icons-material'
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import questData from './json/quest_v6.json'
import Card from './Card'
import Grid2 from '@mui/material/Unstable_Grid2'
import ExportImportDialog from './ExportImportDialog';
import HelpDialog from './HelpDialog';
import MapDialog from './MapDialog';

// ! Keep in-line with CHANGELOG.md
const versionString = '1.1.0';

// sorry in advance to anyone who sees this file for i have sinned

const defaultState = questData.map(zone => {
  return Object.fromEntries(zone.map(quest => [
    quest.name,
    ['Zone Campaign', 'Hope, An Anomaly'].includes(quest.name) ? true : false
  ]));
});

const questXPValues = questData.map(zone => {
  return Object.fromEntries(zone.map(quest => [quest.name, quest.totalXP]));
})

const questCoordValues = questData.map(zone => {
  return Object.fromEntries(zone.map(quest => [quest.name, quest.mapCoords]));
})

const characterLevelThresholds = [
  225100, // 70 > 71
  247300, // 71 > 72
  270300, // 72 > 73
  293500, // 73 > 74
  317400, // 74 > 75
  342100, // 75 > 76
  366800, // 76 > 77
  392300, // 77 > 78
  418400, // 78 > 79
  445000, // 79 > 80
]

function reducer(state, action) {
  if (action.doFullReset) {
    return defaultState;
  }
  return state.map((item, zone) =>
    zone === action.zone
      ? { ...item, [action.questName]: !item[action.questName] }
      : item
  );
}

export default function QuestlinePicker({ zone, darkMode, setDarkMode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(70);
  const [leftoverXP, setLeftoverXP] = useState(0);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [mapTipPopoverOpen, setMapTipPopoverOpen] = useState(false);
  const mapIconRef = useRef();

  // Special variable to prevent certain actions until the on-load
  // actions have finished
  const [initialLoadBuffer, setInitialLoadBuffer] = useState(false);

  const handleCardClick = useCallback((questName) => {
    dispatch({ zone, questName });
  }, [zone])

  const handleOpenShareDialog = () => {
    setShareDialogOpen(true);
  }

  const handleOpenHelpDialog = () => {
    setHelpDialogOpen(true);
  }

  const handleOpenMapDialog = () => {
    setMapDialogOpen(true);
  }

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  }

  const handleImportClick = (importedState) => {
    dispatch({ doFullReset: true });
    importedState.forEach((zone, i) => {
      Object.entries(zone).forEach(([questName, enabled]) => {
        if (enabled && questName !== 'Zone Campaign' && questName !== 'Hope, An Anomaly') {
          dispatch({ zone: i, questName });
        }
      })
    })
  }

  useEffect(() => {
    // i am WAY too lazy to make this a reduce
    let xp = 0;
    state.slice(0, zone + 1).forEach((zone, i) => {
      Object.entries(zone).forEach(([questName, enabled]) => {
        if (enabled) {
          xp += questXPValues?.[i]?.[questName] || 0;
        }
      });
    })

    setTotalXP(xp);
  }, [state, zone])

  useEffect(() => {
    // Do not save state until we've done initial load shenanigans
    if (initialLoadBuffer) {
      localStorage.setItem('questToggleState', JSON.stringify(state));
    }
  }, [state, initialLoadBuffer])

  useEffect(() => {
    const hasUserSeenHelpDialog = localStorage.getItem('hasUserSeenHelpDialog');
    if (!hasUserSeenHelpDialog) {
      setHelpDialogOpen(true);
      localStorage.setItem('hasUserSeenHelpDialog', true);
    }

    const hasUserSeenMapTip = localStorage.getItem('hasUserSeenHelpMapTip');
    if (!hasUserSeenMapTip) {
      setMapTipPopoverOpen(true);
      localStorage.setItem('hasUserSeenHelpMapTip', true);
    }

    // Initial load shenanigans, trying to load cached state from local storage
    const savedState = JSON.parse(localStorage.getItem('questToggleState'));
    if (savedState) {
      savedState.forEach((zone, i) => {
        Object.entries(zone).forEach(([questName, enabled]) => {
          // Don't try to dispatch enable zones that are enabled by default
          if (enabled && questName !== 'Zone Campaign' && questName !== 'Hope, An Anomaly') {
            dispatch({ zone: i, questName });
          }
        })
      })
    }
    setInitialLoadBuffer(true);
  }, [])

  useEffect(() => {
    const [finalXPLeft, finalLvl] = characterLevelThresholds.reduce(([xpLeft, lvlGain], curXPThreshold) => {
      if (xpLeft > curXPThreshold) {
        return [xpLeft - curXPThreshold, lvlGain + 1];
      }
      return [xpLeft, lvlGain];
    }, [totalXP, 0])
    setCurrentLevel(70 + finalLvl);
    setLeftoverXP(finalXPLeft);
  }, [totalXP])

  return (
    <Box>
      <HelpDialog
        open={helpDialogOpen}
        handleClose={() => setHelpDialogOpen(false)}
      />
      <ExportImportDialog
        open={shareDialogOpen}
        questState={state}
        handleClose={() => setShareDialogOpen(false)}
        handleImportClick={handleImportClick}
      />
      <MapDialog
        open={mapDialogOpen}
        setOpen={setMapDialogOpen}
        questState={state}
        questCoordValues={questCoordValues}
        questData={questData}
        darkMode={darkMode}
      />
      <Box sx={{
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        left: 0,
      }}>
        <Box>
          <IconButton
            color="default"
            onClick={handleOpenShareDialog}
            fontSize="large"
            sx={{
              transform: 'scale(1.5)',
              margin: "10px",
            }}
          >
            <Share fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={handleOpenHelpDialog}
            fontSize="large"
            sx={{
              transform: 'scale(1.5)',
              margin: "10px",
            }}
          >
            <Help fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={toggleDarkMode}
            fontSize="large"
            sx={{
              transform: 'scale(1.5)',
              margin: "10px",
            }}
          >
            {darkMode ? (
              <LightMode fontSize="inherit" />
            ) : (
              <DarkMode fontSize="inherit" />
            )}
          </IconButton>
          <IconButton
            onClick={handleOpenMapDialog}
            fontSize="large"
            sx={{
              transform: 'scale(1.5)',
              margin: "10px",
            }}
            ref={mapIconRef}
          >
            <Map fontSize="inherit" />
          </IconButton>
          <Popover
            open={mapTipPopoverOpen}
            anchorEl={mapIconRef.current}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            onClose={() => setMapTipPopoverOpen(false)}
          >
            <Typography
              sx={{
                padding: '5px'
              }}
            >
              {"< "} You can now view the map locations for selected quests!
            </Typography>
          </Popover>
        </Box>
        <Link
          href="https://github.com/ennukee/tww-xp-planner/blob/master/CHANGELOG.md"
          variant="body2"
          color="purple.light"
          textAlign="left"
          marginLeft="12px"
        >
          version {versionString}
        </Link>
      </Box>
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="5px"
        >
          Level {currentLevel}
          <Tooltip title="Reminder: These are not 100% accurate and may be slightly wrong in-game"><Help /></Tooltip>
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" gutterBottom>
          XP: {leftoverXP} / {characterLevelThresholds[currentLevel - 70]}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={leftoverXP / characterLevelThresholds[currentLevel - 70] * 100}
          sx={{
            height: "20px"
          }}
          color="purple"
        />
      </Box>
      <Grid2 container spacing={2} margin={1}>
        {questData[zone].map(quest => (
          <Grid2 item key={quest.name} xl={2} lg={3} md={4} xs={6}>
            <Card
              {...quest}
              enabled={state[zone][quest.name]}
              onClickCallback={() => handleCardClick(quest.name)}
            />
          </Grid2>
        ))}
        
      </Grid2>
    </Box>
  )
}
