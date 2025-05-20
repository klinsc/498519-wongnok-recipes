'use client'

import { Container, CssBaseline, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { NotistackProvider } from '~/app/_context/NotistackContext'
import AddRecipeFab from '../AddRecipeFab'
import AppAppBar from '../Blog/AppAppBar'
import Footer from '../Blog/Footer'
import Breadcrumb from '../Breadcrumb'
import Recipe from '../Recipe'
import Profile from './Profile'
import RecipeList from './RecipeList'

interface ChefProps {
  userID: string
  recipeID: string
}

const AppTheme = dynamic(() => import('../shared-theme/AppTheme'), {
  ssr: false,
})

export default function Chef(props: ChefProps) {
  // Searchparams
  const searchParams = useSearchParams()
  const QEditing = searchParams.get('editing')
  const isEditing = useMemo(
    () => (QEditing === 'true' ? true : false),
    [QEditing],
  )

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
              {!isEditing && <AddRecipeFab />}
              <Breadcrumb userID={userID} recipeID={recipeID} />
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
                        <Profile userID={userID} />
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
                    <Grid
                      size={{
                        xs: 12,
                      }}>
                      <Recipe userID={userID} recipeID={recipeID} />
                    </Grid>
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
