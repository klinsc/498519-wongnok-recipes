/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { Box } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import type { Recipe, User } from '@prisma/client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { api } from '~/trpc/react'
import { stringAvatar } from '../AppAvatar'
import ImageUploader from '../ImageUploader'
import RecipeMainActions from './RecipeMainActions'
import RecipeMainTitle from './RecipeMainTitle'
import RecipeMainDescription from './RecipeMainDescription'

dayjs.extend(utc)
dayjs.extend(timezone)

export const RECIPE_SAMPLES_TH = {
  id: '1',
  createdBy: {
    id: '1',
    name: 'เชฟจอห์น',
  },
  title: '(ตัวอย่าง) ปาเอยากุ้งและไส้กรอกโชริโซ',
  date: '14 กันยายน 2016',
  image: 'https://mui.com/static/images/cards/paella.jpg',
  description:
    'ปาเอยาที่ดูน่าประทับใจนี้เหมาะสำหรับงานปาร์ตี้ และยังเป็นอาหารสนุก ๆ ที่สามารถทำไปพร้อมกับแขกได้อีกด้วย คุณสามารถเติมถั่วลันเตาแช่แข็ง 1 ถ้วยลงไปพร้อมกับหอยแมลงภู่หากต้องการ',
  ingredients: [
    { name: 'น้ำมันมะกอก', amount: '2 ช้อนโต๊ะ' },
    { name: 'สะโพกไก่', amount: '1 ปอนด์' },
    { name: 'กุ้ง', amount: '1 ปอนด์' },
    { name: 'ไส้กรอกโชริโซ', amount: '1/2 ปอนด์' },
    { name: 'พริกปาปริก้ารมควัน (Pimentón)', amount: '1 ช้อนชา' },
    { name: 'ใบกระวาน', amount: '2 ใบ' },
    { name: 'กระเทียม', amount: '4 กลีบ' },
    { name: 'มะเขือเทศกระป๋อง', amount: '1 กระป๋อง' },
    { name: 'หัวหอม', amount: '1 หัว' },
    { name: 'เกลือและพริกไทย', amount: '' },
    { name: 'เกสรหญ้าฝรั่น (Saffron)', amount: '1 หยิบมือ' },
    { name: 'น้ำซุปไก่', amount: '5 ถ้วย' },
    { name: 'ข้าว', amount: '2 ถ้วย' },
    { name: 'อาร์ติโช้ค', amount: '' },
    { name: 'พริกหยวกแดง', amount: '' },
    { name: 'หอยแมลงภู่', amount: '' },
  ],
  time: '30 นาที',
  difficulty: 'ปานกลาง',
  servings: '4 ที่',
  method:
    'อุ่นน้ำซุปไก่ 1/2 ถ้วยในหม้อจนร้อนแล้วเติมเกสรหญ้าฝรั่นลงไป จากนั้นพักไว้ 10 นาที\n\nตั้งน้ำมันในกระทะปาเอยาขนาด 14-16 นิ้ว หรือกระทะใบใหญ่ลึกบนไฟกลาง-แรง ใส่ไก่ กุ้ง และไส้กรอกลงไปผัดเป็นครั้งคราวจนสีเริ่มเหลืองทอง ใช้เวลาประมาณ 6-8 นาที นำกุ้งขึ้นพักไว้ โดยยังคงทิ้งไก่และไส้กรอกไว้ในกระทะ เติมพริกปาปริก้า ใบกระวาน กระเทียม มะเขือเทศ หัวหอม เกลือ และพริกไทย แล้วผัดจนข้นและหอม ใช้เวลาประมาณ 10 นาที เติมน้ำซุปหญ้าฝรั่นและน้ำซุปไก่ที่เหลือลงไป จากนั้นต้มจนเดือด\n\nใส่ข้าวลงไปและคนอย่างเบามือให้กระจายทั่วหน้า ใส่อาร์ติโช้คและพริกหยวกด้านบน และปรุงต่อโดยไม่ต้องคนจนของเหลวส่วนใหญ่ถูกดูดซึม ใช้เวลาประมาณ 15-18 นาที ลดไฟลงอ่อน-กลาง ใส่กุ้งและหอยแมลงภู่ที่พักไว้ โดยแทรกลงไปในข้าว แล้วปรุงต่อโดยไม่คนจนหอยแมลงภู่เปิดและข้าวสุกนุ่ม ใช้เวลาอีกประมาณ 5-7 นาที (ทิ้งหอยที่ไม่เปิด)\n\nนำลงจากเตาและพักไว้ 10 นาที แล้วจึงเสิร์ฟ',
}

