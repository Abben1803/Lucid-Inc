import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest, res: NextResponse){
    const body = await req.json();
    const{story} = body;
    let allImages = []
    const prompts = await getPrompts(story);
    for(let i = 0; i < prompts.length; i++){
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
        allImages.push(data.image);
    }
    return NextResponse.json({ images: allImages });
}

async function getPrompts(story: string){
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
    const prompts = response.choices[0].message?.content?.trim().split("|") || "No Story Generated";
    console.log(prompts);
    return prompts;
}