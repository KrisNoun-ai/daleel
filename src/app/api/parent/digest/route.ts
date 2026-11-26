import { NextResponse } from 'next/server';
import { resolveModelForTier } from '../../../../lib/modelRouter';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      studentName = 'Student',
      blueprintTitle = 'Daleel Venture',
      completedLevels = [],
      claims = [],
      hasBatchViolation = false,
      sweetener = 'Date Paste',
      tempF = 325,
    } = body;

    const fastModel = resolveModelForTier('fast');
    const latestClaim = claims.length > 0 ? claims[claims.length - 1]?.claimText : '';

    if (GEMINI_API_KEY) {
      try {
        const prompt = `
Write a warm, plain-language weekly Parent Growth Digest for ${studentName}'s guardian.
Venture: ${blueprintTitle}
Completed Milestones: ${completedLevels.join(', ') || 'In progress'}
Latest Unassisted Student Reasoning Excerpt: "${latestClaim || 'Testing single-variable isolation in the lab.'}"
Current Lab State: Sweetener=${sweetener}, Temp=${tempF}°F, Multi-variable slip=${hasBatchViolation}

Return ONLY valid JSON:
{
  "headline": string,
  "plainLanguageSummary": string,
  "reasoningExcerpt": string,
  "dinnerPrompts": [string, string]
}`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fastModel}:generateContent?key=${GEMINI_API_KEY}`;
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 350,
              responseMimeType: 'application/json',
            },
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            return NextResponse.json({ digest: JSON.parse(raw), model: fastModel });
          }
        }
      } catch (err) {
        console.warn('Parent digest Gemini fallback:', err);
      }
    }

    const firstName = studentName.split(' ')[0];
    return NextResponse.json({
      digest: {
        headline: `${firstName}'s Weekly Progress in ${blueprintTitle}`,
        plainLanguageSummary: hasBatchViolation
          ? `${firstName} ran a hands-on trial changing both sweetener (${sweetener}) and oven heat (${tempF}°F) at once—a classic real-world learning moment about isolating one variable at a time.`
          : `${firstName} completed ${completedLevels.length || 2} venture milestone(s) and practiced controlled scientific reasoning without relying on AI shortcuts.`,
        reasoningExcerpt:
          latestClaim ||
          `"Keeping oven temperature constant at 325°F lets us isolate how ${sweetener} changes texture."`,
        dinnerPrompts: [
          `Ask ${firstName} why scientists only change one ingredient or condition at a time when testing a recipe.`,
          `Ask ${firstName} what surprised them most about their ${blueprintTitle} project this week.`,
        ],
      },
      model: fastModel,
      status: 'fallback_active',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate digest' },
      { status: 500 }
    );
  }
}
