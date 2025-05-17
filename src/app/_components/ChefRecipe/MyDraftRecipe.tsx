import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Menu, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import type { RecipeName } from '@prisma/client'
import dayjs from 'dayjs'
import { useState, type MouseEvent } from 'react'

export interface MyDraftRecipeProps {
  recipe: RecipeName
}

export default function MyDraftRecipe(props: MyDraftRecipeProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </>
          }
          title={props.recipe.name || 'ชื่อสูตรอาหาร'}
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
