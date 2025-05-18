/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { Box } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import type { Recipe, User } from '@prisma/client'
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
import RecipeMainTitle from './RecipeMainTitle'

dayjs.extend(utc)
dayjs.extend(timezone)

type Ingrediants = Record<
  string,
  {
    id: string
    name: string
    amount: string
  }[]
>

export interface RecipeWithCreatedBy extends Recipe {
  createdBy: User
  ingredients: Ingrediants
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
    useState<RecipeWithCreatedBy | null>(null)

  // State: file
  const [file, setFile] = useState<File | null>(null)

  // trpc: get recipe by id
  const { data: recipe } = api.recipe.getById.useQuery(
    {
      recipeId: props.recipeID,
    },
    {
      enabled: Boolean(props.recipeID),
    },
  )
  // effect: set current recipe name
  useEffect(() => {
    if (recipe) {
      // Ensure ingredients is always of type Ingrediants
      setCurrentRecipe({
        ...recipe,
        ingredients:
          recipe.ingredients &&
          typeof recipe.ingredients === 'object'
            ? (recipe.ingredients as Ingrediants)
            : { ingredient: [] },
      })
    }
  }, [recipe])

  // TRPC: delete recipe name
  const {
    mutateAsync: deleteRecipe,
    isPending: isDeleteRecipePending,
  } = api.recipe.delete.useMutation({
    onSuccess: () => {
      console.log('Delete recipe draft success')
    },
    onError: (error) => {
      console.error('Delete recipe draft error', error)
    },
  })

  // trpc: update recipe name
  const updateRecipeName = api.recipe.update.useMutation({
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

      await deleteRecipe({ recipeId: props.recipeID })
      console.log('Recipe draft deleted successfully')
    } catch (error) {
      console.error('Error deleting recipe draft:', error)
    }
  }, [deleteRecipe, props.recipeID])

  const handleUpload = useCallback(
    async (file: File) => {
      if (!currentRecipe) {
        console.error('No current recipe to upload file to')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('recipeId', currentRecipe?.id)

      await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      })
    },
    [currentRecipe],
  )

  // Callback: handleSave
  const handleSave = useCallback(() => {
    if (currentRecipe) {
      void updateRecipeName.mutateAsync({
        id: currentRecipe.id,
        name: currentRecipe.name,
        description: currentRecipe.description ?? '',
        ingredients: currentRecipe.ingredients ?? {
          ingredient: [],
        },
        time: currentRecipe.time ?? '',
        difficulty: currentRecipe.difficulty ?? '',
        servings: currentRecipe.servings ?? '',
        method: currentRecipe.method ?? '',
      })

      // // Handle file upload if a file is selected
      // if (file) {
      //   handleUpload(file)
      //     .then(() => {
      //       console.log('File uploaded successfully')
      //     })
      //     .catch((error) => {
      //       console.error('Error uploading file:', error)
      //     })
      // }
    }
  }, [currentRecipe, updateRecipeName])

  // Callback: handleCancel
  const handleCancel = useCallback(() => {
    // Reset the current recipe name to the original value
    setCurrentRecipe((prev) => {
      if (prev) {
        return {
          ...prev,
          name: recipe?.name || '',
        }
      }
      return null
    })

    void router.push(pathName, {
      scroll: false,
    })
  }, [pathName, recipe?.name, router])

  // Memo: image URL
  const imageUrl = useMemo(() => {
    if (props.recipeID) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/api/v1/image/${props.recipeID}`
    }
    return null
  }, [props.recipeID])

  useEffect(() => {
    console.log('imageUrl', imageUrl)
  }, [imageUrl])

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
            <>
              {currentRecipe && (
                <RecipeMainActions
                  handleDeleteRecipeDraft={handleDeleteRecipeDraft}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  isDeleteRecipeDraftPending={isDeleteRecipePending}
                  isEditting={isEditting}
                  currentRecipe={currentRecipe}
                  userID={props.userID}
                />
              )}
            </>
          }
          title={
            <RecipeMainTitle
              currentRecipe={currentRecipe}
              setCurrentRecipe={setCurrentRecipe}
              isEditting={isEditting}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          }
          subheader={
            currentRecipe?.updatedAt
              ? `อัพเดทล่าสุด: ${dayjs(currentRecipe.updatedAt)
                  .tz('Asia/Bangkok')
                  .format('DD/MM/YYYY HH:mm:ss')}`
              : 'อัพเดทล่าสุด: '
          }
        />
        {imageUrl && (
          <CardMedia
            loading="lazy"
            component="img"
            height="194"
            image={imageUrl || ''}
            alt="image of the recipe"
            sx={{
              objectFit: 'contain',
            }}
          />
        )}

        {isEditting.name && (
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
            <ImageUploader
              file={file}
              setFile={setFile}
              handleUpload={handleUpload}
            />
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
