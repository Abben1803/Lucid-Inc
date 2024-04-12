import NextAuth from './next-auth.options'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/api/auth/:path*'],
}

export default async function auth(req: NextRequest) {
  return await NextResponse.next()
}