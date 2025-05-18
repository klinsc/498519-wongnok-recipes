/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { TextField, Typography } from '@mui/material'
import { memo } from 'react'

import type { RecipeWithCreatedBy } from '.'

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
  handleSave,
  handleCancel,
}: RecipeTitleProps) {
  return (
    <>
      {isEditting ? (
        <>
          {currentRecipe && (
            <TextField
              id="recipe-name"
              name="recipe-name"
              label="ชื่อสูตรอาหาร"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={currentRecipe?.name}
              onChange={(event) => {
                const newRecipeName = event.target.value
                console.log('recipeName', newRecipeName)
                setCurrentRecipe(
                  currentRecipe
                    ? { ...currentRecipe, name: newRecipeName }
                    : null,
                )
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleSave()
                }
                if (event.key === 'Escape') {
                  void handleCancel()
                }
              }}
              autoFocus
            />
          )}
        </>
      ) : (
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'text.primary',
          }}>{`${currentRecipe?.name || 'Recipe Name'}`}</Typography>
      )}
    </>
  )
})
