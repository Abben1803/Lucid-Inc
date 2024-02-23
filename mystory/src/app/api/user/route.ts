import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const userSchema = z
  .object({
    firstName: z.string().min(1, 'Firstname is required').max(100),
    lastName: z.string().min(1, 'Lastname is required').max(100),
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })


export async function POST(req: Request){
    try{
        const body = await req.json();
        const { email, firstName, lastName, username, password } = userSchema.parse(body);

        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 });
        }

        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        });
        if (existingUserByUsername) {
            return NextResponse.json({ user: null, message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword
            }
        })

        const { password: newUserPassword, ...rest} = newUser;

        return NextResponse.json({ user: rest, message: 'User created successfully' }, { status: 201 });
    }catch(error){
        return NextResponse.json({ user: null, message: 'Error creating user' }, { status: 500 });
    }
}