import { Box, Button, CardActions, CardContent, Card as MUICard, Tooltip, Typography } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import React from 'react'

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
  questSteps = 0,
  enabled = false,
  onClickCallback = () => {},
}) {
  return (
    <MUICard variant="outlined" sx={{
      borderColor: enabled ? "purple.main" : "",
    }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>{name}</Typography>
        {startingQuest && <Typography variant="body2" color="text.secondary">
          Started by <b>{startingQuest}</b>
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
            <Typography sx={{cursor: 'default', marginBottom: "-20px"}} fontSize="10px" color="text.secondary">additional notes, hover me</Typography>
          </Tooltip>
        )}
      </CardContent>
      {!campaign && <CardActions>
        <Button
          size="small"
          color={enabled ? "error" : "success"}
          onClick={onClickCallback}
        >
          {enabled ? "Remove from complete list" : "Add to complete list"}
        </Button>
      </CardActions>}
    </MUICard>
  )
}
