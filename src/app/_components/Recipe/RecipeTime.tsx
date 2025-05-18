import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { memo } from 'react'

import { type RecipeWithCreatedBy } from '.'

const TIME_SAMPLES_TH = [
  { value: 0, label: 'ไม่ระบุ' },
  { value: 10, label: '5-10 นาที' },
  { value: 20, label: '11-30 นาที' },
  { value: 30, label: '31-60 นาที' },
  { value: 60, label: 'มากกว่า 1 ชั่วโมง' },
]

interface RecipeTitleProps {
  currentRecipe: RecipeWithCreatedBy | null
  setCurrentRecipe: (recipe: RecipeWithCreatedBy | null) => void
  isEditting: boolean
  handleSave: () => void
  handleCancel: () => void
}

export default memo(function RecipeTime({
  currentRecipe,
  setCurrentRecipe,
  isEditting,
}: RecipeTitleProps) {
  return (
    <>
      {isEditting ? (
        <FormControl
          fullWidth
          sx={{
            marginTop: 1,
          }}>
          <InputLabel id="demo-simple-select-label" sx={{ top: -8 }}>
            ระยะเวลา
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={Number(currentRecipe?.time) || 0}
            label="ระยะเวลา"
            onChange={(e) => {
              const value = Number(e.target.value)
              if (isNaN(value)) {
                console.error('Invalid time value')
                return
              }

              const newRecipeTime = String(value)
              setCurrentRecipe(
                currentRecipe
                  ? {
                      ...currentRecipe,
                      time: newRecipeTime,
                    }
                  : null,
              )
            }}>
            {TIME_SAMPLES_TH.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', marginBottom: 2 }}>
          {currentRecipe?.time
            ? `${
                TIME_SAMPLES_TH.find(
                  (item) =>
                    item.value === Number(currentRecipe?.time),
                )?.label
              }`
            : `กดปุ่มแก้ไขเพื่อ กรอกระยะเวลาที่ใช้ในการทำอาหาร`}
        </Typography>
      )}
    </>
  )
})
