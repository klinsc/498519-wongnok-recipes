/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { memo, useState } from 'react'

import { type Ingrediants, type RecipeWithCreatedBy } from '.'

const INGREDIENT_SAMPLES_TH = {
  '1': { name: 'น้ำมันมะกอก', amount: '2 ช้อนโต๊ะ' },
  '2': { name: 'สะโพกไก่', amount: '1 ปอนด์' },
  '3': { name: 'กุ้ง', amount: '1 ปอนด์' },
  '4': { name: 'ไส้กรอกโชริโซ', amount: '1/2 ปอนด์' },
  '5': { name: 'พริกปาปริก้ารมควัน (Pimentón)', amount: '1 ช้อนชา' },
  '6': { name: 'ใบกระวาน', amount: '2 ใบ' },
  '7': { name: 'กระเทียม', amount: '4 กลีบ' },
  '8': { name: 'มะเขือเทศกระป๋อง', amount: '1 กระป๋อง' },
  '9': { name: 'หัวหอม', amount: '1 หัว' },
  '104': { name: 'เกลือและพริกไทย', amount: '' },
  '11': { name: 'เกสรหญ้าฝรั่น (Saffron)', amount: '1 หยิบมือ' },
  '12': { name: 'น้ำซุปไก่', amount: '5 ถ้วย' },
  '13': { name: 'ข้าว', amount: '2 ถ้วย' },
  '14': { name: 'อาร์ติโช้ค', amount: '' },
  '15': { name: 'พริกหยวกแดง', amount: '' },
  '16': { name: 'หอยแมลงภู่', amount: '' },
} as Ingrediants

const IngredientRow = memo(function IngredientRow({
  id,
  value,
  onChange,
  onRemove,
}: {
  id: string
  value: { name: string; amount: string }
  onChange: (
    id: string,
    value: { name: string; amount: string },
  ) => void
  onRemove: (id: string) => void
}) {
  return (
    <Stack direction="row">
      <TextField
        placeholder="ชื่อวัตถุดิบ"
        value={value.name}
        sx={{ mr: 1 }}
        size="small"
        onChange={(e) =>
          onChange(id, { ...value, name: e.target.value })
        }
      />
      <TextField
        placeholder="ปริมาณ"
        value={value.amount}
        size="small"
        onChange={(e) =>
          onChange(id, { ...value, amount: e.target.value })
        }
      />
      <Button
        variant="outlined"
        color="error"
        size="small"
        sx={{ ml: 1 }}
        onClick={() => onRemove(id)}>
        ลบ
      </Button>
    </Stack>
  )
})

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
  const [ingredients, setIngredients] = useState<Ingrediants>(
    currentRecipe?.ingredients || INGREDIENT_SAMPLES_TH,
  )

  // Handler functions are memoized to avoid unnecessary re-renders
  const handleIngredientChange = (
    id: string,
    value: { name: string; amount: string },
  ) => {
    setIngredients((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleIngredientRemove = (id: string) => {
    setIngredients((prev) => {
      const newIngredients = { ...prev }
      delete newIngredients[id]
      return newIngredients
    })
  }

  return (
    <>
      {isEditting ? (
        <>
          {/* Create the list of TextField that display original values and at the botton shows the add and remove button */}
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
            }}>
            {ingredients &&
              Object.entries(ingredients).map(([key, value]) => {
                return (
                  <IngredientRow
                    key={key}
                    id={key}
                    value={value as { name: string; amount: string }}
                    onChange={handleIngredientChange}
                    onRemove={handleIngredientRemove}
                  />
                )
              })}

            <Stack direction={'row'} spacing={1} sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const newIngredients = {
                    ...ingredients,
                    [`${Date.now()}`]: {
                      name: '',
                      amount: '',
                    },
                  }
                  setIngredients(newIngredients)
                }}>
                เพิ่มวัตถุดิบ
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <Stack
          spacing={0.5}
          sx={{
            maxHeight: 200,
            overflowY: 'auto',
          }}>
          {Object.entries(INGREDIENT_SAMPLES_TH).map(
            ([key, value]) => (
              <Typography
                key={key}
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  // marginTop: 1,
                  // fontWeight: 'bold',
                }}>
                {value.name} : {value.amount}
              </Typography>
            ),
          )}
        </Stack>
      )}
    </>
  )
})
