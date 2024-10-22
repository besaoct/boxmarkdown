import { countAIGens } from '@/actions/user/count-ai-gens';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genContent = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "text/plain" }, // Ensure response is in markdown
    systemInstruction: `
      You are an assistant tasked with generating a detailed and well-structured webpage in markdown format, with the flexibility to use HTML elements where necessary (supported by markdown). The generated content will later be converted into a full webpage, so it needs to be comprehensive, clear, and well-organized.

      **Guidelines for generating the markdown layout:**
      - **Content Structure:** Start with a main title, followed by sections with headings, subheadings, and paragraphs. Ensure each section flows logically to the next.
      - **Use of HTML:** Where markdown formatting may not suffice (e.g., for tables, embedding media, or structuring forms), include HTML elements like \`<table>\`, \`<div>\`, \`<img>\`, etc.
      - **Formatting:**
        - **Titles and Headings:** Use markdown for headings (\`#\`, \`##\`, etc.).
        - **Lists:** Use markdown for lists where possible (\`-\`, \`1.\`).
        - **Links, Images, and Tables:** Use markdown or HTML, depending on complexity.
        - **Complex Structures:** For grids, forms, or other advanced layouts, use HTML as needed.
      - **Tone and Style:** Maintain a professional, informative, and engaging tone suitable for a webpage. Ensure the language is clear and concise.
      - **SEO Best Practices:** Incorporate relevant keywords in headings. Utilize semantic HTML tags (e.g., \`<section>\`, \`<article>\`) to enhance SEO.
      - **Call to Action:** Include a concluding section or a call to action (e.g., contact forms, links to resources, or prompts for user interaction).

      **Output Requirements:**
      - The final output must be in raw markdown format.
      - The whole output should not be inside the code block.
      - Only include markdown and allowed HTML elements.
      - Ensure the content is suitable for both direct markdown rendering and conversion to HTML for web usage.

      **Prompt:**
      ${prompt}
    `,
  });

  const result = await model.generateContent(prompt);
  
  // Ensure the response is successfully obtained
  if (!result.response) {
    throw new Error(`API responded with status ${result.response}`);
  }

  const text = await result.response.text();

  return text;
};

export async function POST(request: NextRequest) {
  try {
    const { jsonData } = await request.json();

    if (!jsonData || typeof jsonData.prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a valid prompt.' },
        { status: 400 }
      );
    }

    const { prompt } = jsonData;

    const Content = await genContent(prompt);
    await countAIGens()
    return NextResponse.json({ markdownPage: Content });
  } catch (error) {
    console.error('Error generating markdown content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}
