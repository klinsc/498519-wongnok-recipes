import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useState, type MouseEvent } from 'react'
import type { RecipeWithCreatedBy } from '.'
import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'

interface RecipeMainActionsProps {
  handleDeleteRecipeDraft: () => void
  handleSave: () => void
  handleCancel: () => void
  isDeleteRecipeDraftPending: boolean
  isEditting: boolean
  currentRecipe: RecipeWithCreatedBy | null
  userID: string
}

export default memo(function RecipeMainActions({
  handleDeleteRecipeDraft,
  handleSave,
  handleCancel,
  isDeleteRecipeDraftPending,
  isEditting,
  currentRecipe,
  userID,
}: RecipeMainActionsProps) {
  // navigation: Router
  const router = useRouter()
  // navigation: Path name
  const pathName = usePathname()

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
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton disabled aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            disabled={
              currentRecipe?.createdById !== userID ||
              isDeleteRecipeDraftPending
            }
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
