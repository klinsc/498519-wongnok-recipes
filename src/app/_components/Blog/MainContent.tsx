'use client'

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  TablePagination,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { api } from '~/trpc/react'
import { TIME_SAMPLES_TH } from '../Recipe/RecipeTime'

dayjs.extend(utc)
dayjs.extend(tz)

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}))

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
})

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

function Author({
  authors,
}: {
  authors: { name: string; avatar: string; updatedAt: Date }[]
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          alignItems: 'center',
        }}>
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">
        {dayjs(authors[0]?.updatedAt || new Date())
          .tz('Asia/Bangkok')
          .format('MMMM D, YYYY')}
      </Typography>
    </Box>
  )
}

export function Search() {
  return (
    <FormControl
      sx={{ width: { xs: '100%', md: '25ch' } }}
      variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment
            position="start"
            sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  )
}

export function FilterChips() {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 3,
        overflow: 'auto',
      }}>
      <Chip
        // onClick={handleClick}
        size="medium"
        label="รวมทั้งหมด"
      />
      <Chip
        // onClick={handleClick}
        size="medium"
        label="อาหารคาว"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
      <Chip
        // onClick={handleClick}
        size="medium"
        label="ของหวาน"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
      <Chip
        // onClick={handleClick}
        size="medium"
        label="เครื่องดื่ม"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
      <Chip
        // onClick={handleClick}
        size="medium"
        label="ของว่าง"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
    </Box>
  )
}

interface StyledRecipeProps {
  index: number
  publishedRecipes: {
    id: string
    name: string
    description: string | undefined | null
    method: string | undefined | null
    image: string | undefined | null
    createdBy: {
      name: string | undefined | null
    }
    updatedAt: Date
  }[]
  focusedCardIndex: number | null
  handleFocus: (index: number) => void
  handleBlur: () => void
  currentDomain: string
  hideImage: boolean
}

