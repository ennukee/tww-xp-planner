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
      <DialogTitle>The War Within Quest XP Helper</DialogTitle>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: "10px",
      }}>
        <DialogContentText gutterBottom>
          This tool will help provide some general assistance in planning out which sidequests you want to do alongside the main campaign questline
        </DialogContentText>
        <DialogContentText gutterBottom>
          <b>DISCLAIMER</b>: This tool is <b>NOT</b> exact. It is based on personal testing and some estimations for monster XP gains. It is also <b>based on the Beta</b>, so some things <b>may change</b> before it goes live. <b>Plan accordingly.</b>
        </DialogContentText>
        <DialogContentText gutterBottom>
          Ratings are based on the <b>solo experience</b>. It does not account for potential issues with quest objectives not sharing in groups.
        </DialogContentText>
        <DialogContentText gutterBottom>
          You can optionally use this tool with the more in-depth document <Link href="https://docs.google.com/document/d/1ZEnV5fJmEBNAUNZARHEQ1keDlAL9RQ7yK2wqyIx3Rr8/edit?usp=sharing">seen here</Link>. This document contains more granular data, and some additional notes if you're interested.
        </DialogContentText>
        <DialogContentText gutterBottom>
          This is <b>NOT EXHAUSTIVE</b>. Most quests in the Sojourner achievements are included. Delve quests are intentionally excluded in Hallowfall onward due to level scaling.
        </DialogContentText>
        <DialogContentText gutterBottom>
          Feedback to <b>@ennukee</b> on Discord
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
