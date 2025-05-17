/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import { Stack } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { memo } from 'react'
import { api } from '~/trpc/react'
import { stringAvatar } from '../AppAvatar'
dayjs.extend(utc)
dayjs.extend(timezone)

interface RecipeMainProps {
  userID: string
  recipeID: string
}

// export default function RecipeMain(props: RecipeMainProps) {
// Destructure props
// const { recipeId, userId } = props

//

export default memo(function RecipeMain(props: RecipeMainProps) {
  // trpc: get recipe by id
  const { data: recipe } = api.recipe.getById.useQuery({
    recipeId: props.recipeID,
  })

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              {...stringAvatar(recipe?.createdBy?.name || 'User')}
              aria-label="recipe"></Avatar>
          }
          action={
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Stack>
          }
          title={recipe?.name || 'Recipe Name'}
          subheader={
            recipe?.createdAt
              ? dayjs(recipe.createdAt)
                  .tz('Asia/Bangkok')
                  .format('DD/MM/YYYY HH:mm:ss')
              : 'Date created'
          }
        />
        <CardMedia
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: 'auto',
          }}
          component="img"
          height="194"
          image="https://mui.com/static/images/cards/paella.jpg"
          alt="Paella dish"
        />
        <CardContent>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}>
            This impressive paella is a perfect party dish and a fun
            meal to cook together with your guests. Add 1 cup of
            frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>

        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat 1/2 cup of the broth in a pot until simmering, add
            saffron and set aside for 10 minutes.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat oil in a (14- to 16-inch) paella pan or a large,
            deep skillet over medium-high heat. Add chicken, shrimp
            and chorizo, and cook, stirring occasionally until
            lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in
            the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until
            thickened and fragrant, about 10 minutes. Add saffron
            broth and remaining 4 1/2 cups chicken broth; bring to a
            boil.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Add rice and stir very gently to distribute. Top with
            artichokes and peppers, and cook without stirring, until
            most of the liquid is absorbed, 15 to 18 minutes. Reduce
            heat to medium-low, add reserved shrimp and mussels,
            tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just
            tender, 5 to 7 minutes more. (Discard any mussels that
            don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and
            then serve.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
})
