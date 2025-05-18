/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import CloseIcon from '@mui/icons-material/Close'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { api } from '~/trpc/react'
import type { RecipeWithCreatedBy } from '.'

interface RecipeActionsProps {
  handleDeleteRecipeDraft: () => void
  handleSave: () => void
  handleCancel: () => void
  isDeleteRecipeDraftPending: boolean
  isEditting: boolean
  currentRecipe: RecipeWithCreatedBy | null
}

export default memo(function RecipeActions({
  handleDeleteRecipeDraft,
  handleSave,
  handleCancel,
  isDeleteRecipeDraftPending,
  isEditting,
  currentRecipe,
}: RecipeActionsProps) {
  // navigation: Router
  const router = useRouter()
  // navigation: Path name
  const pathName = usePathname()

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

  // Callback: handleEdit
  const handleEdit = useCallback(() => {
    void router.push(`${pathName}?editing=true`, {
      scroll: false,
    })

    handleClose()
  }, [handleClose, pathName, router])

  // Memo: isOwner
  const isOwner = useMemo(
    () => currentRecipe?.createdById === session?.user.id,
    [currentRecipe, session?.user.id],
  )

  // Trpc: get like status
  const { data: isLiked, refetch: refetchIsLiked } =
    api.recipe.isLiked.useQuery(
      {
        recipeId: currentRecipe?.id || '',
      },
      {
        enabled: !!session?.user.id,
      },
    )

  // Trpc: like recipe
  const { mutateAsync: likeRecipe } = api.recipe.like.useMutation({
    onSuccess: () => {
      void refetchIsLiked()
    },
  })

  return (
    <Stack direction="row" spacing={1}>
      {isEditting ? (
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
          <IconButton
            onClick={() => {
              if (!currentRecipe) return
              void likeRecipe({
                recipeId: currentRecipe.id,
              })
            }}
            disabled={isOwner || isDeleteRecipeDraftPending}
            aria-label="add to favorites">
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton
            disabled={isOwner || isDeleteRecipeDraftPending}
            aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            disabled={!isOwner || isDeleteRecipeDraftPending}
            id="draft-settings-button"
            aria-controls={open ? 'draft-settings-menu' : undefined}
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
            <MenuItem onClick={handleEdit}>แก้ไขสูตร</MenuItem>
            <MenuItem
              disabled={isDeleteRecipeDraftPending}
              onClick={handleDeleteRecipeDraft}>
              ลบ
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  )
})
