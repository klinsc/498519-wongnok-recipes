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
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
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
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { api } from '~/trpc/react'
import { TIME_SAMPLES_TH } from '../Recipe/RecipeTime'
import { stringAvatar } from '../AppAvatar'

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

const Author = memo(function Author({
  author,
}: {
  author: {
    id: string
    name: string
    avatar: string
    updatedAt: Date
  }
}) {
  // Router
  const router = useRouter()

  // Handle click
  const handleClick = useCallback(
    (authorID: string) => {
      // Navigate to author page
      void router.push(`/chef/${authorID}/recipe/all`)
    },
    [router],
  )

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
        {author && (
          <Avatar
            onClick={() => void handleClick(author.id)}
            alt={author.name}
            src={author.avatar}
            style={{ width: 24, height: 24 }}
            {...stringAvatar(author.name || 'default')}
          />
        )}

        <Typography
          variant="caption"
          sx={{
            display: { xs: 'none', md: 'block' },
            fontWeight: 500,
          }}
          onClick={() => void handleClick(author.id)}>
          {author.name}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          cursor: 'default !important',
        }}>
        {dayjs(author?.updatedAt || new Date())
          .tz('Asia/Bangkok')
          .format('MMMM D, YYYY')}
      </Typography>
    </Box>
  )
})

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
      id: string | undefined | null
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
  // Router
  const router = useRouter()

  // Callback: handle click
  const handleClick = useCallback(() => {
    // Navigate to recipe page
    void router.push(
      `/chef/${props.publishedRecipes[props.index]?.createdBy.id}/recipe/${props.publishedRecipes[props.index]?.id}`,
      {
        // scroll: false,
      },
    )
  }, [props, router])

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
          onClick={() => handleClick()}
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
        <Typography
          onClick={() => handleClick()}
          gutterBottom
          variant="caption"
          component="div">
          {props.publishedRecipes[props.index]?.name}
        </Typography>
        <Typography
          onClick={() => handleClick()}
          gutterBottom
          variant="h6"
          component="div">
          {props.publishedRecipes[props.index]?.description}
        </Typography>
        <StyledTypography
          onClick={() => handleClick()}
          variant="body2"
          color="text.secondary"
          gutterBottom>
          {props.publishedRecipes[props.index]?.method}
        </StyledTypography>
      </SyledCardContent>
      <Author
        author={{
          id:
            props.publishedRecipes[props.index]?.createdBy.id ||
            'default id',
          name:
            props.publishedRecipes[props.index]?.createdBy.name ||
            'default author',
          avatar:
            props.publishedRecipes[props.index]?.createdBy.name ||
            '/static/images/avatar/default.jpg',
          updatedAt:
            props.publishedRecipes[props.index]?.updatedAt ||
            new Date(),
        }}
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
    // total: -1,
  })
  // // State: total
  // const [total, setTotal] = useState(-1)

  // Trpc: getAllPublisheds
  const {
    data: allPublisheds,
    isFetching,
    isFetched,
  } = api.recipe.getAllPublisheds.useQuery(pagination, {
    refetchOnWindowFocus: false,
  })
  // // Effect: set pagination on data change
  // useEffect(() => {
  //   if (allPublisheds?.total) {
  //     setTotal(allPublisheds.total)
  //   }
  // }, [allPublisheds?.total])

  // State: publishedRecipes
  const [publishedRecipes, setPublishedRecipes] = useState<
    {
      id: string
      name: string
      description: string | undefined | null
      method: string | undefined | null
      image: string | undefined | null
      createdBy: {
        id: string | undefined | null
        name: string | undefined | null
      }
      updatedAt: Date
    }[]
  >([])
  useEffect(() => {
    if (isFetched && allPublisheds?.recipes) {
      setPublishedRecipes((prev) => [
        ...prev,
        ...allPublisheds.recipes,
      ])
    }
  }, [allPublisheds, isFetched])
  // Log: publishedRecipes
  useEffect(() => {
    console.log('publishedRecipes', publishedRecipes)
  }, [publishedRecipes])

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

  const { ref, inView } = useInView({
    threshold: 0.1, // 10% visible
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }))
    }
  }, [inView])

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
        </Stack>
      </Box>

      {/* One page take max 6 recipes */}
      <Grid container spacing={2} columns={12}>
        {pagination.page >= 0 &&
          Array.from({ length: pagination.page + 1 }).map(
            (_, index) => {
              const gridIndex0 = index * 6 + 0
              const gridIndex1 = index * 6 + 1
              const gridIndex2 = index * 6 + 2
              const gridIndex3 = index * 6 + 3
              const gridIndex4 = index * 6 + 4
              const gridIndex5 = index * 6 + 5

              return (
                <Fragment key={index}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {publishedRecipes?.[gridIndex0] && (
                      <StyledRecipe
                        index={gridIndex0}
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
                    {publishedRecipes?.[gridIndex1] && (
                      <StyledRecipe
                        index={gridIndex1}
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
                    {publishedRecipes?.[gridIndex2] && (
                      <StyledRecipe
                        index={gridIndex2}
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
                      {publishedRecipes?.[gridIndex3] && (
                        <StyledRecipe
                          index={gridIndex3}
                          publishedRecipes={publishedRecipes}
                          focusedCardIndex={focusedCardIndex}
                          handleFocus={handleFocus}
                          handleBlur={handleBlur}
                          currentDomain={currentDomain}
                          hideImage={true}
                        />
                      )}
                      {publishedRecipes?.[gridIndex4] && (
                        <StyledRecipe
                          index={gridIndex4}
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
                    {publishedRecipes?.[gridIndex5] && (
                      <StyledRecipe
                        index={gridIndex5}
                        publishedRecipes={publishedRecipes}
                        focusedCardIndex={focusedCardIndex}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        currentDomain={currentDomain}
                        hideImage={false}
                      />
                    )}
                  </Grid>
                </Fragment>
              )
            },
          )}

        {/* Display 3 skeleton grid when fetching */}
        {isFetching &&
          Array.from({ length: 3 }).map((_, index) => (
            <Grid
              key={index}
              size={{ xs: 12, md: 4 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
              }}>
              <SyledCard
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  height: '100%',
                  backgroundColor: (theme) =>
                    theme.palette.background.paper,
                }}>
                <Box
                  sx={{
                    aspectRatio: '16 / 9',
                    backgroundColor: (theme) =>
                      theme.palette.background.default,
                  }}
                />
                <SyledCardContent>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ bgcolor: 'background.default' }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ bgcolor: 'background.default' }}
                  />
                  <StyledTypography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ bgcolor: 'background.default' }}
                  />
                </SyledCardContent>
              </SyledCard>
            </Grid>
          ))}
      </Grid>

      {!isFetching && !inView && <Box ref={ref}></Box>}
    </Box>
  )
}
