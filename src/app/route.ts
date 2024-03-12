import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';


// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   // Only for post
//   if (req.method !== 'POST') {
//       res.setHeader('Allow', ['POST']);
//       return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   try {
//       // Check if the user already exists
//       const existingUser = await prisma.user.findUnique({
//           where: { email },
//       });

//       if (existingUser) {
//           return res.status(409).json({ message: 'User already exists.' });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Create the new user
//       const newUser = await prisma.user.create({
//           data: {
//               email,
//               password: hashedPassword,
//           },
//       });

//       // Successfully created the user
//       return res.status(201).json({ message: 'User created successfully.', user: { email: newUser.email } });
//   } catch (error: any) {
//       // Handle unexpected errors
//       console.error('Signup error:', error);
//       return res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// }

export async function POST(req: NextRequest) {
  if (!req.body) {
    // Handle the error appropriately, for example, send a response with a 400 status code
    return NextResponse.json({ message: 'Request body is missing.' }, { status: 400 });
  }

  const body = await req.json();
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
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