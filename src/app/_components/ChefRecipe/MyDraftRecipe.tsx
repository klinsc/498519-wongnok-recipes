import MoreVertIcon from '@mui/icons-material/MoreVert'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import type { RecipeName } from '@prisma/client'
import dayjs from 'dayjs'

export interface MyDraftRecipeProps {
  recipe: RecipeName
}

export default function MyDraftRecipe(props: MyDraftRecipeProps) {
  return (
    <>
      <Card sx={{ maxWidth: 345, backgroundColor: '#f5f5f5' }}>
        <CardHeader
          avatar={false}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.recipe.name || 'ชื่อสูตรอาหาร'}
          subheader={
            dayjs(props.recipe.createdAt).format(
              'DD/MM/YYYY HH:mm:ss',
            ) || 'วันที่สร้างสูตรอาหาร'
          }
        />
      </Card>
    </>
  )
}