function StyledRecipe(props: StyledRecipeProps) {
  return (
    <SyledCard
      variant="outlined"
      onFocus={() => props.handleFocus(props.index)}
      onBlur={props.handleBlur}
      tabIndex={props.index}
      className={
        props.focusedCardIndex === props.index ? 'Mui-focused' : ''
      }>
      {!props.hideImage && (
        <CardMedia
          component="img"
          alt="recipe image"
          image={props.publishedRecipes[props.index]?.image || ''}
          sx={{
            aspectRatio: '16 / 9',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
      )}
      <SyledCardContent>
        <Typography gutterBottom variant="caption" component="div">
          {props.publishedRecipes[props.index]?.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {props.publishedRecipes[props.index]?.description}
        </Typography>
        <StyledTypography
          variant="body2"
          color="text.secondary"
          gutterBottom>
          {props.publishedRecipes[props.index]?.method}
        </StyledTypography>
      </SyledCardContent>
      <Author
        authors={[
          {
            name:
              props.publishedRecipes[props.index]?.createdBy.name ||
              'default author',
            avatar:
              props.publishedRecipes[props.index]?.createdBy.name ||
              '/static/images/avatar/default.jpg',
            updatedAt:
              props.publishedRecipes[props.index]?.updatedAt ||
              new Date(),
          },
        ]}
      />
    </SyledCard>
  )
}

export default function MainContent() {
  // Navigation: Searchparams
  const searchParams = useSearchParams()
  const QTimeID = searchParams.get('timeID')
  const QDifficultyID = searchParams.get('difficultyID')
  const QSearch = searchParams.get('q')

  // Navigation: Router
  const router = useRouter()

  const [focusedCardIndex, setFocusedCardIndex] = useState<
    number | null
  >(null)

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index)
  }

  const handleBlur = () => {
    setFocusedCardIndex(null)
  }

  // State: pagination
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 6,
    total: -1,
  })

  // Trpc: getAllPublisheds
  const { data: allPublisheds } =
    api.recipe.getAllPublisheds.useQuery(pagination, {
      refetchOnWindowFocus: false,
    })
  // Effect: set pagination on data change
  useEffect(() => {
    if (allPublisheds) {
      setPagination((prev) => ({
        ...prev,
        total: allPublisheds.total,
      }))
    }
  }, [allPublisheds])
  // Memo: publishedRecipes
  const publishedRecipes = useMemo(() => {
    if (allPublisheds) {
      return allPublisheds.recipes
    }
    return []
  }, [allPublisheds])

  // Memo: Get current domain
  const currentDomain = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return ''
  }, [])

  // State: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Trpc: getAllDifficulties
  const { data: allDifficulties } =
    api.recipe.getDifficulties.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

  // Trpc: getTime
  const allTimes = useMemo(() => {
    return [...TIME_SAMPLES_TH]
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          เมนูอาหาร
        </Typography>
        <Typography>ค้นหาสูตรอาหารที่คุณชื่นชอบได้ที่นี่</Typography>
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}>
        <FilterChips />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          display={{ xs: 'flex', md: 'flex' }}
          alignItems={'center'}>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <FilterAltOutlinedIcon />
          </IconButton>
          {/* <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', md: 'block' },
              ml: 1,
              fontWeight: 500,
            }}>
            ตัวกรอง
          </Typography> */}

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
            <Select
              onChange={(e) => {
                // Set query params
                const timeID = e.target.value
                const difficultyID = QDifficultyID
                const q = QSearch
                void router.push(
                  `?q=${q}&timeID=${timeID}&difficultyID=${difficultyID}`,
                  {
                    scroll: false,
                  },
                )
              }}
              label="เวลา"
              size="small"
              defaultValue="0"
              sx={{ width: 'auto', mr: 1 }}
              inputProps={{
                'aria-label': 'Without label',
              }}>
              {allTimes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              onChange={(e) => {
                // Set query params
                const timeID = QTimeID
                const difficultyID = e.target.value
                const q = QSearch
                void router.push(
                  `?q=${q}&timeID=${timeID}&difficultyID=${difficultyID}`,
                  {
                    scroll: false,
                  },
                )
              }}
              label="ความยาก"
              size="small"
              defaultValue="cmathzdqu00033fnwhhl8107r"
              value={QDifficultyID || 'cmathzdqu00033fnwhhl8107r'}
              sx={{ width: 'auto', mr: 1 }}
              inputProps={{
                'aria-label': 'Without label',
              }}>
              {allDifficulties?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Menu>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={(_event, newPage: number) => {
              setPagination((prev) => ({
                ...prev,
                page: newPage,
              }))
            }}
            rowsPerPage={pagination.limit}
            rowsPerPageOptions={[]}
          />
        </Stack>
      </Box>

      {/* One page take max 6 recipes */}
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          {publishedRecipes && publishedRecipes[0] && (
            <StyledRecipe
              index={0}
              publishedRecipes={publishedRecipes}
              focusedCardIndex={focusedCardIndex}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              currentDomain={currentDomain}
              hideImage={false}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {publishedRecipes && publishedRecipes[1] && (
            <StyledRecipe
              index={1}
              publishedRecipes={publishedRecipes}
              focusedCardIndex={focusedCardIndex}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              currentDomain={currentDomain}
              hideImage={false}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {publishedRecipes && publishedRecipes[2] && (
            <StyledRecipe
              index={2}
              publishedRecipes={publishedRecipes}
              focusedCardIndex={focusedCardIndex}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              currentDomain={currentDomain}
              hideImage={false}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%',
            }}>
            {publishedRecipes && publishedRecipes[3] && (
              <StyledRecipe
                index={3}
                publishedRecipes={publishedRecipes}
                focusedCardIndex={focusedCardIndex}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                currentDomain={currentDomain}
                hideImage={true}
              />
            )}
            {publishedRecipes && publishedRecipes[4] && (
              <StyledRecipe
                index={4}
                publishedRecipes={publishedRecipes}
                focusedCardIndex={focusedCardIndex}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                currentDomain={currentDomain}
                hideImage={true}
              />
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {publishedRecipes && publishedRecipes[5] && (
            <StyledRecipe
              index={5}
              publishedRecipes={publishedRecipes}
              focusedCardIndex={focusedCardIndex}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              currentDomain={currentDomain}
              hideImage={false}
            />
          )}
        </Grid>
      </Grid>

      <TablePagination
        size="small"
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={(_event, newPage: number) => {
          setPagination((prev) => ({
            ...prev,
            page: newPage,
          }))
        }}
        rowsPerPage={pagination.limit}
        rowsPerPageOptions={[]}
      />
    </Box>
  )
}
