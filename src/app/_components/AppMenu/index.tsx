import MenuIcon from '@mui/icons-material/Menu'
import { IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import type { Session } from 'next-auth'
import { useState, type MouseEvent } from 'react'

export const MENU_ITEMS = [
  { label: 'หน้าหลัก', path: '/' },
  // { label: 'เมนูโปรด', path: '/favorite' },
  { label: 'สูตรของฉัน', path: '/chef' },
]

export default function AppMenu({
  session,
}: {
  session: Session | null
}) {
  // State: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}>
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.label}
            onClick={handleClose}
            component="a"
            href={
              item.path === '/chef' && session
                ? `/chef/${session.user.id}/recipe/all`
                : '/signin'
            }>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
