/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { TextField, Typography } from '@mui/material'
import { memo } from 'react'

import { RECIPE_SAMPLES_TH, type RecipeWithCreatedBy } from '.'

interface RecipeTitleProps {
  currentRecipe: RecipeWithCreatedBy | null
  setCurrentRecipe: (recipe: RecipeWithCreatedBy | null) => void
  isEditting: boolean
  handleSave: () => void
  handleCancel: () => void
}

export default memo(function RecipeTitle({
  currentRecipe,
  setCurrentRecipe,
  isEditting,
}: RecipeTitleProps) {
  return (
    <>
      {isEditting ? (
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="คำอธิบายคร่าวๆ"
          helperText={RECIPE_SAMPLES_TH.description}
          value={currentRecipe?.description || ''}
          slotProps={{
            input: {
              sx: {
                height: '100%',
              },
            },
          }}
          onChange={(event) => {
            const newRecipeDescription = event.target.value
            console.log('recipeName', newRecipeDescription)
            setCurrentRecipe(
              currentRecipe
                ? {
                    ...currentRecipe,
                    description: newRecipeDescription,
                  }
                : null,
            )
          }}
          sx={{
            marginBottom: 2,
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', marginBottom: 2 }}>
          {currentRecipe?.description ||
            `กดปุ่มแก้ไขเพื่อ กรอกคำอธิบายคร่าวๆ ของสูตรอาหาร`}
        </Typography>
      )}
    </>
  )
})
