import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material'
import React from 'react'

export default function HelpDialog({
  open = false,
  handleClose = () => {},
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth="lg"
    >
      <DialogTitle>The War Within QuestXP Helper</DialogTitle>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: "10px",
      }}>
        <DialogContentText gutterBottom>
          This tool will help provide some general assistance in planning out which sidequests you want to do alongside the main campaign questline
        </DialogContentText>
        <DialogContentText gutterBottom>
          The output is <b>NOT precise</b> and will not 100% line up with in-game results. Keep this in mind and <b>plan buffers</b>.
        </DialogContentText>
        <DialogContentText gutterBottom>
          You can optionally use this tool with the more in-depth document <Link href="https://docs.google.com/document/d/1ZEnV5fJmEBNAUNZARHEQ1keDlAL9RQ7yK2wqyIx3Rr8/edit?usp=sharing">seen here</Link>. This document contains more exact XP information as well as quest IDs for every quest that I've tracked
        </DialogContentText>
        <DialogContentText gutterBottom>
          This is <b>NOT EXHAUSTIVE</b>. There are many quests that are not tracked, but many of the notable questlines are. Delve quests are ignored in Hallowfall onward due to scaling issues slowing them down substantially.
        </DialogContentText>
        <DialogContentText gutterBottom>
          If you have done quests not here yourself, and want to provide your opinions, feel free to reach out Discord @ ennukee. Don't just give me the total XP, though, because I can also look at Wowhead for that. 
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
