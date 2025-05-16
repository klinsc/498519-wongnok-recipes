/* eslint-disable @next/next/no-img-element */

import { Box, Stack, Typography } from '@mui/material'

export default function SiteIcon() {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        width: 'fit-content',
        height: '32px',
        padding: '4px 8px',
        borderRadius: '8px',
      }}>
      <Box
        sx={{
          width: '32px',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        <img
          src="/android-chrome-192x192.png"
          alt="Sitemark"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Stack>
        <Typography
          variant="h5"
          sx={{
            color: (theme) => theme.palette.text.primary,
          }}>
          วงนอก
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            color: (theme) => theme.palette.text.primary,
          }}>
          เมนูโปรดใกล้ฉัน
        </Typography>
      </Stack>
    </Stack>
  )
}
