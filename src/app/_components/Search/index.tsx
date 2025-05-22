/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { memo, useMemo, useState, type MouseEvent } from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { api } from '~/trpc/react'
import { TIME_SAMPLES_TH } from '../Recipe/RecipeTime'
import { useRouter, useSearchParams } from 'next/navigation'

export default memo(function Search() {
  // Navigation: Router
  const router = useRouter()

  // Navigation: Searchparams
  const searchParams = useSearchParams()
  const QTimeID = searchParams.get('timeID')
  const QDifficultyID = searchParams.get('difficultyID')
  const QSearch = searchParams.get('q')

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
    api.recipe.getPublicDifficulties.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

  // Trpc: getTime
  const allTimes = useMemo(() => {
    return [...TIME_SAMPLES_TH]
  }, [])

  // Memo: isFiltering
  const isFiltering = useMemo(() => {
    return (
      QTimeID !== '0' ||
      Boolean(
        QDifficultyID !== '0' &&
          QDifficultyID !== 'cmathzdqu00033fnwhhl8107r',
      )
    )
  }, [QTimeID, QDifficultyID])

  return (
    <>
      <FormControl
        sx={{ width: { xs: '100%', md: '25ch' } }}
        variant="outlined">
        <OutlinedInput
          onChange={(e) => {
            const timeID = QTimeID
            const difficultyID = QDifficultyID
            const q = e.target.value

            void router.push(
              `?q=${q}&timeID=${timeID}&difficultyID=${difficultyID}`,
              {
                scroll: false,
              },
            )
          }}
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
      <>
        <IconButton
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}>
          {isFiltering ? (
            <FilterAltIcon />
          ) : (
            <FilterAltOutlinedIcon />
          )}
        </IconButton>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            const timeID = '0'
            const difficultyID = '0'
            const q = QSearch
            void router.push(
              `?q=${q}&timeID=${timeID}&difficultyID=${difficultyID}`,
              {
                scroll: false,
              },
            )
          }}
          sx={{
            display: { xs: 'none', md: 'block' },
            minWidth: '85px',
          }}>
          ล้างตัวกรอง
        </Button>

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
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'space-between'}
            mb={1}>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', md: 'block' },
                ml: 1,
                fontWeight: 500,
              }}>
              เวลา:
            </Typography>
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
              value={QTimeID || '0'}
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
          </Stack>

          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', md: 'block' },
                ml: 1,
                fontWeight: 500,
              }}>
              ความยาก:
            </Typography>
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
          </Stack>
        </Menu>
      </>
    </>
  )
})
