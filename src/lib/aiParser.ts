import { AIParsedResult, DSAProblem, LifeTask, ScheduleBlock } from '../types/index';

/**
 * Intelligent client-side rule and entity parser for natural language brain dumps.
 * Zero external dependencies, runs instantly offline, handles English & Hinglish.
 */
export function parseWithBuiltinNLP(prompt: string): AIParsedResult {
  const lower = prompt.toLowerCase();
  const sentences = prompt.split(/[.\n;]+/).map((s) => s.trim()).filter(Boolean);

  const result: AIParsedResult = {
    summary: 'Auto-categorized multi-pillar focus plan',
    dsaProblems: [],
    clientTasks: [],
    collegeTasks: [],
    outreachLeads: [],
    interviewTopics: [],
    healthMetrics: {},
    timelineBlocks: [],
    generalTasks: [],
  };

  // Helper to extract time (e.g. "at 2pm", "by 5:30 pm", "7am", "11:00")
  const extractTime = (str: string): { time: string; raw: string } | null => {
    const timeRegex = /(?:at|by|from|around)?\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)?)/i;
    const match = str.match(timeRegex);
    if (!match) return null;
    let t = match[1].trim().toUpperCase();
    if (!t.includes('AM') && !t.includes('PM')) {
      const num = parseInt(t);
      if (num >= 7 && num <= 11) t += ' AM';
      else if (num >= 1 && num <= 6) t += ' PM';
      else t += ' PM';
    }
    return { time: t, raw: match[0] };
  };

  // 1. Check for Health & Routines
  if (lower.includes('water') || lower.includes('hydrate') || lower.includes('glasses') || lower.includes('cups')) {
    const glassMatch = lower.match(/(\d+)\s*(?:glasses|cups|glass|l|litres)/);
    const count = glassMatch ? parseInt(glassMatch[1]) : 8;
    result.healthMetrics = { ...result.healthMetrics, waterGlasses: Math.min(12, count) };
  }
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('exercise') || lower.includes('run') || lower.includes('training')) {
    result.healthMetrics = { ...result.healthMetrics, workoutDone: false };
    const t = extractTime(prompt);
    result.timelineBlocks.push({
      time: t ? t.time : '07:30 PM',
      endTime: '08:30 PM',
      title: 'Physical Movement / Gym',
      description: 'Daily strength workout and physical recovery',
      category: 'health',
      done: false,
    });
  }
  if (lower.includes('sleep') || lower.includes('rest')) {
    const sleepMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:hrs|hours|h)/);
    if (sleepMatch) {
      result.healthMetrics = { ...result.healthMetrics, sleepHours: parseFloat(sleepMatch[1]) };
    }
  }

  // 2. Check for DSA & LeetCode
  if (
    lower.includes('leetcode') ||
    lower.includes('dsa') ||
    lower.includes('graph') ||
    lower.includes('tree') ||
    lower.includes('bfs') ||
    lower.includes('dfs') ||
    lower.includes('dp') ||
    lower.includes('dynamic programming') ||
    lower.includes('binary search') ||
    lower.includes('two pointers') ||
    lower.includes('array') ||
    lower.includes('python')
  ) {
    let topic = 'General Algorithms';
    if (lower.includes('graph')) topic = 'Graphs';
    else if (lower.includes('tree') || lower.includes('bfs') || lower.includes('dfs')) topic = 'Trees & BFS';
    else if (lower.includes('dp') || lower.includes('dynamic programming')) topic = 'Dynamic Programming';
    else if (lower.includes('binary search')) topic = 'Binary Search';
    else if (lower.includes('two pointer') || lower.includes('sliding window')) topic = 'Two Pointers & Sliding Window';

    let diff: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (lower.includes('hard')) diff = 'Hard';
    else if (lower.includes('easy')) diff = 'Easy';

    // Problem count
    const numMatch = lower.match(/(\d+)\s*(?:problem|problems|questions|q)/);
    const count = numMatch ? Math.min(5, parseInt(numMatch[1])) : 2;

    for (let i = 1; i <= count; i++) {
      result.dsaProblems.push({
        title: `${topic} Problem ${i}: Optimization & Traversal in Python 3`,
        difficulty: diff,
        topic,
        solved: false,
        notes: 'Implement clean Python 3 solution with time and space complexity analysis.',
      });
    }

    result.timelineBlocks.push({
      time: '08:30 AM',
      endTime: '10:30 AM',
      title: `DSA Deep Work: ${count} ${topic} Problems`,
      description: `Solve ${count} ${diff} problems in Python 3 on LeetCode.`,
      category: 'dsa',
      done: false,
    });

    result.generalTasks.push({
      title: `Solve ${count} ${diff} ${topic} problems on LeetCode (Python 3)`,
      category: 'dsa',
      priority: 'must',
      done: false,
      dueTime: '10:30 AM',
    });
  }

  // 3. Check for Video Client Projects
  if (
    lower.includes('client') ||
    lower.includes('video') ||
    lower.includes('edit') ||
    lower.includes('rough cut') ||
    lower.includes('review') ||
    lower.includes('promo') ||
    lower.includes('export') ||
    lower.includes('alex') ||
    lower.includes('footage')
  ) {
    let clientName = 'Alex Thorne';
    if (lower.includes('thorne')) clientName = 'Alex Thorne';
    else if (lower.includes('saas client') || lower.includes('startup')) clientName = 'SaaS Startup Client';
    else if (lower.includes('creator')) clientName = 'High-Growth Creator';

    const t = extractTime(lower);
    const deadline = t ? `Today ${t.time}` : 'Today 5:00 PM';

    result.clientTasks.push({
      clientName,
      projectTitle: '60s Motion Promo & Retention Video',
      taskText: 'Timeline assemble, typography pass and export review link',
      dealValue: '$1,500',
      deadline,
    });

    result.timelineBlocks.push({
      time: '11:00 AM',
      endTime: '01:00 PM',
      title: `Video Deliverable: ${clientName}`,
      description: 'Timeline sync, kinetic motion typography pass & review link export',
      category: 'clients',
      done: false,
      highlight: true,
    });

    result.generalTasks.push({
      title: `Deliver video edit & review link for ${clientName}`,
      category: 'clients',
      priority: 'must',
      done: false,
      dueTime: deadline,
    });
  }

  // 4. Check for College & Academics
  if (
    lower.includes('college') ||
    lower.includes('lecture') ||
    lower.includes('attend') ||
    lower.includes('attendance') ||
    lower.includes('os') ||
    lower.includes('operating system') ||
    lower.includes('dbms') ||
    lower.includes('database') ||
    lower.includes('networks') ||
    lower.includes('cs401') ||
    lower.includes('assignment')
  ) {
    let subjectName = 'Operating Systems';
    let subjectCode = 'CS401';
    if (lower.includes('dbms') || lower.includes('database')) {
      subjectName = 'Database Management Systems';
      subjectCode = 'CS402';
    } else if (lower.includes('network')) {
      subjectName = 'Computer Networks';
      subjectCode = 'CS403';
    }

    const t = extractTime(lower);
    const lectureTime = t ? t.time : '02:00 PM';

    result.collegeTasks.push({
      subjectName,
      subjectCode,
      assignmentText: lower.includes('assignment') ? 'Lecture assignment submission' : undefined,
      attended: true,
    });

    result.timelineBlocks.push({
      time: lectureTime,
      endTime: '03:30 PM',
      title: `College Lecture: ${subjectName} (${subjectCode})`,
      description: 'Attend lecture and protect 75%+ attendance safe criteria',
      category: 'college',
      done: false,
    });

    result.generalTasks.push({
      title: `Attend ${subjectName} (${subjectCode}) lecture`,
      category: 'college',
      priority: 'should',
      done: false,
      dueTime: lectureTime,
    });
  }

  // 5. Check for High-Ticket Outreach CRM
  if (
    lower.includes('outreach') ||
    lower.includes('dm') ||
    lower.includes('cold email') ||
    lower.includes('leads') ||
    lower.includes('founders') ||
    lower.includes('twitter') ||
    lower.includes('linkedin') ||
    lower.includes('close')
  ) {
    const leadCountMatch = lower.match(/(\d+)\s*(?:dms|leads|emails|messages)/);
    const count = leadCountMatch ? parseInt(leadCountMatch[1]) : 5;

    result.outreachLeads.push({
      name: 'Tech Founder Prospect',
      platform: lower.includes('linkedin') ? 'LinkedIn' : lower.includes('email') ? 'Cold Email' : 'Twitter / X',
      handle: '@founder_sprint',
      niche: 'AI SaaS Founder',
      status: 'Lead',
      dealPotential: '$2,500/mo retainer',
      lastContacted: 'Today',
      notes: `Batch outreach of ${count} personalized motion concepts`,
    });

    result.timelineBlocks.push({
      time: '04:30 PM',
      endTime: '06:00 PM',
      title: `Outreach CRM: Send ${count} Founder DMs`,
      description: 'Send personalized video concept audits to SaaS founders',
      category: 'outreach',
      done: false,
    });

    result.generalTasks.push({
      title: `Send ${count} founder outreach DMs with portfolio audit links`,
      category: 'outreach',
      priority: 'should',
      done: false,
      dueTime: '06:00 PM',
    });
  }

  // 6. Check for Technical Interview Prep
  if (
    lower.includes('interview') ||
    lower.includes('prep') ||
    lower.includes('system design') ||
    lower.includes('caching') ||
    lower.includes('acid') ||
    lower.includes('concurrency')
  ) {
    result.interviewTopics.push({
      category: lower.includes('system design') ? 'System Design' : 'OS',
      title: lower.includes('system design') ? 'System Design: Caching & Rate Limiting' : 'Operating Systems: Virtual Memory & Concurrency',
      mastered: false,
      notes: 'Revise core concepts and trade-offs for technical interview rounds.',
    });
  }

  // Fallback if no specific categories triggered: create a general focus task
  if (result.generalTasks.length === 0 && sentences.length > 0) {
    result.generalTasks.push({
      title: prompt.slice(0, 80),
      category: 'general',
      priority: 'must',
      done: false,
    });
    result.timelineBlocks.push({
      time: '10:00 AM',
      endTime: '11:30 AM',
      title: 'Priority Work Block',
      description: prompt.slice(0, 100),
      category: 'general',
      done: false,
    });
  }

  result.summary = `Generated ${result.dsaProblems.length} DSA items, ${result.clientTasks.length} client tasks, ${result.collegeTasks.length} college entries, and ${result.timelineBlocks.length} timeline blocks.`;

  return result;
}

