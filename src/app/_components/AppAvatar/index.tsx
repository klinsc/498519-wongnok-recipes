/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { Menu, MenuItem } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, type MouseEvent } from 'react'

function stringToColor(string: string) {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

export function stringAvatar(name: string) {
  return {
    sx: {
      cursor: 'pointer',
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0]?.[0] ?? ''}${name.split(' ')[1]?.[0] ?? ''}`,
  }
}

export default function AppAvatar() {
  // Router
  const router = useRouter()

  // Session
  const { data: session } = useSession()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // callback: my recipe
  const handleMyRecipe = useCallback(() => {
    void router.push(`/chef/${session?.user?.id}/recipe/all`)
    handleClose()
  }, [router, session?.user?.id])

  // callback: onClick sign out
  const handleSignOut = useCallback(async () => {
    await signOut({
      callbackUrl: '/',
    })
  }, [])

  return (
    <Stack direction="row" spacing={2}>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        <MenuItem onClick={handleMyRecipe}>สูตรของฉัน</MenuItem>
        <MenuItem onClick={handleSignOut}>ลงชื่อออก</MenuItem>
      </Menu>
      <Avatar
        onClick={handleMenu}
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        {...stringAvatar(session?.user?.name || 'User Name')}
      />
    </Stack>
  )
}
