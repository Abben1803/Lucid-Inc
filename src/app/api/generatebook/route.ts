import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

const OpenAI = require('openai')
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function POST(req: Request, res: NextApiResponse) {
    const session = await getServerSession(authOptions); // Getting our server side session.
    const userEmail = session?.user?.email; // session

    if (!userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { prompt, age, language, genre, artstyle } = await req.json();

    // Generate story paragraphs
    const storyParagraphs = await getStory(prompt, age, language, genre, artstyle);

    // Generate image prompts
    const imagePrompts = await getPrompts(storyParagraphs.join('|'), artstyle);


    const imagePaths = await generateAndSaveImagesDallE(imagePrompts);

    // Generate title
    const title = await getTitle(storyParagraphs.join('|'), language);

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

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a friendly assistant. Your job is to generate highly descriptive image prompts for each paragraph of the following story. Each prompt should capture the key elements, actions, and emotions described in the corresponding paragraph, while explicitly incorporating the specified art style. The prompts should provide enough detail to create vivid and engaging images that accurately represent the story. Make sure to include the art style in each prompt. Please list all prompts separated by the "|" symbol.',
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



async function generateAndSaveImagesDallE(prompts: string[]) {
    const imagePaths = [];


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

async function getTitle(story: string, language: string){
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Your job is to generate a title for the following story. The title should be a single sentence.',
            },
            {
                role: 'user',
                content: `story: ${story}\nlanguage: ${language}`,
            },
        ],
    });
    const title = response.choices[0].message?.content?.trim() || "No Title Generated";
    console.log(title);
    return title;
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
