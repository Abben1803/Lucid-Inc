
function processStory (response: any) {
    const fullstory = response.choices[0].message.content.content.trim();
    const paragraphs = fullstory.split('\n');

    const imagePrompts =  paragraphs.map((paragraph: string) => {
        return `paragraph: ${paragraph}`;
    });

    return {
        story: fullstory,
        imagePrompts: imagePrompts,
    };  
}

