import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useSession } from 'next-auth/react'
import { useNotistack } from '~/app/_context/NotistackContext'
import { memo } from 'react'

interface LikeButtonProps {
  isLiked: boolean
  isOwner: boolean
  isPending: boolean
  currentRecipe: { id: string } | null
  likeRecipe: (args: { recipeId: string }) => Promise<void>
}

export default memo(function LikeButton(props: LikeButtonProps) {
  const { data: session } = useSession()
  const { showNotistack } = useNotistack()

  return (
    <IconButton
      onClick={() => {
        // Check if the user is logged in
        if (!session?.user.id) {
          showNotistack('กรุณาเข้าสู่ระบบ', 'error')

          return
        }

        if (!props.currentRecipe) return
        void props.likeRecipe({
          recipeId: props.currentRecipe.id,
        })
      }}
      disabled={props.isOwner || props.isPending}
      aria-label="add to favorites">
      {props.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  )
})
