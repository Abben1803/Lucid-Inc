// we will generate titles for the story
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse){
    const body = await req.json();
    const { story } = body;
    const title = await getTitle(story);
    return NextResponse.json({ title: title }, { status: 200 });
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