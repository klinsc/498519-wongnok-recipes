'use client'

import { CssBaseline, Divider, Link } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState, type FormEvent } from 'react'
import AppTheme from '~/app/_components/shared-theme/AppTheme'
import ForgotPassword from '~/app/_components/Signin/ForgotPassword'
import NotiAlert from '../NotiAlert'
import SiteIcon from '../SiteIcon'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function Main(props: {
  disableCustomTheme?: boolean
}) {
  // router
  const router = useRouter()

  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] =
    useState('')
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  // callback: handleCloseNotistack
  const handleCloseNotistack = useCallback(() => {
    setNotistack((prev) => ({ ...prev, open: false }))
  }, [])
  // state: notistack
  const [notistack, setNotistack] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (emailError || passwordError) {
        event.preventDefault()
        return
      }
      const data = new FormData(event.currentTarget)
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      })

      // Add nextauth credential login here
      try {
        await signIn('credentials', {
          redirect: false,
          email: data.get('email'),
          password: data.get('password'),
        })

        setNotistack({
          open: true,
          message: 'Signing in...',
          severity: 'success',
        })

        // Redirect to the home page after successful sign-in
        setTimeout(() => {
          // Send the user to the login page
          void router.push('/')
        }, 3000) // 3 seconds delay
      } catch (error) {
        console.error('Error signing in:', error)

        setNotistack({
          open: true,
          message: 'Error signing in',
          severity: 'error',
        })
      }
    },
    [emailError, passwordError, router],
  )

  const validateInputs = () => {
    const email = document.getElementById(
      'email',
    ) as HTMLInputElement
    const password = document.getElementById(
      'password',
    ) as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage(
        'Password must be at least 6 characters long.',
      )
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <NotiAlert
        open={notistack.open}
        message={notistack.message}
        severity={notistack.severity}
        handleClose={handleCloseNotistack}
      />

      <SignInContainer
        direction="column"
        justifyContent="space-between">
        {/* <ColorModeSelect
          sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
        /> */}
        <Card variant="outlined">
          <SiteIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            }}>
            ลงชื่อเข้าใช้
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}>
            <FormControl>
              <FormLabel htmlFor="email">อีเมล์</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">รหัสผ่าน</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}>
              เข้าสู่ระบบ
            </Button>
            {/* <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}>
              ลืมรหัสผ่าน?
            </Link> */}
            <Divider>
              <Typography sx={{ color: 'text.secondary' }}>
                หรือ
              </Typography>
            </Divider>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
              {/* <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => alert('Sign up with Google')}
                          startIcon={<GoogleIcon />}>
                          Sign up with Google
                        </Button> */}
              {/* <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => alert('Sign up with Facebook')}
                          startIcon={<FacebookIcon />}>
                          Sign up with Facebook
                        </Button> */}
              <Typography sx={{ textAlign: 'center' }}>
                ยังไม่มีบัญชี?{' '}
                <Link
                  href="/signup"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}>
                  สมัครสมาชิก
                </Link>
              </Typography>
            </Box>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}
