import { Snackbar, Alert, type AlertColor } from '@mui/material'

interface NotiAlertProps {
  open: boolean
  message: string
  severity: AlertColor
  handleClose: () => void
}

export default function NotiAlert({
  open,
  message,
  severity,
  handleClose,
}: NotiAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
