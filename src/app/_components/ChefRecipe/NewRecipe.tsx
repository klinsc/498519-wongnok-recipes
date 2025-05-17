import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'

export default function NewRecipe({ open }: { open: boolean }) {
  // router
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const email = formJson.email
            console.log(email)
            handleClose()
          },
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
