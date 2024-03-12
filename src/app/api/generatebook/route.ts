import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; 
import { NextApiRequest, NextApiResponse } from 'next';
import story from '@/pages/story/[story]';

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions); // Getting our server side session.
    const userEmail = session?.user?.email; // session

    if (!userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { prompt, age, language, genre, artstyle } = req.body;

    // Generate story paragraphs
    const storyParagraphs = await getStory(prompt, age, language, genre, artstyle);

    // Generate image prompts
    const imagePrompts = await getPrompts(storyParagraphs.join('|'));

    // Generate and save images
    const imagePaths = await generateAndSaveImages(imagePrompts);

    // Generate title
    const title = await getTitle(storyParagraphs.join('|'));

    const book = await prisma.book.create({
        data: {
            title: title, 
            userEmail, 
            inputParams: {
                create: { age: parseInt(age), prompt, genre, artstyle, language },
            },
            paragraph: {
                create: storyParagraphs.map((paragraph: string, index: number) => ({
                    paragraph,
                    paragraphNumber: index + 1,
                    image: {
                        create: {
                            image: imagePaths[index],
                        },
                    },
                })),
            },
        },
    });

    return res.status(200).json({ bookId: book.id });
}


async function getStory(story: string, age: string, language: string, genre: string, artstyle: string) {
    const OpenAI = require('openai');
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const systemPrompt = `Your role is to be a children's storybook writer for children of age ${age} in ${language}. The genre is ${genre} and the artstyle is ${artstyle}. You must not generate a title. Your job is to write a story based on the following prompt. You must generate at least 200 words per paragraph for the story. The story must consist of paragraphs separated by "|".`;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: `story: ${story}`,
            },
        ],
    });

    const paragraphs = response.choices[0].message?.content?.trim().split("|") || ["No Story Generated"];
    return paragraphs;
}

async function getPrompts(story: string) {
    const OpenAI = require('openai')
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a friendly assistant. Your job is to generate images prompts for each new line for the following story. Each prompt should be short and descriptive sentence. Please list all prompts seperated by "|" symbol. For example, "a good day | a spooky figure | a lit up street". You must make sure that for each paragraph of the story you generate a prompt for the image.',
            },
            {
                role: 'user',
                content: `story: ${story}`,
            },
        ],
    });
    const prompts = response.choices[0].message?.content?.trim().split("|") || ["No Story Generated"];
    console.log(prompts);
    return prompts;
}

async function generateAndSaveImages(prompts: string[]) {
    const imagePaths = [];

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-1-6/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.STABILITYAI_API_KEY}`
            },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        const filename = `image-${Date.now()}-${i}.png`;
        const imagePath = await saveImage(data.image, filename);

        imagePaths.push(imagePath);
    }

    return imagePaths;
}

async function saveImage(base64Data: string, filename: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const imagePath = path.join(process.cwd(), 'public', 'images', filename);
    fs.writeFileSync(imagePath, buffer);
    return `/images/${filename}`;
}

async function getTitle(story: string){
    const OpenAI = require('openai')
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Your job is to generate a title for the following story. You must make sure that the title is short and descriptive. The title should be a single sentence.',
            },
            {
                role: 'user',
                content: `story: ${story}`,
            },
        ],
    });
    const title = response.choices[0].message?.content?.trim() || "No Title Generated";
    return title;
}