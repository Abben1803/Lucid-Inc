
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest, res: NextResponse){
    const body = await req.json();
    const { prompt } = body;
    const storyParagraphs = await getStory(prompt); // This already returns an array of paragraphs.
    console.log(storyParagraphs);
    return NextResponse.json({ story: storyParagraphs }, { status: 200 });
}

async function getStory(story: string){
    const OpenAI = require('openai')
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Your roles is to be a childrens story book writer for children of age 6-10. You must not generate a title. Your job is to write a story based on the following prompt. You must generate atleast 200 words per paragraph for the story. You must make sure that the story consists of paragraphs seperated by "|".',
            },
            {
                role: 'user',
                content: `story: ${story}`,
            },
        ],
    });
    const prompts = response.choices[0].message.content.trim().split("|") || "No Story Generated";
    return prompts;
}