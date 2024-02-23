import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    pages: {
        signIn: "sign-in",
        signOut: "sign-out",
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith@hotmail.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }

            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email }
            });
            if (!existingUser) {
                return null;
            }

            const passwordMatch = credentials.password && existingUser.password
                ? await compare(credentials.password, existingUser.password)
                : false;
            if (!passwordMatch) {
                return null;
            }
            return {
                id: '${existingUser.id}',
                email: existingUser.email,
                username: existingUser.username
            }

          }
        })
    ]

}