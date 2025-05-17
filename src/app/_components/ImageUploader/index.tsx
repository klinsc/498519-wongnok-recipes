import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useState } from 'react'

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

export default function ImageUploader() {
  // State: file
  const [file, setFile] = useState<File | null>(null)

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

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}>
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleChange}
        accept="image/*"
      />
    </Button>
  )
}
