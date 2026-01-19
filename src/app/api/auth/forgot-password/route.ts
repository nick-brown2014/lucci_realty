import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Don't reveal if user exists for security
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with that email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send email with reset link
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    // Use verified subdomain alerts.nocorealtor.com (or onboarding@resend.dev for testing)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    const result = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Reset Your Password - TODO: NAME',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <h1 style="color: #2c3e50; margin-bottom: 20px;">Reset Your Password</h1>

              <p style="margin-bottom: 20px;">Hello ${user.firstName},</p>

              <p style="margin-bottom: 20px;">
                We received a request to reset your password for your TODO: NAME account.
                Click the button below to create a new password:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>

              <p style="margin-bottom: 20px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="background-color: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all; margin-bottom: 20px;">
                ${resetUrl}
              </p>

              <p style="margin-bottom: 20px;">
                This link will expire in 1 hour for security reasons.
              </p>

              <p style="margin-bottom: 20px;">
                If you didn't request this password reset, you can safely ignore this email.
                Your password will remain unchanged.
              </p>

              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

              <p style="font-size: 12px; color: #6c757d;">
                TODO: TITLE<br>
                TODO: TAGLINE
              </p>
            </div>
          </body>
        </html>
      `
    })

    console.log('Resend API result:', JSON.stringify(result, null, 2))

    if (result.error) {
      console.error('Error sending reset email:', result.error)
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully! Email ID:', result.data?.id)

    return NextResponse.json(
      { message: 'If an account exists with that email, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}