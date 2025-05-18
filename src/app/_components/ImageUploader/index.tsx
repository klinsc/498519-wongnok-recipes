/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useEffect } from 'react'

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
  setPreparedFile,
  preparedFile,
  handleUpload,
}: {
  setPreparedFile: (
    fileObj: { file: File; fileExtension: string } | null,
  ) => void
  preparedFile: {
    file: File
    fileExtension: string
  } | null
  handleUpload: (fileObj: {
    file: File
    fileExtension: string
  }) => void
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

      const fileExtension = selectedFile.name.split('.').pop() || ''
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        console.error('Selected file is not a valid image format')
        return
      }

      // Set the file state
      setPreparedFile({
        file: selectedFile,
        fileExtension: fileExtension,
      })
      console.log('File size:', selectedFile.size)
      console.log('File type:', selectedFile.type)
      console.log('File name:', selectedFile.name)
    }
  }

  // Effect: handleUpload on file change
  useEffect(() => {
    if (preparedFile) {
      console.log('File changed:', preparedFile)
      handleUpload(preparedFile)
    }
  }, [preparedFile, handleUpload])

  // Display the selected image in image preview
  return (
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
  )
}
