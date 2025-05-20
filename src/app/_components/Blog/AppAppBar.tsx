'use client'

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import { alpha, styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import AppAvatar from '../AppAvatar'
import Hamburger, { MENU_ITEMS } from '../Hamburger'
import SearchBar from '../SearchBar'
import SiteIcon from '../SiteIcon'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}))

export default function AppAppBar() {
  // router
  const router = useRouter()

  // session
  const { data: session } = useSession()

  // callback: onClick sign in
  const handleSignIn = () => {
    router.push('/signin')
  }

  // callback: onClick sign up
  const handleSignUp = () => {
    router.push('/signup')
  }

  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}>
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              px: 0,
            }}>
            <SiteIcon />
            <Box
              sx={{
                display: { xs: 'flex', md: 'flex' },
                flexGrow: 1,
                justifyContent: 'space-between',
                paddingLeft: 2,
                paddingRight: 2,
              }}>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() => router.push('/')}
                sx={{
                  // '&:hover': {
                  //   backgroundColor: 'transparent',
                  // },
                  minWidth: '69px',
                }}>
                หน้าหลัก
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() =>
                  router.push(
                    `/chef/${session?.user?.id}/recipe/all`,
                  )
                }
                sx={{
                  // '&:hover': {
                  //   backgroundColor: 'transparent',
                  // },
                  minWidth: '85px',
                }}>
                สูตรของฉัน
              </Button>
              <SearchBar />
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}>
            {session?.user?.name ? (
              <AppAvatar />
            ) : (
              <>
                <Button
                  onClick={handleSignIn}
                  color="primary"
                  variant="text"
                  size="small">
                  ลงชื่อเข้าใช้
                </Button>
                <Button
                  onClick={handleSignUp}
                  color="primary"
                  variant="contained"
                  size="small">
                  สมัครสมาชิก
                </Button>
              </>
            )}
            {/* <ColorModeIconDropdown /> */}
            <Hamburger session={session} />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {/* <ColorModeIconDropdown size="medium" /> */}
            <AppAvatar />
            <IconButton
              aria-label="Menu button"
              onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}>
              <Box
                sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                {MENU_ITEMS.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={toggleDrawer(false)}
                    component="a"
                    href={item.path}>
                    {item.label}
                  </MenuItem>
                ))}

                {!session?.user?.name && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth>
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth>
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  )
}
