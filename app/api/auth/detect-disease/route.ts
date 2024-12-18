import { NextResponse } from 'next/server'

const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY
const ROBOFLOW_MODEL_ENDPOINT = process.env.ROBOFLOW_MODEL_ENDPOINT

export async function POST(req: Request) {
  try {
    const { image } = await req.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const imageData = image.split(',')[1]

    const response = await fetch(ROBOFLOW_MODEL_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: imageData,
      params: {
        api_key: ROBOFLOW_API_KEY,
      },
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Error processing image' },
      { status: 500 }
    )
  }
}

