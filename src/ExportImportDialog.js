import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

export default function ExportImportDialog({
  open = false,
  handleClose = () => {},
  questState = [],
  handleImportClick = () => {},
}) {
  const [importString, setImportString] = useState('');
  const [recentlyExported, setRecentlyExported] = useState(false);

  const handleCreateExportString = useCallback(() => {
    const trueOnlyQuestState = questState.map(zone => {
      return Object.fromEntries(
        Object.entries(zone).filter(([_, value]) => value));
    });
    const exportString = JSON.stringify(trueOnlyQuestState);
    const hashedString = btoa(encodeURIComponent(exportString));
    setImportString(hashedString);
    setRecentlyExported(true);
  }, [questState]);

  const handleProcessImportString = useCallback(() => {
    const decodedString = decodeURIComponent(atob(importString));
    const parsedString = JSON.parse(decodedString);

    handleImportClick(parsedString);
  }, [importString, handleImportClick])

  const handleImportStringChange = (event) => {
    setImportString(event.target.value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentlyExported(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    }
  }, [recentlyExported])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth="lg"
    >
      <DialogTitle>Export / Import Quest Plans</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Use the field below to <b>import</b> someone else's string. Use generate export button on the bottom to <b>create</b> a string to share.
        </DialogContentText>
        <TextField
          sx={{
            marginTop: "15px"
          }}
          label="Import string"
          fullWidth
          value={importString}
          onChange={handleImportStringChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProcessImportString}>Import</Button>
        <Button
          color={recentlyExported ? "success" : "primary"}
          onClick={handleCreateExportString}
        >
          {recentlyExported ? "Successfully Exported" : "Generate Export"}
        </Button>
        <Button color="error" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