/**
 * Free Google Gemini Flash Structured LLM Parser.
 * Takes user's raw conversational brain dump and generates valid JSON.
 */
export async function parseWithGeminiAPI(prompt: string, apiKey: string): Promise<AIParsedResult> {
  const systemPrompt = `You are the executive AI Operating System for a high-performance software engineer and video editor.
Given a raw daily task brain dump, parse it into structured JSON adhering strictly to this schema:
{
  "summary": "Short 1-sentence summary of the day",
  "dsaProblems": [{"title": "string", "difficulty": "Easy|Medium|Hard", "topic": "string", "solved": false, "notes": "string"}],
  "clientTasks": [{"clientName": "string", "projectTitle": "string", "taskText": "string", "dealValue": "string", "deadline": "string"}],
  "collegeTasks": [{"subjectName": "string", "subjectCode": "string", "assignmentText": "string", "attended": true}],
  "outreachLeads": [{"name": "string", "platform": "Twitter / X|LinkedIn|Cold Email", "handle": "string", "niche": "string", "status": "Lead", "dealPotential": "string", "lastContacted": "Today", "notes": "string"}],
  "interviewTopics": [{"category": "OS|DBMS|Computer Networks|System Design|Behavioral", "title": "string", "mastered": false, "notes": "string"}],
  "healthMetrics": {"waterGlasses": 8, "sleepHours": 7.5, "workoutDone": false},
  "timelineBlocks": [{"time": "09:00 AM", "endTime": "10:30 AM", "title": "string", "description": "string", "category": "dsa|college|interview|clients|outreach|health|general", "done": false, "highlight": false}],
  "generalTasks": [{"title": "string", "category": "dsa|college|interview|clients|outreach|health|general", "priority": "must|should|later", "done": false, "dueTime": "string"}]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Brain Dump:\n"${prompt}"\n\nReturn pure JSON only.` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');

  return JSON.parse(text) as AIParsedResult;
}

/**
 * Smart Hybrid Parser:
 * Tries Gemini Flash if apiKey is provided; otherwise seamlessly uses the intelligent offline parser.
 */
export async function parsePromptWithHybridAI(prompt: string, apiKey?: string): Promise<{ result: AIParsedResult; engine: 'gemini' | 'builtin' }> {
  if (apiKey && apiKey.trim()) {
    try {
      const result = await parseWithGeminiAPI(prompt, apiKey.trim());
      return { result, engine: 'gemini' };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in parser:', err);
    }
  }

  // Built-in intelligent parser
  const result = parseWithBuiltinNLP(prompt);
  return { result, engine: 'builtin' };
}