type Ingrediants = Record<
  string,
  {
    id: string
    name: string
    amount: string
  }[]
>

export interface RecipeWithCreatedBy extends Recipe {
  createdBy: User
  ingredients: Ingrediants
}

interface RecipeMainProps {
  userID: string
  recipeID: string
}

export default memo(function Recipe(props: RecipeMainProps) {
  // navigation: Router
  const router = useRouter()

  // navigation: Searchparams
  const searchParams = useSearchParams()
  const QEditting = searchParams.get('editing')
  const isEditting = useMemo(() => {
    if (QEditting === 'true') {
      return true
    }
    return false
  }, [QEditting])

  // navigation: Path name
  const pathName = usePathname()

  // State: Current Recipe Name
  const [currentRecipe, setCurrentRecipe] =
    useState<RecipeWithCreatedBy | null>(null)

  // State: file
  const [file, setFile] = useState<File | null>(null)

  // trpc: get recipe by id
  const { data: recipe } = api.recipe.getById.useQuery(
    {
      recipeId: props.recipeID,
    },
    {
      enabled: Boolean(props.recipeID),
    },
  )
  // effect: set current recipe name
  useEffect(() => {
    if (recipe) {
      // Ensure ingredients is always of type Ingrediants
      setCurrentRecipe({
        ...recipe,
        ingredients:
          recipe.ingredients &&
          typeof recipe.ingredients === 'object'
            ? (recipe.ingredients as Ingrediants)
            : { ingredient: [] },
      })
    }
  }, [recipe])

  // TRPC: delete recipe name
  const {
    mutateAsync: deleteRecipe,
    isPending: isDeleteRecipePending,
  } = api.recipe.delete.useMutation({
    onSuccess: () => {
      console.log('Delete recipe draft success')
    },
    onError: (error) => {
      console.error('Delete recipe draft error', error)
    },
  })

  // trpc: update recipe name
  const updateRecipe = api.recipe.update.useMutation({
    onSuccess: () => {
      console.log('Recipe name updated successfully')

      // Update updatedAt
      setCurrentRecipe(() => {
        if (currentRecipe) {
          return {
            ...currentRecipe,
            updatedAt: new Date(),
          }
        }
        return null
      })

      void router.push(pathName, {
        scroll: false,
      })
    },
    onError: (error) => {
      console.error('Error updating recipe name:', error)
    },
  })

  // Callback: delete recipe name
  const handleDeleteRecipeDraft = useCallback(async () => {
    try {
      const windowConfirm = window.confirm(
        'คุณต้องการลบสูตรอาหารนี้หรือไม่?',
      )
      if (!windowConfirm) {
        return
      }

      await deleteRecipe({ recipeId: props.recipeID })
      console.log('Recipe draft deleted successfully')
    } catch (error) {
      console.error('Error deleting recipe draft:', error)
    }
  }, [deleteRecipe, props.recipeID])

  const handleUpload = useCallback(
    async (file: File) => {
      if (!currentRecipe) {
        console.error('No current recipe to upload file to')
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('recipeId', currentRecipe?.id)

      await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      })
    },
    [currentRecipe],
  )

  // Callback: handleSave
  const handleSave = useCallback(() => {
    if (currentRecipe) {
      debugger
      void updateRecipe.mutateAsync({
        id: currentRecipe.id,
        name: currentRecipe.name,
        description: currentRecipe.description ?? '',
        ingredients: currentRecipe.ingredients ?? {
          ingredient: [],
        },
        time: currentRecipe.time ?? '',
        difficulty: currentRecipe.difficulty ?? '',
        servings: currentRecipe.servings ?? '',
        method: currentRecipe.method ?? '',
      })
    }
  }, [currentRecipe, updateRecipe])

  // Callback: handleCancel
  const handleCancel = useCallback(() => {
    // Reset the current recipe name to the original value
    setCurrentRecipe((prev) => {
      if (prev) {
        return {
          ...prev,
          name: recipe?.name || '',
        }
      }
      return null
    })

    void router.push(pathName, {
      scroll: false,
    })
  }, [pathName, recipe?.name, router])

  // Memo: image URL
  const imageUrl = useMemo(() => {
    if (props.recipeID) {
      // Get current domain
      const currentDomain = window.location.origin

      return `${currentDomain}/api/v1/image/${props.recipeID}`
    }
    return null
  }, [props.recipeID])

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              {...stringAvatar(
                currentRecipe?.createdBy?.name || 'User',
              )}
              aria-label="recipe"
            />
          }
          action={
            <>
              {currentRecipe && (
                <RecipeMainActions
                  handleDeleteRecipeDraft={handleDeleteRecipeDraft}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  isDeleteRecipeDraftPending={isDeleteRecipePending}
                  isEditting={isEditting}
                  currentRecipe={currentRecipe}
                  userID={props.userID}
                />
              )}
            </>
          }
          title={
            <RecipeMainTitle
              currentRecipe={currentRecipe}
              setCurrentRecipe={setCurrentRecipe}
              isEditting={isEditting}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />
          }
          subheader={
            currentRecipe?.updatedAt
              ? `อัพเดทล่าสุด: ${dayjs(currentRecipe.updatedAt)
                  .tz('Asia/Bangkok')
                  .format('DD/MM/YYYY HH:mm:ss')}`
              : 'อัพเดทล่าสุด: '
          }
        />
        {imageUrl && (
          <CardMedia
            loading="lazy"
            component="img"
            height="194"
            image={imageUrl || ''}
            alt="image of the recipe"
            sx={{
              objectFit: 'contain',
              padding: 2,
            }}
          />
        )}

        {isEditting && (
          <Box
            sx={{
              paddingTop: 2,
              paddingBottom: 2,
              width: '100%',
              height: '194px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            height="194">
            <ImageUploader
              file={file}
              setFile={setFile}
              handleUpload={handleUpload}
            />
          </Box>
        )}
        <CardContent>
          <RecipeMainDescription
            currentRecipe={currentRecipe}
            setCurrentRecipe={setCurrentRecipe}
            isEditting={isEditting}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        </CardContent>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>วิธีทำ:</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat 1/2 cup of the broth in a pot until simmering, add
            saffron and set aside for 10 minutes.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Heat oil in a (14- to 16-inch) paella pan or a large,
            deep skillet over medium-high heat. Add chicken, shrimp
            and chorizo, and cook, stirring occasionally until
            lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in
            the pan. Add pimentón, bay leaves, garlic, tomatoes,
            onion, salt and pepper, and cook, stirring often until
            thickened and fragrant, about 10 minutes. Add saffron
            broth and remaining 4 1/2 cups chicken broth; bring to a
            boil.
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Add rice and stir very gently to distribute. Top with
            artichokes and peppers, and cook without stirring, until
            most of the liquid is absorbed, 15 to 18 minutes. Reduce
            heat to medium-low, add reserved shrimp and mussels,
            tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just
            tender, 5 to 7 minutes more. (Discard any mussels that
            don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and
            then serve.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
})
