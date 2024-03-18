import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; 
import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers'


import story from '@/pages/[story]';

const prisma = new PrismaClient();

export async function POST(req: Request, res: NextApiResponse) {
    const headersList = headers();
    const session = await getServerSession(authOptions); // Getting our server side session.
    const userEmail = session?.user?.email; // session

    if (!userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { prompt, age, language, genre, artstyle } = await req.json();

    // Generate story paragraphs
    const storyParagraphs = await getStory(prompt, age, language, genre, artstyle);

    // Generate image prompts
    const imagePrompts = await getPrompts(storyParagraphs.join('|'), genre);

    // Generate and save images
    //const imagePaths = await generateAndSaveImages(imagePrompts);

    const imagePaths = await generateAndSaveImagesDallE(imagePrompts);

    // Generate title
    const title = await getTitle(storyParagraphs.join('|'));

    const book = await prisma.book.create({
        data: {
            title: title, 
            userEmail, 
            inputParams: {
                create: { age: parseInt(age), prompt, genre, artstyle, language },
            },
            paragraphs: {
                create: storyParagraphs.map((paragraph: string, index: number) => {
                    const imageData = imagePaths[index] ? { create: { image: imagePaths[index] } } : undefined;
                    return {
                        paragraph,
                        paragraphNumber: index + 1,
                        image: imageData,
                    };
                }),
            },
        },
    });

    return NextResponse.json({ bookId: book.id }, { status: 200 });

}


async function getStory(story: string, age: string, language: string, genre: string, artstyle: string) {
    const OpenAI = require('openai');
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const systemPrompt = `Your role is to be a children's storybook writer for children of age ${age} in ${language}. The genre is ${genre} and the artstyle is ${artstyle}. You must not generate a title. Your job is to write a story based on the following prompt ${story}. You must generate at least 200 words per paragraph for the story. The story must consist of paragraphs separated by "|".`;

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
    console.log(paragraphs);
    return paragraphs;
}

async function getPrompts(story: string, artstyle: string) {
    const OpenAI = require('openai');
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a friendly assistant. Your job is to generate image prompts for each paragraph of the following story. Each prompt should be a very descriptive sentence that incorporates the specified art style. Please list all prompts separated by the "|" symbol. For example, "a good day in comic style | a spooky figure in comic style | a lit up street in comic style". You must make sure that for each paragraph of the story, you generate a prompt for the image that includes the art style.',
            },
            {
                role: 'user',
                content: `story: ${story}\nartstyle: ${artstyle}`,
            },
        ],
    });
    const prompts = response.choices[0].message?.content?.trim().split("|") || ["No Story Generated"];
    console.log(prompts);
    return prompts;
}

async function generateAndSaveImagesStability(prompts: string[]) {
    const imagePaths = [];

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.STABILITYAI_API_KEY}`,
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: prompt,
                    },
                ],
                cfg_scale: 7,
                clip_guidance_preset: 'FAST_BLUE',
                height: 512,
                width: 512,
                samples: 1,
                steps: 30,
            }),
        });

        if (!response.ok) {
            console.error(`Failed to generate image for prompt: ${prompt}`);
            continue;
        }

        const data = await response.json();

        if (data.artifacts && data.artifacts.length > 0) {
            const base64Image = data.artifacts[0].base64;
            const filename = `image-${Date.now()}-${i}.png`;
            const imagePath = await saveImage(base64Image, filename);
            imagePaths.push(imagePath);
        } else {
            console.error(`No image data received for prompt: ${prompt}`);
        }
    }

    return imagePaths;
}


async function generateAndSaveImagesDallE(prompts: string[]) {
    const imagePaths = [];
    const OpenAI = require('openai');
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        try {
            const response = await openai.images.generate({
                prompt: prompt,
                model: "dall-e-3",
                n: 1,
                size: '1024x1024',
                response_format: "b64_json",
            });

            if (response.data && response.data.length > 0) {
                const base64Image = response.data[0].b64_json;
                const filename = `image-${Date.now()}-${i}.png`;
                const imagePath = await saveImage(base64Image, filename);
                imagePaths.push(imagePath);
            } else {
                console.error(`No image data received for prompt: ${prompt}`);
            }
        } catch (error) {
            console.error(`Failed to generate image for prompt: ${prompt}`, error);
        }
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
    console.log(title);
    return title;
}