import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { api } from '~/trpc/react'
import type { Ingrediants } from '../Recipe'
import MyDraftRecipe from './MyDraftRecipe'
import NewRecipe from './NewRecipe'
import PublishedRecipe from './PublishedRecipe'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const RECIPE_SAMPLES = [
  {
    id: '1',
    createdBy: {
      id: '1',
      name: 'Chef John',
    },
    title: '(ตัวอย่าง) Shrimp and Chorizo Paella',
    date: 'September 14, 2016',
    image: 'https://mui.com/static/images/cards/paella.jpg',
    description:
      'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
    ingredients: [
      { name: 'Olive oil', amount: '2 tbsp' },
      { name: 'Chicken thighs', amount: '1 lb' },
      { name: 'Shrimp', amount: '1 lb' },
      { name: 'Chorizo sausage', amount: '1/2 lb' },
      { name: 'Pimentón', amount: '1 tsp' },
      { name: 'Bay leaves', amount: '2' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Tomatoes', amount: '1 can' },
      { name: 'Onion', amount: '1' },
      { name: 'Salt and pepper', amount: '' },
      { name: 'Saffron threads', amount: '1 pinch' },
      { name: 'Chicken broth', amount: '5 cups' },
      { name: 'Rice', amount: '2 cups' },
      { name: 'Artichokes', amount: '' },
      { name: 'Red bell pepper', amount: '' },
      { name: 'Mussels', amount: '' },
    ],
    time: '30 minutes',
    difficulty: 'Medium',
    servings: '4 servings',
    method:
      'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.\n\nHeat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.\n\nAdd rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and rice is just tender, 5 to 7 minutes more. (Discard any mussels that don&apos;t open.)\n\nSet aside off of the heat to let rest for 10 minutes, and then serve.',
  },
]

export default function RecipeList({
  userID,
  recipeID,
}: {
  userID: string
  recipeID: string
}) {
  // Session
  const { data: session } = useSession()

  const [value, setValue] = useState(0)

  // trpc: recipe get all drafts
  const { data: drafts, refetch: refetchDrafts } =
    api.recipe.getMyDrafts.useQuery(undefined, {
      enabled: userID === session?.user.id,
      refetchOnWindowFocus: false,
    })

  // trpc: recipe get all published
  const {
    data: publishedRecipes,
    // refetch: refetchPublishedRecipes,
  } = api.recipe.getPublisedByUserId.useQuery(
    {
      userID,
    },
    {
      enabled: !!userID && !!recipeID,
      refetchOnWindowFocus: false,
    },
  )

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          variant="fullWidth"
          centered
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab label="สูตรของฉัน" {...a11yProps(0)} />
          <Tab label="ที่บันทึกไว้" {...a11yProps(1)} />
          <Tab label="อื่นๆ" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {drafts && drafts?.length > 0 && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              รอเผยแพร่
            </Typography>
            <Grid container spacing={1}>
              {drafts?.map((recipe) => (
                <Grid key={recipe.id}>
                  <MyDraftRecipe
                    key={recipe.id}
                    recipe={recipe}
                    refetchDrafts={refetchDrafts}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {drafts && drafts?.length > 0 && (
          <Typography variant="h6" gutterBottom>
            สูตรที่เผยแพร่แล้ว
          </Typography>
        )}
        <Grid container spacing={1}>
          {publishedRecipes &&
            publishedRecipes?.length > 0 &&
            publishedRecipes?.map((recipe) => {
              // Ensure ingredients is not null and is of correct type
              // Ensure difficulty is not null (provide a fallback if needed)
              const safeRecipe = {
                ...recipe,
                ingredients:
                  (recipe.ingredients as Ingrediants) ?? {},
                difficulty: recipe.difficulty ?? {
                  name: 'Unknown',
                  id: 'unknown',
                  createdById: null,
                  index: 0,
                },
              }
              return (
                <Grid key={recipe.id}>
                  <PublishedRecipe
                    key={recipe.id}
                    recipe={safeRecipe}
                  />
                </Grid>
              )
            })}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>

      <NewRecipe
        userID={userID}
        recipeID={recipeID}
        refetchDrafts={refetchDrafts}
      />
    </Box>
  )
}
