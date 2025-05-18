/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { memo } from 'react'

import { type RecipeWithCreatedBy } from '.'
import { api } from '~/trpc/react'

interface RecipeTitleProps {
  currentRecipe: RecipeWithCreatedBy | null
  setCurrentRecipe: (recipe: RecipeWithCreatedBy | null) => void
  isEditting: boolean
  handleSave: () => void
  handleCancel: () => void
}

export default memo(function RecipeDifficulty({
  currentRecipe,
  setCurrentRecipe,
  isEditting,
}: RecipeTitleProps) {
  // TRPC: get recipe difficulties
  const { data: difficulties } = api.recipe.getDifficulties.useQuery(
    undefined,
    {
      enabled: isEditting,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <>
      {isEditting ? (
        <FormControl
          fullWidth
          sx={{
            marginTop: 1,
          }}>
          <InputLabel id="demo-simple-select-label" sx={{ top: -8 }}>
            ระดับ
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={
              currentRecipe?.difficultyId ||
              'cmathzdqu00033fnwhhl8107r'
            }
            label="ระดับ"
            onChange={(e: {
              target: {
                value: string | number
              }
            }) => {
              if (isNaN(Number(e.target.value))) {
                console.error('Invalid time value')
                return
              }

              const newRecipeDifficultyId = String(e.target.value)
              setCurrentRecipe(
                currentRecipe
                  ? {
                      ...currentRecipe,
                      difficultyId: newRecipeDifficultyId,
                    }
                  : null,
              )
            }}>
            {difficulties?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', marginBottom: 2 }}>
          {currentRecipe?.time
            ? `${currentRecipe?.difficulty?.name || 'ไม่ระบุ'}`
            : `กดปุ่มแก้ไขเพื่อ กรอกระดับความยากของสูตรอาหาร`}
        </Typography>
      )}
    </>
  )
})
