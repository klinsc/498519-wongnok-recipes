'use client'

import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import AppTheme from '../shared-theme/AppTheme'
import AppAppBar from './AppAppBar'
import MainContent from './MainContent'
import Latest from './Lastest'
import Footer from './Footer'
import Breadcrumb from '../Breadcrumb'

export default function Blog(props: {
  disableCustomTheme?: boolean
}) {
  return (
    <AppTheme {...props}>
      <>
        <CssBaseline />

        <AppAppBar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            my: 16,
            gap: 4,
          }}>
          <Breadcrumb />
          <MainContent />
          <Latest />
        </Container>
        <Footer />
      </>
    </AppTheme>
  )
}
