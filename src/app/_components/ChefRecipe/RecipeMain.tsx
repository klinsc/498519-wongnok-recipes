/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import CloseIcon from '@mui/icons-material/Close'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import { Menu, MenuItem, Stack, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
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
  type MouseEvent,
} from 'react'
import { api } from '~/trpc/react'
import { stringAvatar } from '../AppAvatar'
dayjs.extend(utc)
dayjs.extend(timezone)

interface RecipeNameWithCreatedBy extends RecipeName {
  createdBy: User
}

interface RecipeMainProps {
  userID: string
  recipeID: string
}

// export default function RecipeMain(props: RecipeMainProps) {
// Destructure props
// const { recipeId, userId } = props

//

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
  useEffect(() => {
    console.log('pathName', pathName)
  }, [pathName])

  // State: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    [],
  )
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  // State: Current Recipe Name
  const [currentRecipeName, setCurrentRecipeName] =
    useState<RecipeNameWithCreatedBy | null>(null)
  // State: Current Recipe Details
  const [currentRecipeDetail, setCurrentRecipeDetail] =
    useState<RecipeDetail | null>()

  // trpc: get recipe by id
  const { data: recipeName } = api.recipe.getNameById.useQuery({
    recipeId: props.recipeID,
  })
  // effect: set current recipe name
  useEffect(() => {
    if (recipeName) {
      setCurrentRecipeName(recipeName)
    }
  }, [recipeName])

  // trpc: get recipe detail by id
  const { data: recipeDetail } = api.recipe.getDetailById.useQuery({
    recipeId: props.recipeID,
  })
  // effect: set current recipe detail
  useEffect(() => {
    if (recipeDetail) {
      setCurrentRecipeDetail(recipeDetail)
    }
  }, [recipeDetail])

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
      setCurrentRecipeName((prev) => {
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

  // Callback: handleEdit
  const handleEdit = useCallback(() => {
    void router.push(`${pathName}?editing=true`, {
      scroll: false,
    })

    handleClose()
  }, [handleClose, pathName, router])

  // Callback: handleSave
  const handleSave = useCallback(() => {
    if (currentRecipeName) {
      void updateRecipeName.mutateAsync({
        recipeId: currentRecipeName.id,
        name: currentRecipeName.name,
      })
    }
  }, [currentRecipeName, updateRecipeName])

  // Callback: handleCancel
  const handleCancel = useCallback(() => {
    // Reset the current recipe name to the original value
    setCurrentRecipeName((prev) => {
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
                currentRecipeName?.createdBy?.name || 'User',
              )}
              aria-label="recipe"
            />
          }
          action={
            <Stack direction="row" spacing={1}>
              {isEditting.name ? (
                <>
                  <IconButton
                    aria-label="save recipe name"
                    onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    aria-label="close recipe name"
                    onClick={handleCancel}>
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton disabled aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    disabled={
                      currentRecipeName?.createdById !==
                        props.userID || isDeleteRecipeDraftPending
                    }
                    id="draft-settings-button"
                    aria-controls={
                      open ? 'draft-settings-menu' : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ color: '#000' }}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="draft-settings-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'draft-settings-button',
                    }}>
                    <MenuItem onClick={handleEdit}>
                      แก้ไขสูตร
                    </MenuItem>
                    <MenuItem
                      disabled={isDeleteRecipeDraftPending}
                      onClick={handleDeleteRecipeDraft}>
                      ลบ
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Stack>
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
                defaultValue={currentRecipeName?.name}
                onChange={(event) => {
                  const newRecipeName = event.target.value
                  console.log('recipeName', newRecipeName)
                  setCurrentRecipeName((prev) =>
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
              <>{`${currentRecipeName?.name || 'Recipe Name'}`}</>
            )
          }
          subheader={
            currentRecipeName?.updatedAt
              ? dayjs(currentRecipeName.updatedAt)
                  .tz('Asia/Bangkok')
                  .format('DD/MM/YYYY HH:mm:ss')
              : 'Date created'
          }
        />
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
          image="https://mui.com/static/images/cards/paella.jpg"
          alt="Paella dish"
        />
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
