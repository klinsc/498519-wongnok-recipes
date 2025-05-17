/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { Box, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import type { RecipeDetail, RecipeName, User } from '@prisma/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api } from '~/trpc/react'
import { stringAvatar } from '../AppAvatar'
import ImageUploader from '../ImageUploader'
import RecipeMainActions from './RecipeMainActions'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface RecipeNameWithCreatedByAndDetail
  extends RecipeName {
  createdBy: User
  RecipeDetail: RecipeDetail
}

interface RecipeMainProps {
  userID: string
  recipeID: string
}

export default memo(function RecipeMain(props: RecipeMainProps) {
  // navigation: Router
  const router = useRouter()

  // navigation: Searchparams
  const searchParams = useSearchParams()
  const QEditting = searchParams.get('editing')
  const isEditting = useMemo(() => {
    if (QEditting === 'true') {
      return {
        name: true,
        detail: true,
      }
    }
    return {
      name: false,
      detail: false,
    }
  }, [QEditting])

  // navigation: Path name
  const pathName = usePathname()

  // State: Current Recipe Name
  const [currentRecipe, setCurrentRecipe] =
    useState<RecipeNameWithCreatedByAndDetail | null>(null)

  // trpc: get recipe by id
  const { data: recipeName } = api.recipe.getById.useQuery({
    recipeId: props.recipeID,
  }) as {
    data: RecipeNameWithCreatedByAndDetail
  }
  // effect: set current recipe name
  useEffect(() => {
    if (recipeName) {
      setCurrentRecipe(recipeName)
    }
  }, [recipeName])

  // TRPC: delete recipe name
  const {
    mutateAsync: deleteRecipeDraft,
    isPending: isDeleteRecipeDraftPending,
  } = api.recipe.deleteDraft.useMutation({
    onSuccess: () => {
      console.log('Delete recipe draft success')
    },
    onError: (error) => {
      console.error('Delete recipe draft error', error)
    },
  })

  // trpc: update recipe name
  const updateRecipeName = api.recipe.updateName.useMutation({
    onSuccess: () => {
      console.log('Recipe name updated successfully')

      // Update updatedAt
      setCurrentRecipe((prev) => {
        if (prev) {
          return {
            ...prev,
            updatedAt: new Date(),
          }
        }
        return null
      })

      void router.push(pathName, {
        scroll: false,
      })
    },
    onError: (error) => {
      console.error('Error updating recipe name:', error)
    },
  })

  // Callback: delete recipe name
  const handleDeleteRecipeDraft = useCallback(async () => {
    try {
      const windowConfirm = window.confirm(
        'คุณต้องการลบสูตรอาหารนี้หรือไม่?',
      )
      if (!windowConfirm) {
        return
      }

      await deleteRecipeDraft({ recipeNameId: props.recipeID })
      console.log('Recipe draft deleted successfully')
    } catch (error) {
      console.error('Error deleting recipe draft:', error)
    }
  }, [deleteRecipeDraft, props.recipeID])

  // Callback: handleSave
  const handleSave = useCallback(() => {
    if (currentRecipe) {
      void updateRecipeName.mutateAsync({
        recipeId: currentRecipe.id,
        name: currentRecipe.name,
      })
    }
  }, [currentRecipe, updateRecipeName])

  // Callback: handleCancel
  const handleCancel = useCallback(() => {
    // Reset the current recipe name to the original value
    setCurrentRecipe((prev) => {
      if (prev) {
        return {
          ...prev,
          name: recipeName?.name || '',
        }
      }
      return null
    })

    void router.push(pathName, {
      scroll: false,
    })
  }, [pathName, recipeName?.name, router])

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              {...stringAvatar(
                currentRecipe?.createdBy?.name || 'User',
              )}
              aria-label="recipe"
            />
          }
          action={
            <RecipeMainActions
              handleDeleteRecipeDraft={handleDeleteRecipeDraft}
              handleSave={handleSave}
              handleCancel={handleCancel}
              isDeleteRecipeDraftPending={isDeleteRecipeDraftPending}
              isEditting={isEditting}
              currentRecipe={currentRecipe}
              userID={props.userID}
            />
          }
          title={
            isEditting.name ? (
              <TextField
                id="recipe-name"
                name="recipe-name"
                label="ชื่อสูตรอาหาร"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={currentRecipe?.name}
                onChange={(event) => {
                  const newRecipeName = event.target.value
                  console.log('recipeName', newRecipeName)
                  setCurrentRecipe((prev) =>
                    prev ? { ...prev, name: newRecipeName } : null,
                  )
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSave()
                  }
                  if (event.key === 'Escape') {
                    void handleCancel()
                  }
                }}
                autoFocus
              />
            ) : (
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}>{`${currentRecipe?.name || 'Recipe Name'}`}</Typography>
            )
          }
          subheader={
            currentRecipe?.updatedAt
              ? `อัพเดทล่าสุด: ${dayjs(currentRecipe.updatedAt)
                  .tz('Asia/Bangkok')
                  .format('DD/MM/YYYY HH:mm:ss')}`
              : 'อัพเดทล่าสุด: '
          }
        />
        {currentRecipe?.RecipeDetail?.image ? (
          <CardMedia
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
              objectFit: 'cover',
              objectPosition: 'center',
              width: '100%',
              height: 'auto',
            }}
            component="img"
            height="194"
            image={currentRecipe?.RecipeDetail?.image}
            alt="Paella dish"
          />
        ) : (
          <Box
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
              width: '100%',
              height: '194px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            height="194">
            <ImageUploader />
          </Box>
        )}
        <CardContent>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', marginBottom: 2 }}>
            This impressive paella is a perfect party dish and a fun
            meal to cook together with your guests. Add 1 cup of
            frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>

        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat 1/2 cup of the broth in a pot until simmering, add
            saffron and set aside for 10 minutes.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat oil in a (14- to 16-inch) paella pan or a large,
            deep skillet over medium-high heat. Add chicken, shrimp
            and chorizo, and cook, stirring occasionally until
            lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in
            the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until
            thickened and fragrant, about 10 minutes. Add saffron
            broth and remaining 4 1/2 cups chicken broth; bring to a
            boil.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Add rice and stir very gently to distribute. Top with
            artichokes and peppers, and cook without stirring, until
            most of the liquid is absorbed, 15 to 18 minutes. Reduce
            heat to medium-low, add reserved shrimp and mussels,
            tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just
            tender, 5 to 7 minutes more. (Discard any mussels that
            don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and
            then serve.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
})
