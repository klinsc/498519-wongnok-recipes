import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CssBaseline from '@mui/material/CssBaseline'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AppTheme from '../shared-theme/AppTheme'
import { SitemarkIcon } from './CustomIcons'
import { api } from '~/trpc/react'
import NotiAlert from '../NotiAlert'
import { useCallback, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Divider, Link } from '@mui/material'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp(props: {
  disableCustomTheme?: boolean
}) {
  // router
  const router = useRouter()

  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] =
    useState('')
  const [nameError, setNameError] = useState(false)
  const [nameErrorMessage, setNameErrorMessage] = useState('')

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

  // trpc: user create
  const { mutateAsync: createUser } = api.user.create.useMutation({
    onSuccess: (data) => {
      console.log('User created successfully:', data)
      setNotistack({
        open: true,
        message:
          'สร้างบัญชีผู้ใช้สำเร็จ, กำลังเปลี่ยนไปยังหน้าเข้าสู่ระบบ...',
        severity: 'success',
      })

      setTimeout(() => {
        // Send the user to the login page
        void router.push('/signin')
      }, 3000) // 3 seconds delay
    },
    onError: (error) => {
      console.error('Error creating user:', error)
      setNotistack({
        open: true,
        message: 'Error creating user',
        severity: 'error',
      })
    },
  })

  const validateInputs = () => {
    const email = document.getElementById(
      'email',
    ) as HTMLInputElement
    const password = document.getElementById(
      'password',
    ) as HTMLInputElement
    const name = document.getElementById('name') as HTMLInputElement

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

    if (!name.value || name.value.length < 1) {
      setNameError(true)
      setNameErrorMessage('Name is required.')
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Prevent default form submission
      event.preventDefault()

      if (nameError || emailError || passwordError) {
        event.preventDefault()
        return
      }

      const data = new FormData(event.currentTarget)
      console.log({
        name: data.get('name'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
      })

      await createUser({
        name: data.get('name') as string,
        email: data.get('email') as string,
        password: data.get('password') as string,
      })
    },
    [nameError, emailError, passwordError, createUser],
  )

  return (
    <AppTheme {...props}>
      <CssBaseline />
      {/* <ColorModeSelect
        sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
      /> */}
      <NotiAlert
        open={notistack.open}
        message={notistack.message}
        severity={notistack.severity}
        handleClose={handleCloseNotistack}
      />

      <SignUpContainer
        direction="column"
        justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            }}>
            สมัครสมาชิก
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
            <FormControl>
              <FormLabel htmlFor="name">ชื่อ</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">อีเมล์</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">รหัสผ่าน</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            {/* <FormControlLabel
              control={
                <Checkbox value="allowExtraEmails" color="primary" />
              }
              label="I want to receive updates via email."
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}>
              Sign up
            </Button>
          </Box>
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
              มีบัญชีอยู่แล้ว?{' '}
              <Link
                href="/signin"
                variant="body2"
                sx={{ alignSelf: 'center' }}>
                ลงชื่อเข้าใช้
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  )
}
