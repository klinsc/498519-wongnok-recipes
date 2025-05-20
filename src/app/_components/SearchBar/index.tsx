import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  // Navigation: router
  const router = useRouter()

  // Navigation: Searchparams
  const searchParams = useSearchParams()
  const QTimeID = searchParams.get('timeID')
  const QDifficultyID = searchParams.get('difficultyID')

  return (
    <FormControl
      sx={{ width: { xs: '100%', md: '100%' } }}
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
  )
}
