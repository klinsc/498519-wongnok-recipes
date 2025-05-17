import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function NewRecipe({ open }: { open: boolean }) {
  // router
  const router = useRouter()

  // callback: handleClose
  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  // callback: handleSubmit
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      // Prevent default form submission
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      const formJson = Object.fromEntries(formData.entries())
      const recipeName = formJson['recipe-name'] as string
      console.log('recipeName', recipeName)

      handleClose()
    },
    [handleClose],
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: {
            width: '100%',
            maxWidth: '500px',
            margin: 'auto',
          },
        },
      }}>
      <DialogTitle>เพิ่มสูตรใหม่</DialogTitle>
      <DialogContent>
        <DialogContentText>
          กรอกชื่อสูตรอาหารใหม่ของคุณ
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="recipe-name"
          name="recipe-name"
          label="ชื่อสูตรอาหาร"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button type="submit">เพิ่ม</Button>
      </DialogActions>
    </Dialog>
  )
}
