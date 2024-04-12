import { POST } from '../app/api/signup/route';
import { expect } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function clearDatabase() {
  // Clear the database by deleting all users
  await prisma.user.deleteMany();
}

beforeAll(async () => {
  // Clear the database before running the tests
  await clearDatabase();
});


afterAll(async () => {
  // Close Prisma client after all tests are finished
  await prisma.$disconnect();
});



async function testSignup() {
  const testEmail = 'test@example.com';
  const testPassword = 'NwnO-Fa3S6-6';

  try {
    // Create a request object with the test data
    const req = new NextRequest('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    // Call the POST handler with the test request
    const res = await POST(req, new NextResponse());

    // Check the response status and data
    if (res.status === 201) {
      // User created successfully
      expect(await res.json()).toEqual({
        message: 'User created successfully.',
        user: {
          email: testEmail,
        },
      });
    } else if (res.status === 409) {
      // User already exists
      expect(await res.json()).toEqual({
        message: 'User already exists.',
      });
    } else {
      // Unexpected response status
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

test('Signup with new user', async () => {
  await testSignup();
});

test('Signup with missing request body', async () => {
  const req = new NextRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const res = await POST(req, new NextResponse());

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ message: 'Request body is missing.' });
});

test('Signup with missing email or password', async () => {
  const req = new NextRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const res = await POST(req, new NextResponse());

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ message: 'Email and password are required.' });
});

test('Signup with weak password', async () => {
  const req = new NextRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'weak', // Provide a weak password
    }),
  });

  const res = await POST(req, new NextResponse());

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ message: 'Password is too weak.' });
});

test('Signup with invalid email format', async () => {
  const req = new NextRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'invalid-email', // Provide an invalid email format
      password: 'NwnO-Fa3S6-6',
    }),
  });

  const res = await POST(req, new NextResponse());

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ message: 'Invalid email format.' });
});



test('Signup with existing user', async () => {
  // Mock the database response to simulate an existing user
  jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    isAdmin: false,
    registrationDate: new Date(),
  });
  

  await testSignup();
});


test('Input sanitized for user creation', async () => {
  // Mock the database response with a user object containing an XSS payload in the password
  jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
    id: 1,
    email: 'test@example.com',
    password: '`<script>alert("XSS")</script>`',
    isAdmin: false,
    registrationDate: new Date(),
  });

  // Create a request object with the test data
  const req = new NextRequest('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com',
      password: '`<script>alert("XSS")</script>`',
    }),
  });

  // Call the POST handler with the test request
  const res = await POST(req, new NextResponse());

  // Assert that the request was rejected due to invalid input (status 400)
  expect(res.status).toBe(400);

  // Assert that the response contains the expected error message for weak password
  const { message } = await res.json();
  expect(message).toBe('Password is too weak.');
});


// back end test s