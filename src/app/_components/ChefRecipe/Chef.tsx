/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Avatar, Box, Skeleton, Typography } from '@mui/material'
import { api } from '~/trpc/react'
import { stringAvatar } from '../AppAvatar'

export default function Chef({ userID }: { userID: string }) {
  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = api.user.getUserById.useQuery(
    {
      id: userID,
    },
    {
      enabled: !!userID,
      refetchOnWindowFocus: false,
    },
  )

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
      {isUserLoading || isUserFetching ? (
        <>
          <Skeleton
            variant="circular"
            width={72}
            height={72}
            sx={{ marginBottom: 2 }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={30}
            sx={{ marginBottom: 1 }}
          />
          <Skeleton
            variant="text"
            width={150}
            height={20}
            sx={{ marginBottom: 1 }}
          />
        </>
      ) : (
        <>
          <Avatar
            alt={user?.name ?? ''}
            src={user?.image ?? ''}
            style={{ width: 72, height: 72 }}
            {...stringAvatar(user?.name || 'User Name')}
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
            เชฟ {user?.name}
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
        </>
      )}
    </Box>
  )
}
