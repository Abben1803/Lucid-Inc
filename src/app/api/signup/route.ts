import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import validator from 'validator';




export async function POST(req: NextRequest, res: NextResponse) {
  
  if (!req.body) {
    return NextResponse.json({ message: 'Request body is missing.' }, { status: 400 });
  }

  const body = await req.json();
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  if(!validateEmail(email)) {
    return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
  }

  if(!validatePassword(password)) {
    return NextResponse.json({ message: 'Password is too weak.' }, { status: 400 });
  }

  try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
          where: { email },
      });

      if (existingUser) {
          return NextResponse.json({ message: 'User already exists.' }, { status: 409 });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await prisma.user.create({
          data: {
              email,
              password: hashedPassword,
          },
      });

      // Successfully created the user
      return NextResponse.json({ message: 'User created successfully.', user: { email: newUser.email } }, { status: 201 });
  } catch (error: any) {
      // Handle unexpected errors
      console.error('Signup error:', error);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

function validateEmail(email: string) {
  // Sanitize the email input
  const sanitizedEmail = validator.normalizeEmail(email, { all_lowercase: true });

  // Check if the sanitized email is a non-empty string
  if (typeof sanitizedEmail !== 'string' || sanitizedEmail.length === 0) {
    return false; 
  }

  const emailRegex = /^[\w\-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(sanitizedEmail);
}

function validatePassword(password: string) {
  // Sanitize the password input
  const sanitizedPassword = validator.escape(password);

  // Validate the sanitized password
  return sanitizedPassword.length >= 8 && sanitizedPassword.length <= 20;
}