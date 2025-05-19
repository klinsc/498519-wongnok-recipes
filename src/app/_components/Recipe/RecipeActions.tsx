import MoreVertIcon from '@mui/icons-material/MoreVert'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import PublicIcon from '@mui/icons-material/Public'
import PublicOffIcon from '@mui/icons-material/PublicOff'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import { RecipeStatus } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import LikeButton from '~/app/_components/LikeButton'
import { api } from '~/trpc/react'
import type { RecipeWithCreatedBy } from '.'

interface RecipeActionsProps {
  handleDeleteRecipeDraft: () => void
  handleSave: () => void
  handleCancel: () => void
  isDeleteRecipeDraftPending: boolean
  isEditting: boolean
  currentRecipe: RecipeWithCreatedBy | null
  refetchRecipe: () => void
  isSaving: boolean
}

export default memo(function RecipeActions({
  handleDeleteRecipeDraft,
  handleSave,
  handleCancel,
  isDeleteRecipeDraftPending,
  isEditting,
  currentRecipe,
  refetchRecipe,
  isSaving,
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

  // Trpc: publish recipe
  const { mutateAsync: publishRecipe } =
    api.recipe.publish.useMutation({
      onSuccess: () => {
        void router.push(
          `/chef/${session?.user.id}/recipe/${currentRecipe?.id}`,
        )

        void refetchRecipe()
      },
    })

  // Trpc: unpublish recipe
  const { mutateAsync: unpublishRecipe } =
    api.recipe.unpublish.useMutation({
      onSuccess: () => {
        void refetchRecipe()
      },
    })

  return (
    <Stack direction="row" spacing={1}>
      {isEditting ? (
        <>
          <IconButton
            aria-label="close recipe name"
            onClick={handleCancel}>
            <PowerSettingsNewIcon />
          </IconButton>
          <IconButton
            disabled={isSaving}
            aria-label="save recipe name"
            onClick={handleSave}>
            <SaveIcon />
          </IconButton>
          <IconButton
            aria-label="publish recipe name"
            onClick={async () => {
              if (!currentRecipe) return

              if (currentRecipe.status === RecipeStatus.PUBLISHED) {
                await unpublishRecipe({
                  recipeId: currentRecipe.id,
                })
              } else {
                await publishRecipe({
                  recipeId: currentRecipe.id,
                })
              }
            }}
            disabled={isDeleteRecipeDraftPending}>
            {currentRecipe?.status === RecipeStatus.PUBLISHED ? (
              <PublicOffIcon />
            ) : (
              <PublicIcon />
            )}
          </IconButton>
        </>
      ) : (
        <>
          <LikeButton
            isOwner={isOwner}
            currentRecipe={currentRecipe}
          />
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
