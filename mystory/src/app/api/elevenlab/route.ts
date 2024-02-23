import { config } from 'dotenv';
config();

export async function POST(request: any, res: any){
    const body = await request.json();
    const { story } = body;
    let voice_narrator = "Adam";

    const url = `https://api.stablediffusion.com/v1/generate?prompt=${story}&voice_narrator=${voice_narrator}`;
    const headers = {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELVENLABS_API_KEY,
    };
    const reqBody = JSON.stringify({
        text: story,
        model_id: "elven_monolingual_v1",
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
        },
    });

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                ...headers,
                "xi-api-key": process.env.ELVENLABS_API_KEY || "",
            },
            body: reqBody,
        });

        if(!response.ok){
            throw new Error(response.statusText);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Response(buffer);
    }catch(error: any){
        return new Response(JSON.stringify({ error: error.message }));
    }
    
}

export default async function handler(req: any, res: any){
    if(req.method === "POST"){
        return POST(req, res);
    }
    return res.status(405).json({ message: "Method not allowed" });
}