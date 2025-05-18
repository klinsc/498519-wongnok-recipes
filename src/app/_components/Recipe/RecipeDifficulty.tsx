/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { memo, useCallback } from 'react'

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
  const { data: difficulties, refetch: refetchDifficulties } =
    api.recipe.getDifficulties.useQuery(undefined, {
      enabled: isEditting,
      refetchOnWindowFocus: false,
    })

  // TRPC: create new recipe difficulty
  const { mutateAsync: createNewDifficulty } =
    api.recipe.createDifficulty.useMutation({
      onSuccess: (newDifficulty) => {
        // Refetch the recipe difficulties
        void refetchDifficulties().then(() => {
          // Set the new difficulty as the current recipe difficulty
          setCurrentRecipe(
            currentRecipe
              ? {
                  ...currentRecipe,
                  difficultyId: newDifficulty.id,
                }
              : null,
          )
        })
      },
    })

  // Callback: create new recipe difficulty
  const handleCreateNewDifficulty = useCallback(async () => {
    const newDifficultyName = prompt('กรุณากรอกชื่อระดับความยากใหม่')
    if (newDifficultyName) {
      await createNewDifficulty({
        name: newDifficultyName,
      })
    }
  }, [createNewDifficulty])

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
            value={
              currentRecipe?.difficultyId ||
              'cmathzdqu00033fnwhhl8107r'
            }
            label="ระดับ"
            onChange={(e: {
              target: {
                value: string | number
              }
            }) => {
              if (e.target.value === 'add-new') {
                return void handleCreateNewDifficulty()
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

            {/* Add new button */}
            <MenuItem
              key="add-new"
              value="add-new"
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
              }}>
              + เพิ่ม
            </MenuItem>
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
