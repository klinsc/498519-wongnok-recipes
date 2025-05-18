import { type NextRequest, NextResponse } from 'next/server'
import { createReadStream, existsSync } from 'fs'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ recipeID: string }> },
) {
  const { recipeID } = await params
  // Handle multiple file types
  let filePath = path.join(
    process.cwd(),
    'src',
    'assets',
    'uploads',
    `${recipeID}`,
  )
  if (existsSync(`${filePath}.jpg`)) {
    filePath = `${filePath}.jpg`
  }
  if (existsSync(`${filePath}.jpeg`)) {
    filePath = `${filePath}.jpeg`
  }
  if (existsSync(`${filePath}.png`)) {
    filePath = `${filePath}.png`
  }

  const fileStream = createReadStream(filePath)
  const readable = fileStream as unknown as ReadableStream

  // Get the file extension
  const fileExtension = path.extname(filePath).toLowerCase()
  const mimeTypeMap: Record<string, string> = {
    '.jpg': 'jpeg',
    '.jpeg': 'jpeg',
    '.png': 'png',
  }
  const mimeType = mimeTypeMap[fileExtension]
  if (!mimeType) {
    return new NextResponse('Unsupported file type', { status: 415 })
  }

  return new NextResponse(readable, {
    headers: {
      'Content-Type': `image/${mimeType}`,
    },
  })
}
