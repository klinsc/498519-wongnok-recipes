import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Collapse from '@mui/material/Collapse'
import IconButton, {
  type IconButtonProps,
} from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useState } from 'react'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}))

export interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    date: string
    image: string
    description: string
    ingredients: {
      name: string
      amount: string
    }[]
    method: string
    time: string
    difficulty: string
    servings: string
  }
}

export default function MyRecipeCard(props: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <Card sx={{ maxWidth: 345, backgroundColor: '#f5f5f5' }}>
        <CardHeader
          avatar={false}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.recipe.title || 'ชื่อสูตรอาหาร'}
          subheader={props.recipe.date}
        />
        <CardMedia
          component="img"
          height="194"
          image={props.recipe.image}
          alt="Paella dish"
        />
        <CardContent>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary' }}>
            {props.recipe.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography
              variant="body1"
              sx={{
                marginTop: 2,
                fontWeight: 'bold',
              }}>
              วิธีทำ:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}>
              {props.recipe.method.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  )
}
