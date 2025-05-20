import { db } from '~/server/db'
import { firebaseAdminStorage } from '~/server/firebaseAdmin'

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData()

    const file = formData.get('file') as File
    if (!file)
      return new Response('No file uploaded', { status: 400 })

    const fileExtension = formData.get('fileExtension') as string
    if (!fileExtension)
      return new Response('No file extension provided', {
        status: 400,
      })

    const recipeId = formData.get('recipeId') as string
    if (!recipeId)
      return new Response('No recipe ID provided', { status: 400 })

    const newFileName = `${recipeId}-${Date.now()}.${fileExtension}`

    console.log('Received file:', file)
    console.log('Received file name:', newFileName)
    console.log('Received recipe ID:', recipeId)
    console.log('Received file extension:', fileExtension)

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file to Firebase Storage
    const bucket = firebaseAdminStorage.bucket()
    const fileRef = bucket.file(newFileName)

    // Using async/await with file.save()
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    })

    console.log('File uploaded to Firebase Storage:', newFileName)

    // Make the file publicly accessible
    await fileRef.makePublic()

    // Get the public URL of the file
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`
    console.log('Public URL:', publicUrl)

    // Save file path to the database
    await saveFilePathToDatabase(recipeId, publicUrl)

    return new Response(
      JSON.stringify({
        message: 'File uploaded successfully',
        url: publicUrl,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (err) {
    console.error('Error in upload handler:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

// Save file path to the database
async function saveFilePathToDatabase(
  recipeId: string,
  filename: string,
) {
  // Check if the recipe exists
  const recipe = await db.recipe.findUnique({
    where: {
      id: recipeId,
    },
  })
  if (!recipe) {
    console.error('Recipe not found:', recipeId)
    throw new Error('Recipe not found')
  }

  // Update the recipe with the file path
  await db.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      image: filename,
    },
  })
}
