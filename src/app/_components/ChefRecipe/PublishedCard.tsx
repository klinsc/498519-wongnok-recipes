import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import { Menu, MenuItem } from '@mui/material'
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
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import type { RecipeWithCreatedBy } from '../Recipe'
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

export default function PublishedCard(props: RecipeCardProps) {
  // Router
  const router = useRouter()

  // Session
  const { data: session } = useSession()

  // State: expand
  const [expanded, setExpanded] = useState(false)

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

  const handleExpandClick = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  // Memo: image URL
  const imageURL = useMemo(() => {
    if (props.recipe?.image) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/api/v1/image/${props.recipe?.image}`
    }
    return 'no image'
  }, [props.recipe?.image])

  // Callback: edit recipe name
  const handleEditRecipeDraft = useCallback(() => {
    router.push(
      `/chef/${session?.user?.id}/recipe/${props.recipe.id}?editing=true`,
    )
  }, [props.recipe.id, session?.user?.id, router])

  // Memo: recipe URL
  const recipeURL = useMemo(() => {
    if (!!props.recipe?.createdById && !!props.recipe.id) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/chef/${props.recipe?.createdById}/recipe/${props.recipe.id}`
    }
    return null
  }, [props.recipe?.createdById, props.recipe.id])

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
                <MenuItem onClick={handleEditRecipeDraft}>
                  แก้ไขสูตร
                </MenuItem>
              </Menu>
            </>
          }
          title={
            <Typography
              variant="h6"
              component="div"
              onClick={() => {
                if (recipeURL) {
                  router.push(recipeURL)
                }
              }}
              sx={{
                cursor: 'pointer',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}>
              {props.recipe.name || 'ชื่อสูตรอาหาร'}
            </Typography>
          }
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
