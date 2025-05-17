export const POST = async (req: Request) => {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return new Response('No file uploaded', { status: 400 })

  // Do something with file (e.g., save to disk/cloud)
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
