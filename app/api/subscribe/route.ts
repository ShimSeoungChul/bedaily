import { getResend, AUDIENCE_ID } from '@/lib/resend'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    await getResend().contacts.create({
      email: email.trim().toLowerCase(),
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    })
    return Response.json({ ok: true })
  } catch (err: any) {
    if (err?.statusCode === 422 || err?.name === 'validation_error') {
      return Response.json({ error: 'Already subscribed' }, { status: 409 })
    }
    console.error('Subscribe error:', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
