'use client'

import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import AppTheme from '../shared-theme/AppTheme'
import AppAppBar from './AppAppBar'
import MainContent from './MainContent'
import Footer from './Footer'
import Breadcrumb from '../Breadcrumb'
import AddRecipeFab from '../AddRecipeFab'

interface BlogProps {
  userID?: string
  recipeID?: string
  disableCustomTheme?: boolean
}

export default function Blog(props: BlogProps) {
  return (
    <AppTheme {...props}>
      <>
        <CssBaseline />
        <AddRecipeFab />

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
          <Breadcrumb
            userID={props.userID}
            recipeID={props.recipeID}
          />
          <MainContent />
        </Container>
        <Footer />
      </>
    </AppTheme>
  )
}
