/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Avatar, Box, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { stringAvatar } from '../AppAvatar'

export default function Profile({ userID }: { userID: string }) {
  const { data: session } = useSession()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',

        // width: '100%',
        // padding: 2,
        // borderRadius: 2,
        // backgroundColor: '#f5f5f5',
        // boxShadow: 1,
      }}>
      <Avatar
        alt={session?.user?.name ?? ''}
        src={session?.user?.image ?? ''}
        style={{ width: 72, height: 72 }}
        {...stringAvatar(session?.user?.name || 'User Name')}
      />
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#333',
          marginTop: 1,
        }}>
        เชฟ {session?.user?.name}
      </Typography>

      <Typography
        variant="body1"
        component="p"
        sx={{
          fontSize: '1rem',
          color: '#666',
        }}>
        เรามาอวดสูตรอาหารของคุณดีกว่า
      </Typography>
    </Box>
  )
}
