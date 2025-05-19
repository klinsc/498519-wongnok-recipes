'use client'

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { TablePagination } from '@mui/material'
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
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { api } from '~/trpc/react'

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
          image={`${props.currentDomain}/api/v1/image/${props.publishedRecipes[props.index]?.image}`}
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
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<
    number | null
  >(null)

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index)
  }

  const handleBlur = () => {
    setFocusedCardIndex(null)
  }

  // State: pagination
  const [pagination, setPagination] = React.useState({
    page: 0,
    limit: 2,
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
        component="div"
        count={pagination.total}
        page={pagination.page}
        onPageChange={(_event, newPage: number) => {
          setPagination((prev) => ({
            ...prev,
            page: newPage,
          }))
        }}
        rowsPerPage={2}
        rowsPerPageOptions={[]}
      />
    </Box>
  )
}
