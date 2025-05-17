/* eslint-disable @next/next/no-img-element */
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Box, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function ImageUploader({
  setFile,
  file,
}: {
  setFile: (file: File | null) => void
  file: File | null
}) {
  // Callback: handleChange
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (files) {
      console.log('Selected files:', files)

      const selectedFile = files[0]
      if (!selectedFile) {
        console.error('No file selected')
        return
      }

      // Check if the file is an image
      const isImage = selectedFile.type.startsWith('image/')
      if (!isImage) {
        console.error('Selected file is not an image')
        return
      }

      // Check if the file size is less than 5MB
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (selectedFile.size > maxSize) {
        console.error('Selected file is too large')
        return
      }

      // Set the file state
      setFile(selectedFile)
      console.log('File size:', selectedFile.size)
      console.log('File type:', selectedFile.type)
      console.log('File name:', selectedFile.name)
    }
  }

  // Display the selected image in image preview
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}>
      {file ? (
        <Box
          sx={{
            maxHeight: '194px',
          }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            style={{
              // position: 'absolute',
              width: 'auto',
              height: 'auto',
              maxWidth: '300px',
              maxHeight: '194px',
            }}
          />
        </Box>
      ) : (
        <Typography
          component="div"
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}>
          No image selected
        </Typography>
      )}
      <Button
        sx={{
          position: 'absolute',
        }}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}>
        อัพโหลดรูปภาพใหม่
        <VisuallyHiddenInput
          type="file"
          onChange={handleChange}
          accept="image/*"
        />
      </Button>
    </Box>
  )
}
