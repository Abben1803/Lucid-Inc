import NextAuth, { type NextAuthOptions } from 'next-auth'

import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions) as never
export { handler as GET, handler as POST }