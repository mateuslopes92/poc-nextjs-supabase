import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = '/dashboard'
  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  console.log('Confirm route called with', { token_hash, type })
  if (token_hash && type) {
    const cookiesStore = await cookies()
    const supabase = await createClient(cookiesStore)
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log('Email confirmation result:', { error })
    if (!error) {
      redirectTo.searchParams.delete('next')
      console.log('Email confirmed, redirecting to', redirectTo.toString())
      cookiesStore.set('auth-token', token_hash)
      return NextResponse.redirect(redirectTo)
    }
  }
  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}