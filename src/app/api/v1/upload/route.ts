import fs from 'fs/promises'
import path from 'path'
import { db } from '~/server/db'

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData()

    const file = formData.get('file') as File
    if (!file)
      return new Response('No file uploaded', { status: 400 })

    const fileType = file.type

    const recipeId = formData.get('recipeId') as string
    if (!recipeId)
      return new Response('No recipe ID provided', { status: 400 })

    console.log('Received file:', file)
    console.log('Received recipe ID:', recipeId)

    const filePath = path.join(
      process.cwd(),
      'src',
      'assets',
      'uploads',
      `${recipeId}${fileType === 'image/jpeg' ? '.jpg' : '.png'}`,
    )

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write file to disk
    await fs.writeFile(filePath, buffer)

    // Save file path to the database
    await saveFilePathToDatabase(recipeId, filePath)

    return new Response('File uploaded and saved successfully', {
      status: 200,
    })
  } catch (err) {
    console.error('Error in upload handler:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

// Save file path to the database
async function saveFilePathToDatabase(
  recipeId: string,
  filePath: string,
) {
  // Check if the recipe exists
  const recipe = await db.recipeName.findUnique({
    where: {
      id: recipeId,
    },
  })
  if (!recipe) {
    console.error('Recipe not found:', recipeId)
    throw new Error('Recipe not found')
  }

  // Check if the recipe detail exists or create it
  const recipeDetail = await db.recipeDetail.findFirst({
    where: {
      recipeNameId: recipeId,
    },
  })
  if (!recipeDetail) {
    await db.recipeDetail.create({
      data: {
        recipeNameId: recipeId,
        image: filePath,
      },
    })
  } else {
    await db.recipeDetail.update({
      where: {
        id: recipeDetail.id,
      },
      data: {
        image: filePath,
      },
    })
  }
}
