'use client'

import { CssBaseline, Container, Grid, Fab } from '@mui/material'
import AppAppBar from '../Blog/AppAppBar'
import Footer from '../Blog/Footer'
import Breadcrumb from '../Breadcrumb'
import Chef from './Chef'
import RecipeList from './RecipeList'
import AppTheme from '../shared-theme/AppTheme'
import NewRecipe from './NewRecipe'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'

interface ChefRecipeProps {
  userID: string
  recipeID: string
}

export default function ChefRecipe(props: ChefRecipeProps) {
  // router
  const router = useRouter()

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
          <Fab
            onClick={() => {
              router.push(`/chef/${userID}/recipe/new`)
            }}
            variant="extended"
            sx={{
              backgroundColor: '#FFFFFF',
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000, // Ensure it's above other elements
            }}>
            <AddIcon sx={{ mr: 1 }} />
            เพิ่มสูตรใหม่
          </Fab>
          <Breadcrumb />
          {
            <Grid container spacing={2}>
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
                <RecipeList />
              </Grid>
            </Grid>
          }
          <NewRecipe open={recipeID === 'new'} />
        </Container>
        <Footer />
      </>
    </AppTheme>
  )
}
