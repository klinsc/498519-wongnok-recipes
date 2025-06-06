import AddIcon from '@mui/icons-material/Add'
import { Fab } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { memo, useCallback } from 'react'

export default memo(function AddRecipeFab() {
  // Router
  const router = useRouter()

  // Session
  const { data: session } = useSession()

  // Callback: handle click
  const handleClick = useCallback(() => {
    if (!session) {
      router.push('/signin')
      return
    }

    router.push(`/chef/${session?.user?.id}/recipe/new`)
  }, [router, session])

  return (
    <Fab
      onClick={() => handleClick()}
      variant="extended"
      sx={{
        backgroundColor: '#FFFFFF',
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000, // Ensure it's above other elements
      }}>
      <AddIcon sx={{ mr: 1 }} />
      เพิ่มสูตรของคุณ
    </Fab>
  )
})
