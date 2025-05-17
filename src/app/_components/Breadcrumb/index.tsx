import * as React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { MENU_ITEMS } from '../AppMenu'
import { usePathname } from 'next/navigation'

function handleClick(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export default function Breadcrumb() {
  const pathname = usePathname()

  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          sx={{
            color:
              pathname === '/' ? 'text.primary' : 'text.secondary',
          }}
          underline="hover"
          href="/">
          หน้าหลัก
        </Link>
        {MENU_ITEMS.filter(
          (item) =>
            item.path !== '/' && pathname?.includes(item.path),
        ).map((item) => (
          <Link
            sx={{
              color: 'text.primary',
            }}
            key={item.label}
            underline="hover"
            href={item.path}>
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  )
}
