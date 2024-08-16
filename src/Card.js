import { Box, Button, CardActions, CardContent, Link, Card as MUICard, Tooltip, Typography } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import React from 'react'
import { Add, Notes, Remove } from '@mui/icons-material';

function formatNumber(number) {
  return (number / 1000).toFixed(1) + 'K';
}

const getTextColorByScore = (rating) => {
  const percentage = (rating - 1) / 9;
  const red = Math.round(255 * (1 - percentage));
  const green = Math.round(255 * percentage);
  return `rgb(${red}, ${green}, 0)`;
};

export default function Card({
  name = "Something went wrong!",
  campaign = false,
  totalXP,
  rating = -1,
  ratingJustification = '',
  notes = '',
  startingQuest = '',
  startingLocation = '',
  startingQuestId = 0,
  questSteps = 0,
  enabled = false,
  onClickCallback = () => {},
}) {
  return (
    <MUICard variant="outlined" sx={{
      borderColor: enabled ? "purple.main" : "",
    }}>
      <CardContent
        sx={{
          paddingBottom: 0,
        }}
      >
        <Typography variant="h5" gutterBottom>{name}</Typography>
        {startingQuest && <Typography variant="body2" color="text.secondary">
          Started by&nbsp;
          <Link color="purple.light" href={`https://www.wowhead.com/quest=${startingQuestId}`} target="_blank" rel="noreferrer">{startingQuest}</Link>
        </Typography>}
        {startingLocation && <Typography variant="body2" color="text.secondary" gutterBottom>
          Located at <b>{startingLocation}</b>
        </Typography>}
        <Box sx ={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: "5px",
          marginBottom: "3px",
        }}>
          <Typography variant="body1" fontWeight="500">
            {formatNumber(totalXP)} XP
          </Typography>
          <Typography sx={{ fontSize: "10px" }} color="text.secondary">
            ({questSteps} steps)
          </Typography>
        </Box>
        {rating > 0 && <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: "5px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '3px',
            }}
          >
            Rating:
            <Typography
              fontWeight="bold"
              sx={{
                color: getTextColorByScore(rating)
              }}
            >
              {rating}/10
            </Typography>
          </Typography>
          {ratingJustification && (<Tooltip title={ratingJustification} placement="right">
            <HelpIcon fontSize="small" />
          </Tooltip>)}
        </Box>}
        {notes && (
          <Tooltip title={notes} placement="left">
            <Typography
              sx={{
                cursor: 'default',
              }}
              lineHeight="14px"
              fontSize="11px"
              color="text.secondary"
            >
              <Notes fontSize="inherit" /> additional notes
            </Typography>
          </Tooltip>
        )}
      </CardContent>
      {!campaign && <CardActions>
        <Button
          size="small"
          color={enabled ? "error" : "success"}
          onClick={onClickCallback}
          sx={{
            fontSize: "16px",
            display: 'flex',
            flexDirection: 'row',
            gap: "5px",
          }}
        >
          {enabled ? <Remove fontSize="inherit" /> : <Add fontSize="inherit" />}
          {enabled ? "REMOVE" : "ADD"}
        </Button>
      </CardActions>}
    </MUICard>
  )
}
