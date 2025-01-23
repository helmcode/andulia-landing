import { NextResponse } from "next/server"

async function validateRecaptcha(token: string) {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const email = data.get("email")
    const firstName = data.get("firstName")
    const lastName = data.get("lastName")
    const recaptchaToken = data.get("recaptchaToken")

    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "No reCAPTCHA token provided" },
        { status: 400 }
      )
    }

    const isValid = await validateRecaptcha(recaptchaToken as string)

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA validation failed" },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketing`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-Key': process.env.API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign: "andulia-beta",
        email: email,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit to API')
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for joining our beta! We'll be in touch soon.",
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Sorry, there was an error processing your request. Please try again later.",
      },
      { status: 500 }
    )
  }
}

