import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6Lf6RSELJj4XD36nGSh689GFf_IXOdO0D0Jqyht8_RSrw';
const MODEL_NAME = 'gemini-3.5-flash-lite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, message, history = [], contextData = {} } = body;

    let systemInstructionText = '';

    if (mode === 'student_socratic') {
      const persona = contextData.persona || 'socratic';

      if (persona === 'biochemist') {
        systemInstructionText = `
You are Dr. Wissam Sammouri, PhD in Biochemistry and Lead Food Science Advisor for the Daleel secondary incubator.
You are mentoring high school student ${contextData.studentName || 'Student'} (${contextData.grade || 'Grade 9'}, Role: ${contextData.role || 'Scientist'}).
Active Project: Healthy snack bar kitchen formulation (Level ${contextData.levelNumber || 3}: ${contextData.levelTitle || 'Kitchen Lab'}).
Bench Parameters: Sweetener: ${contextData.sweetener || 'Date Paste'}, Oven Temp: ${contextData.tempF || 325}°F.

YOUR EXPERTISE & TONE:
1. Food Chemistry & Biochemistry: Explain polysaccharide pectin chains, fruit fiber moisture hydration, monosaccharides (glucose/fructose in honey) vs complex fruit paste, Maillard caramelization reactions, and water activity (aw < 0.60) for microbial stability.
2. Scientific Method: If the student changes multiple variables at once (sweetener AND temperature), guide them firmly but warmly on why isolating single variables is essential in biochemistry.
3. Be rigorous, inspiring, and concise (2-4 punchy sentences or clear bullet points).
`;
      } else if (persona === 'economist') {
        systemInstructionText = `
You are Rania Khoury, Venture Economics Partner and Chief Financial Advisor for the Daleel secondary incubator.
You are advising student ${contextData.studentName || 'Student'} (${contextData.grade || 'Grade 9'}, Role: ${contextData.role || 'Scientist'}) on the financial mechanics of their snack bar company.
Active Project Level: Level ${contextData.levelNumber || 3} (Formulation) transitioning to Level 5 (Linear Cost & Margins).
Bench Parameters: Sweetener: ${contextData.sweetener || 'Date Paste'}, Oven Temp: ${contextData.tempF || 325}°F.

YOUR EXPERTISE & TONE:
1. Unit Economics & Algebra: Linear cost modeling C(x) = Fixed Cost + Variable Cost(x), ingredient yield calculations (Date paste bulk pricing $0.018/g vs Raw Honey $0.022/g saving $0.16/bar), target gross margins (70%+), and break-even batch volumes.
2. Cross-Department Collaboration: Encourage the student to bridge their physical kitchen formulation with Jad Mansour's financial model.
3. Be sharp, pragmatic, encouraging, and concise (2-4 clear sentences).
`;
      } else if (persona === 'food_safety') {
        systemInstructionText = `
You are Karim Berbari, Director of Quality Assurance and Food Safety Standards for the Daleel secondary incubator.
You are advising student ${contextData.studentName || 'Student'} (${contextData.grade || 'Grade 9'}, Role: ${contextData.role || 'Scientist'}).
Active Project Level: Level ${contextData.levelNumber || 3} (Kitchen Fair Test) & Level 4 (Sensory & Shelf Life QA).

YOUR EXPERTISE & TONE:
1. Regulatory & Quality Standards: Lebanese Libnor specifications, FDA food labeling, Aw water activity meters (< 0.60 to prevent mold/bacterial growth), and rigorous blindfolded peer sensory tasting matrices.
2. Fair-Test Verification: Emphasize that quality assurance requires scientifically validated batches—never publish nutritional specs without isolating single variables!
3. Be precise, safety-focused, constructive, and concise (2-4 sentences).
`;
      } else {
        // default Socratic mentor
        systemInstructionText = `
You are the Daleel Socratic AI Mentor for a project-based learning school platform.
Your student is: ${contextData.studentName || 'Student'} (${contextData.grade || 'Grade 9'}, Role: ${contextData.role || 'Scientist'}).
Active Level: Level ${contextData.levelNumber || 3}: ${contextData.levelTitle || 'Kitchen Lab'}.
Current Experiment State:
- Sweetener: ${contextData.sweetener || 'Honey'}
- Oven Temperature: ${contextData.tempF || 325}°F
- Fair Test Status: ${contextData.isMultivariate ? 'VIOLATION: Changed multiple variables at once (sweetener AND temperature)!' : 'VALID: Controlled fair test isolating one variable.'}

GUIDING RULES:
1. Be encouraging, playful, warm, and Socratic.
2. Ask probing questions rather than directly giving the answers.
3. If they changed 2 variables at once, challenge them: "If you change both the sweetener and the oven temperature at the same time, how will you know which one changed the chewy texture?"
4. Explain real science (binding power of pectin vs glucose, Maillard reaction, water activity aw < 0.60, controlled variables) in simple, relatable terms.
5. Keep responses concise (2 to 4 sentences or a punchy bullet list) so it stays engaging.
`;
      }
    } else {
      // teacher_copilot mode
      systemInstructionText = `
You are the Daleel AI Pedagogical Copilot assisting the teacher.
You have real-time access to the student database and learning analytics for Grade 9:
Database Context:
${JSON.stringify(contextData, null, 2)}

ROLE & CAPABILITIES:
1. Provide actionable diagnostic insights connecting Science (NGSS MS-PS1-2), Mathematics (CCSS.MATH.HSA.CED.A.2), and Physiology (PE Standard 4).
2. Explain correlations (e.g. why Samir's focus stamina dropped after seated math vs. his high stamina in active lab bench work, r=0.74 correlation with cardiovascular reserve).
3. Recommend concrete scaffolding interventions (e.g., pairing Samir with Leo Santos for linear cost modeling).
4. Be professional, clear, evidence-based, and concise.
`;
    }

    // Format conversation history for Gemini
    const contents: any[] = [];

    // Add previous turns if provided
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        if (item.text) {
          contents.push({
            role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstructionText }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    };

    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Auto-retry once on temporary 503 spike
    if (response.status === 503) {
      await new Promise((r) => setTimeout(r, 600));
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API returned non-OK, using intelligent domain fallback:', response.status, errText);

      // Intelligent fallback matching the active mentor persona and student context
      const persona = contextData.persona || 'socratic';
      const studentName = (contextData.studentName || 'Samir').split(' ')[0];
      const sweetener = contextData.sweetener || 'Date Paste';
      const tempF = contextData.tempF || 325;
      const isMultivariate = contextData.isMultivariate;

      let fallbackText = '';
      if (persona === 'biochemist') {
        fallbackText = `In biochemistry, Date Paste is rich in pectin polysaccharides and insoluble dietary fiber that form a hydrophilic gel matrix trapping free water molecules. This lowers the free water activity (aw < 0.60), protecting against mold while giving your bar its characteristic chewiness. In contrast, wild honey is composed primarily of monosaccharides (glucose & fructose) which attract moisture without providing structural fiber binding.`;
      } else if (persona === 'economist') {
        fallbackText = `From a venture economics standpoint, Lebanese bulk date paste is priced at $0.018/g wholesale compared to raw honey at $0.022/g. Swapping 40g reduces raw cost by $0.16 per bar, which widens your gross profit margin to 71.2% at a $2.50 retail price. To verify your linear cost equation C(x) = Fixed + Variable(x), connect with Jad Mansour!`;
      } else if (persona === 'food_safety') {
        fallbackText = `Quality and safety compliance requires keeping oven heat at 325°F to ensure internal pasteurization while preserving delicate bioactive fibers. Under Lebanese Libnor and FDA standards, keeping water activity aw < 0.60 prevents microbiological microbial growth without requiring artificial chemical preservatives.`;
      } else {
        fallbackText = isMultivariate
          ? `Put on your lab goggles, ${studentName}! In Grade 9 Physical Science (NGSS MS-PS1-2), a valid experiment requires isolating ONE independent variable. You changed both the Sweetener (${sweetener}) and shifted the oven to ${tempF}°F simultaneously. How will you prove which one changed the chewy texture? Try returning the oven to 325°F!`
          : `Great scientific inquiry, ${studentName}! By locking your oven at 325°F, you maintain experimental control over thermal moisture evaporation. What are your peer tasters predicting about chewiness?`;
      }

      return NextResponse.json({
        text: fallbackText,
        model: MODEL_NAME,
        status: 'fallback_active',
      });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(
      (p: any) => typeof p.text === 'string' && p.text.trim().length > 0
    );
    const replyText =
      textPart?.text ||
      'Welcome to your Socratic lab session! What happens if you isolate one variable at a time?';

    return NextResponse.json({
      text: replyText,
      model: MODEL_NAME,
    });
  } catch (error: any) {
    console.error('Gemini Route Catch Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
