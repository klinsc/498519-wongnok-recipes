/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { IconButton } from '@mui/material'
import { useSession } from 'next-auth/react'
import { memo } from 'react'
import { useNotistack } from '~/app/_context/NotistackContext'
import { api } from '~/trpc/react'

interface LikeButtonProps {
  isOwner: boolean
  currentRecipe: { id: string } | null
}

export default memo(function LikeButton(props: LikeButtonProps) {
  const { data: session } = useSession()
  const { showNotistack } = useNotistack()

  // Trpc: get like status
  const { data: isLiked, refetch: refetchIsLiked } =
    api.recipe.isLiked.useQuery(
      {
        recipeId: props.currentRecipe?.id || '',
      },
      {
        enabled: !!session?.user.id,
        refetchOnWindowFocus: false,
      },
    )

  // Trpc: like recipe
  const { mutateAsync: likeRecipe, isPending: isLikePending } =
    api.recipe.like.useMutation({
      onSuccess: () => {
        void refetchIsLiked()
      },
    })

  return (
    <IconButton
      onClick={() => {
        // Check if the user is logged in
        if (!session?.user.id) {
          showNotistack('กรุณาเข้าสู่ระบบ', 'error')

          return
        }

        // Check if currentRecipe is null
        if (!props.currentRecipe) return

        // Like the recipe
        void likeRecipe({
          recipeId: props.currentRecipe.id,
        })
      }}
      disabled={props.isOwner || isLikePending}
      aria-label="add to favorites">
      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  )
})
