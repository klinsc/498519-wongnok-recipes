'use client'

import { CssBaseline, Container, Grid } from '@mui/material'
import AppAppBar from '../Blog/AppAppBar'
import Footer from '../Blog/Footer'
import Breadcrumb from '../Breadcrumb'
import Chef from './Chef'
import Recipe from './Recipe'
import AppTheme from '../shared-theme/AppTheme'

interface ChefRecipeProps {
  userID: string
  recipeID: string
}

export default function ChefRecipe(props: ChefRecipeProps) {
  const { userID, recipeID } = props

  return (
    <AppTheme>
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
          <Grid container>
            <Grid
              size={{
                xs: 12,
              }}>
              <Chef userID={userID} />
            </Grid>
            <Grid
              size={{
                xs: 12,
              }}>
              <Recipe recipeID={recipeID} />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </>
    </AppTheme>
  )
}
