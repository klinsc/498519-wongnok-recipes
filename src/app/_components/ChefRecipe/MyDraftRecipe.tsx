import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Menu, MenuItem, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import type { Recipe } from '@prisma/client'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { api } from '~/trpc/react'

export interface MyDraftRecipeProps {
  recipe: Recipe
  refetchDrafts: () => void
}

export default function MyDraftRecipe(props: MyDraftRecipeProps) {
  // Router
  const router = useRouter()

  // Session
  const { data: session } = useSession()

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

  // TRPC: delete recipe name
  const {
    mutateAsync: deleteRecipeDraft,
    isPending: isDeleteRecipeDraftPending,
  } = api.recipe.delete.useMutation({
    onSuccess: () => {
      console.log('Delete recipe draft success')
      props.refetchDrafts()
    },
    onError: (error) => {
      console.error('Delete recipe draft error', error)
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

      await deleteRecipeDraft({ recipeId: props.recipe.id })
      console.log('Recipe draft deleted successfully')
    } catch (error) {
      console.error('Error deleting recipe draft:', error)
    }
  }, [deleteRecipeDraft, props.recipe.id])

  // Callback: edit recipe name
  const handleEditRecipeDraft = useCallback(() => {
    router.push(
      `/chef/${session?.user?.id}/recipe/${props.recipe.id}?editing=true`,
    )
  }, [props.recipe.id, session?.user?.id, router])

  // Memo: recipe URL
  const recipeURL = useMemo(() => {
    if (!!props.recipe?.createdById && !!props.recipe.id) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/chef/${props.recipe?.createdById}/recipe/${props.recipe.id}`
    }
    return null
  }, [props.recipe?.createdById, props.recipe.id])

  return (
    <>
      <Card sx={{ maxWidth: 345, backgroundColor: '#f5f5f5' }}>
        <CardHeader
          avatar={false}
          action={
            <>
              <IconButton
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
                <MenuItem onClick={handleEditRecipeDraft}>
                  เพิ่มข้อมูล
                </MenuItem>
                <MenuItem
                  disabled={isDeleteRecipeDraftPending}
                  onClick={handleDeleteRecipeDraft}>
                  ลบ
                </MenuItem>
              </Menu>
            </>
          }
          title={
            <Typography
              variant="h6"
              component="div"
              onClick={() => {
                if (recipeURL) {
                  router.push(recipeURL)
                }
              }}
              sx={{
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}>
              {props.recipe.name || 'ชื่อสูตรอาหาร'}
            </Typography>
          }
          subheader={
            dayjs(props.recipe.createdAt).format(
              'DD/MM/YYYY HH:mm:ss',
            ) || 'วันที่สร้างสูตรอาหาร'
          }
        />
      </Card>
    </>
  )
}
