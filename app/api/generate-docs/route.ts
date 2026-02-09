import { NextRequest, NextResponse } from 'next/server';

// Retry helper with exponential backoff
async function callGeminiWithRetry(prompt: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY!
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 4096
            }
          })
        }
      );

      if (response.status === 429) {
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Rate limit hit. Retrying in ${waitTime}ms... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw new Error('Rate limit exceeded after retries. Wait 60 seconds.');
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();

    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Helper to fetch files from GitHub
async function fetchGithubFiles(githubUrl: string) {
  try {
    console.log(`[GitHub Fetch] Processing URL: ${githubUrl}`);

    // Improved regex to handle various github url formats
    const regex = /github\.com\/([^\/]+)\/([^\/\.]+)/;
    const match = githubUrl.match(regex);

    if (!match) {
      console.log('[GitHub Fetch] Invalid GitHub URL format');
      return [];
    }

    const owner = match[1];
    const repo = match[2];
    console.log(`[GitHub Fetch] Parsed: ${owner}/${repo}`);

    // 1. Get default branch
    let defaultBranch = 'main';
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        defaultBranch = repoData.default_branch;
        console.log(`[GitHub Fetch] Default branch detected: ${defaultBranch}`);
      }
    } catch (e) {
      console.log('[GitHub Fetch] Error fetching repo details, defaulting to main', e);
    }

    // 2. Fetch tree
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    console.log(`[GitHub Fetch] Fetching tree: ${treeUrl}`);

    const response = await fetch(treeUrl);

    if (!response.ok) {
      console.log(`[GitHub Fetch] Tree fetch failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.tree || !Array.isArray(data.tree)) {
      console.log('[GitHub Fetch] Invalid tree data structure');
      return [];
    }

    console.log(`[GitHub Fetch] Tree items found: ${data.tree.length}`);

    const files = data.tree
      .filter((item: any) =>
        item.type === 'blob' &&
        /\.(js|jsx|ts|tsx|py|go|java|cpp|c|h|cs|rb|php|md|json)$/.test(item.path)
      )
      .map((item: any) => ({
        name: item.path,
        size: item.size
      }));

    console.log(`[GitHub Fetch] Filtered code/doc files: ${files.length}`);
    return files;

  } catch (error) {
    console.error('[GitHub Fetch] Critical error:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { files, docTypes, style, githubUrl } = await request.json();

    let filesToProcess = files || [];

    // If no uploaded files, try to fetch from GitHub
    if (filesToProcess.length === 0 && githubUrl) {
      console.log(`Fetching files from GitHub: ${githubUrl}`);
      filesToProcess = await fetchGithubFiles(githubUrl);
    }

    if (!filesToProcess || filesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'No files provided and failed to fetch from GitHub' },
        { status: 400 }
      );
    }

    if (!docTypes || docTypes.length === 0) {
      return NextResponse.json(
        { error: 'No documentation types selected' },
        { status: 400 }
      );
    }

    console.log(`📝 Generating ${docTypes.join(', ')} docs...`);

    // Build concise prompt
    const prompt = `You are a technical documentation generator.
    
FILES TO DOCUMENT:
${filesToProcess.slice(0, 50).map((f: any) => `- ${f.name || f.path}`).join('\n')}
(Total: ${filesToProcess.length} files)

STYLE: ${style || 'technical'}

REQUIRED OUTPUT:
Generate the following documentation sections in a single valid JSON object.
Keys: ${docTypes.join(', ')}

INSTRUCTIONS:
1. Return ONLY the JSON object.
2. Do NOT use markdown code blocks (no \`\`\`json).
3. Escape all quotes and control characters properly within the JSON strings.
4. Keep the content meaningful but concise to avoid token limits.

JSON STRUCTURE:
{
  ${docTypes.includes('readme') ? '"readme": "# Project Title\\n\\nDescription...",' : ''}
  ${docTypes.includes('apiDocs') ? '"apiDocs": "# API Reference\\n\\n...",' : ''}
  ${docTypes.includes('deployment') ? '"deployment": "# Deployment\\n\\n...",' : ''}
  ${docTypes.includes('contributing') ? '"contributing": "# Contributing\\n\\n..."' : ''}
}`;

    // Call with retry logic
    const data = await callGeminiWithRetry(prompt);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('Response length:', text.length);

    // Parse JSON
    let parsed;
    try {
      let cleaned = text.trim();
      // Remove markdown code blocks if present
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

      // Find the first { and last }
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');

      if (start === -1 || end === -1) {
        throw new Error('No JSON structure found in response');
      }

      cleaned = cleaned.substring(start, end + 1);
      parsed = JSON.parse(cleaned);

    } catch (parseError: any) {
      console.error('Parse error:', parseError.message);
      console.error('Failed text start:', text.substring(0, 100));
      console.error('Failed text end:', text.substring(text.length - 100));

      return NextResponse.json({
        error: 'Failed to parse AI response',
        details: parseError.message,
        hint: 'The AI generated invalid JSON. Please try again with fewer files or simpler requirements.'
      }, { status: 500 });
    }

    // Validate at least one doc was generated
    const generatedDocs = Object.keys(parsed).filter(key =>
      ['readme', 'apiDocs', 'deployment', 'contributing'].includes(key)
    );

    if (generatedDocs.length === 0) {
      return NextResponse.json({
        error: 'No documentation generated',
        received: Object.keys(parsed)
      }, { status: 500 });
    }

    console.log(`✅ Generated: ${generatedDocs.join(', ')}`);

    return NextResponse.json({
      success: true,
      docs: parsed
    });

  } catch (error: any) {
    console.error('Generate docs error:', error);

    if (error.message.includes('Rate limit')) {
      return NextResponse.json({
        error: 'Rate limit exceeded. Please wait 60 seconds and try again.',
        hint: 'Too many requests to Gemini API. Try again in 1 minute.'
      }, { status: 429 });
    }

    return NextResponse.json({
      error: error.message || 'Failed to generate documentation'
    }, { status: 500 });
  }
}
