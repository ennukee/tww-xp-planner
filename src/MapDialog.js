import { Close } from '@mui/icons-material';
import { AppBar, Box, Dialog, IconButton, ToggleButton, ToggleButtonGroup, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2';

import map0 from './img/map0.jpg';
import map1 from './img/map1.jpg';
import map2 from './img/map2.jpg';
import map3 from './img/map3.png';
import questIcon from './img/questicon.png';

const mapImages = [map0, map1, map2, map3];

export default function MapDialog({
  open,
  setOpen,
  questState,
  questCoordValues,
  questData,
}) {
  const [zone, setZone] = useState(0);
  const handleClose = () => {
    setOpen(false);
  }

  // dev handler to get coord data for quest json
  const handleImgClick = (event) => {
    const { clientX, clientY, target } = event;
    const { width, height, left, top } = target.getBoundingClientRect();
    const percentX = ((clientX - left) / width) * 100;
    const percentY = ((clientY - top) / height) * 100;
    console.log(`(CLICK!) X: ${percentX.toFixed(2)}, Y: ${percentY.toFixed(2)}`);
  }

  const handleTemporaryHide = (event) => {
    setTimeout(() => {
      event.target.style.display = 'block';
    }, 5000)
    event.target.style.display = 'none';
  }


  console.log(questCoordValues);

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={handleClose}
    >
      <AppBar sx={{ position: 'relative' }} color="purple">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close fontSize="inherit" />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ ml: 2,  flexGrow: 1 }}
            fontWeight="bold"
          >
            Quest Location Map Guide
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        gap={1}
        sx={{
          padding: "20px",
        }}
      >
        <ToggleButtonGroup value={zone} color="purple">
          <ToggleButton value={5} onClick={() => setZone(5)}>All Zones</ToggleButton>
          <ToggleButton value={0} onClick={() => setZone(0)}>Isle of Dorn</ToggleButton>
          <ToggleButton value={1} onClick={() => setZone(1)}>Ringing Deeps</ToggleButton>
          <ToggleButton value={2} onClick={() => setZone(2)}>Hallowfall</ToggleButton>
          <ToggleButton value={3} onClick={() => setZone(3)}>Ajz-Kahet</ToggleButton>
        </ToggleButtonGroup>
        <Typography>
          Please note that markers are not exact, and represent a general area where the quest can be found. Some markers are offset to prevent complete overlaps with other quests in the same spot.
        </Typography>
        <Typography>
          Make sure you read the notes for questlines you pick. Some require campaign progression to see, or have other issues with them.
        </Typography>
        <Typography>
          You can <b>temporarily hide</b> a marker by clicking on it. It will reappear after 5 seconds.
        </Typography>
        {zone === 5 && (
          <Grid2 container width="100%">
            {mapImages.map((map, index) => (
              <Grid2 item md={6} sm={12} key={index}>
                <Box sx={{position: 'relative'}}>
                  <img src={map} alt={`Zone ${index}`} width="100%" />
                  {Object.entries(questState[index]).filter(([,value]) => value).map(([key,]) => (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: `${questCoordValues?.[index]?.[key]?.y || -10000}%`,
                        left: `${questCoordValues?.[index]?.[key]?.x || -10000}%`,
                        zIndex: 100,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Tooltip
                        title={`${questData?.[index]?.find(q => q.name === key)?.startingQuest || ''} (${key})`}
                      >
                        <Box
                          onClick={handleTemporaryHide}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            padding: '7px 15px 3px 15px',
                            borderRadius: '50%',
                            transform: 'scale(0.75)',
                          }}
                        >
                          <img src={questIcon} alt={key} width="8" />
                        </Box>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Grid2>
            ))}
          </Grid2>
        )}
        {zone !== 5 && (
          <Box sx={{position: 'relative'}}>
            <img onClick={handleImgClick} src={mapImages[zone]} alt={`Zone ${zone}`} width="100%" />
            <Box
              sx={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,.5)',
                padding: '10px 20px',
                margin: '10px',
                borderRadius: '10px',
              }}
            >
              <Typography variant='h5' fontWeight="bold">
                Relevant Quests
              </Typography>
              {Object.entries(questState[zone])
                .filter(([key,value]) => value && key !== 'Zone Campaign')
                .map(([key,]) => (
                <Typography key={key}>
                  <b>{questData?.[zone]?.find(q => q.name === key)?.startingQuest || ''}</b> ({key})
                </Typography>
              ))}
            </Box>
            {Object.entries(questState[zone]).filter(([,value]) => value).map(([key,]) => (
              <Box
                sx={{
                  position: 'absolute',
                  top: `${questCoordValues?.[zone]?.[key]?.y || -10000}%`,
                  left: `${questCoordValues?.[zone]?.[key]?.x || -10000}%`,
                  zIndex: 100,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Tooltip
                  title={`${questData?.[zone]?.find(q => q.name === key)?.startingQuest || ''} (${key})`}
                >
                  <Box
                    onClick={handleTemporaryHide}
                    sx={{
                      backgroundColor: 'rgba(255, 200, 0, 0.25)',
                      padding: '7px 15px 3px 15px',
                      borderRadius: '50%',
                    }}
                  >
                    <img src={questIcon} alt={key} width="8" />
                  </Box>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Dialog>
  )
}
