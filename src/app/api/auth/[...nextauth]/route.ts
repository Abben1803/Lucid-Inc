import { prisma } from '../../../../lib/prisma'
import { compare } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import GoogleProvider from "next-auth/providers/google"


interface SessionUser {
  id: string;
  email: string;
  isAdmin: boolean;
  randomKey: string;
}

interface JWTUser {
  id: string;
  email: string;
  isAdmin: boolean;
  randomKey: string;
}


export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
    async authorize(credentials): Promise<{ email: string; randomKey: string; id: string; isAdmin: boolean } | null> {
        if (!credentials?.email || !credentials.password) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: {
                email: credentials.email
            }
        })

        if (!user) {
            return null
        }

        const isPasswordValid = await compare(
                credentials.password,
                user.password,
        )

        if (!isPasswordValid) {
                return null
        }

        return {
            id: user.id +'',
            email: user.email,
            randomKey: 'Welcome to MUS',
            isAdmin: user.isAdmin
        }
      }
    }), GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      //console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id || '',
          isAdmin: token.isAdmin,
          randomKey: token.randomKey || ''
        } as SessionUser
      }
    },
    jwt: ({ token, user }) => {
      //console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as JWTUser
        return {
          ...token,
          id: u.id,
          isAdmin: u.isAdmin, // checking whether the user is an admin for some administrator page shenanigans
          randomKey: u.randomKey
        } 
      }
      return token
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }