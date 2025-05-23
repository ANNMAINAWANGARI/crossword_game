import { NextResponse } from 'next/server';
interface RequestBody {
  levelCount: number;
  gridSize:number;
}

export interface Keyword {
  word: string;
  clue: string;
  summary: string;
  category: string;
}

export async function POST(request:Request) {
  const {levelCount,gridSize } :RequestBody  = await request.json();

  const prompt = `
    Using real, up-to-date news from today, generate a list of ${levelCount} important single-word keywords that do not exceed ${gridSize} letters. The keywords should have 5 or more letters.

    Each keyword should be a product, technology, or trending topic that appeared in today's news.

    For each keyword, provide the following:
    Keyword - A single word (minimum 5 letters) that is relevant and appeared in the news.
    Clue - A concise, dictionary-style definition or explanation of the word in one sentence.
    Short News Summary - A brief (1-2 sentence) summary describing how or why this word was relevant in today's news. 
    ***Do not include the keyword itself in the summary.*** Instead, use synonyms, related phrases, or indirect references.
    Category - Label the word with an appropriate category such as technological, political, economic, scientific, environmental, cultural, or health-related.

    Return ONLY an array of objects, each with:
    - "word": a single word (no phrases or product names).
    - "clue": a precise, brief explanation or definition.
    - "summary": brief summary of how relevant in today's news, without using the word itself.
    - "category": category of the news.

    Do not add any other text before or after the array. Return only the array.

    Example output:
    [
      { "word": "algorithm", "clue": "Process or set of rules followed in calculations.","summary":"An automated decision-making tool at a major tech company led to unexpected employee terminations, sparking discussions on AI ethics.","category":"technological" },
      {
        "word": "pride",
        "clue": "In this context, refers to the Orlando Pride, a professional women's soccer team based in Orlando, Florida.",
        "summary": "A prominent women's team announced renewed broadcasting deals to improve viewer access.","category":"sports"
       },
       {
        "word": "darts",
        "clue": "A competitive sport where players throw small missiles at a circular target fixed to a wall.",
        "summary": "A popular European league continues its tournament tour, drawing record attendance at recent matches.","category":"sports"
        },
        {
         "word": "ceasefire",
         "clue": "A temporary suspension of fighting; a truce.",
         "summary": "Leaders in two neighboring countries reached an agreement to pause hostilities after diplomatic mediation.","category":"political"
        },
        {
         "word": "congress",
         "clue": "The national legislative body of a country, particularly the United States Congress, comprising the Senate and the House of Representatives.",
         "summary": "A federal ruling emphasized the limits of executive authority in reshaping administrative structures.","category":"political"
        }
    ]
  `;
  
  
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: 'You are an assistant that returns only well-formatted array of objects. Each element in the array must be an object with four fields: "word" (a single-word keyword), "clue" (a concise, dictionary-style definition), "summary" (a short news summary explaining the word’s relevance today), and "category" (such as technological, political, entertainment, sports, health-related, etc.). Do not include any explanations, headers, or extra text—just the array output.' },
        { role: 'user', content: prompt },
      ]
    }),
  });

  const data = await res.json();
  console.log('output data',data)

  // Parse and return the JSON array from the model's response
  let keywords: Keyword[] | string = [];
  try {
    keywords = JSON.parse(data.choices?.[0]?.message?.content);
  } catch (e) {
    console.log('error is',e)
    // fallback: return the raw text if parsing fails
    keywords = data.choices?.[0]?.message?.content;
  }

  return NextResponse.json({ keywords });
}
