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
import { useCallback, useMemo, useState } from 'react'
import type { RecipeWithCreatedBy } from '../Recipe'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

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
  recipe: RecipeWithCreatedBy
}

export default function PublishedRecipe(props: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  const imageURL = useMemo(() => {
    if (props.recipe?.image) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/api/v1/image/${props.recipe?.image}`
    }
    return 'no image'
  }, [props.recipe?.image])

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
          title={props.recipe.name || 'ชื่อสูตรอาหาร'}
          subheader={dayjs(props.recipe.updatedAt)
            .tz('Asia/Bangkok')
            .format('DD/MM/YYYY HH:mm:ss')}
        />
        <CardMedia
          component="img"
          height="194"
          image={imageURL}
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
              ส่วนผสม:
            </Typography>
            {props.recipe?.ingredients &&
              Object.entries(props.recipe?.ingredients).map(
                ([key, value]) => {
                  return (
                    <Typography
                      key={key}
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        marginTop: 1,
                      }}>
                      {value.name} : {value.amount}
                    </Typography>
                  )
                },
              )}
            <Typography
              variant="body1"
              sx={{
                marginTop: 2,
                fontWeight: 'bold',
              }}>
              ข้อมูลเพิ่มเติม:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}>
              เวลาทำอาหาร: {props.recipe.time}
              <br />
              ความยาก: {props.recipe.difficulty.name}
              <br />
              จำนวนที่เสิร์ฟ: {props.recipe.servings}
              <br />
            </Typography>
          </CardContent>

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
              sx={{
                color: 'text.secondary',
                whiteSpace: 'pre-line',
              }}>
              {props.recipe.method}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  )
}
