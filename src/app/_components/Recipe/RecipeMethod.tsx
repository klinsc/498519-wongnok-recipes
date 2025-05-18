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

export default memo(function RecipeMethod({
  currentRecipe,
  setCurrentRecipe,
  isEditting,
}: RecipeTitleProps) {
  return (
    <>
      {isEditting ? (
        <TextField
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={currentRecipe?.method || ''}
          onChange={(event) => {
            const newRecipeMethod = event.target.value
            setCurrentRecipe(
              currentRecipe
                ? {
                    ...currentRecipe,
                    description: newRecipeMethod,
                  }
                : null,
            )
          }}
          placeholder={`กรอกวิธีทำที่นี่`}
          helperText={`เช่น ${RECIPE_SAMPLES_TH.method}`}
          sx={{
            marginBottom: 2,
          }}
          slotProps={{
            input: {
              sx: {
                height: '100%',
              },
            },
          }}
        />
      ) : (
        <Typography
          sx={{
            whiteSpace: 'pre-line',
          }}>
          {currentRecipe?.method ||
            `กรอกวิธีทำที่นี่ เช่น ${RECIPE_SAMPLES_TH.method}`}
        </Typography>
      )}
    </>
  )
})
