'use client'

import AddIcon from '@mui/icons-material/Add'
import { Container, CssBaseline, Fab, Grid } from '@mui/material'
import { useRouter } from 'next/navigation'
import AppAppBar from '../Blog/AppAppBar'
import Footer from '../Blog/Footer'
import Breadcrumb from '../Breadcrumb'
import Chef from './Chef'
import RecipeList from './RecipeList'
import Recipe from '../Recipe'
import dynamic from 'next/dynamic'
import { NotistackProvider } from '~/app/_context/NotistackContext'

interface ChefRecipeProps {
  userID: string
  recipeID: string
}

const AppTheme = dynamic(() => import('../shared-theme/AppTheme'), {
  ssr: false,
})

export default function ChefRecipe(props: ChefRecipeProps) {
  // router
  const router = useRouter()

  const { userID, recipeID } = props

  return (
    <>
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
            <NotistackProvider>
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
                  {Boolean(
                    recipeID === 'all' || recipeID === 'new',
                  ) ? (
                    <>
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
                        <RecipeList
                          userID={userID}
                          recipeID={recipeID}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Recipe userID={userID} recipeID={recipeID} />
                    </>
                  )}
                </Grid>
              }
            </NotistackProvider>
          </Container>
          <Footer />
        </>
      </AppTheme>
    </>
  )
}
