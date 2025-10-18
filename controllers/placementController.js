import { askGemini, generateContent } from '../services/geminiService.js';
import Placement from '../models/Placement.js';

export const generatePlacementContent = async (req, res) => {
  const { companyName, role } = req.body;
  const userId = req.user ? req.user.id : null;

  // Debug logging
  console.log('=== Placement Content Generation ===');
  console.log('Company Name:', companyName);
  console.log('Role:', role);
  console.log('User ID:', userId);

  try {
    if (!companyName || !companyName.trim()) {
      console.log('Error: Company name is missing');
      return res.status(400).json({ error: 'Company name is required' });
    }

    if (!role || !role.trim()) {
      console.log('Error: Role is missing');
      return res.status(400).json({ error: 'Role is required' });
    }

    // Generate company-specific, purely technical questions
    const questionsPrompt = `You are a senior technical interviewer at ${companyName}. Generate 10 TECHNICAL interview questions for the ${role} position.

**CRITICAL: ALL QUESTIONS MUST BE TECHNICAL - NO BEHAVIORAL QUESTIONS**

**RESEARCH ${companyName}:**
- Core products, services, and technologies
- Tech stack: programming languages, frameworks, databases, cloud services
- Scale and technical challenges
- Technologies ${role} works with at ${companyName}

**QUESTION BREAKDOWN:**
1. 4 questions: Data Structures & Algorithms (arrays, trees, graphs, sorting, searching)
2. 3 questions: System Design & Architecture (scalability, databases, APIs, microservices)
3. 2 questions: Technology-Specific (${companyName}'s tech stack - Java, Python, React, AWS, etc.)
4. 1 question: Problem Solving & Optimization (time/space complexity, trade-offs)

**FORMAT - Return ONLY this JSON array:**
[
  {
    "question": "At ${companyName}, you need to process ${companyName}-scale data. Which data structure would you use for [specific technical scenario]?",
    "options": ["Array with O(n) lookup", "Hash Map with O(1) lookup", "Binary Search Tree with O(log n)", "Trie with O(k) complexity"],
    "correctAnswer": 1,
    "explanation": "Hash Map is optimal because [technical reasoning with Big-O analysis]. At ${companyName}'s scale of [mention scale], this provides best performance.",
    "difficulty": "Medium",
    "category": "Data Structures"
  }
]

**REQUIREMENTS:**
- ALL questions MUST be technical (coding, algorithms, system design, architecture)
- NO behavioral, cultural, or soft-skill questions
- Use ${companyName}'s actual technologies (AWS, GCP, Kubernetes, React, Node.js, etc.)
- Include Big-O notation and complexity analysis where relevant
- Reference ${companyName}'s scale (millions of users, petabytes of data, etc.)
- Mix difficulty: 3 Easy, 5 Medium, 2 Hard
- Categories: "Data Structures", "Algorithms", "System Design", "Coding", "Databases", "Architecture"
- Provide detailed technical explanations

Return ONLY the JSON array, no other text.`;

    // Generate concepts
    const conceptsPrompt = `Create a comprehensive study guide for ${companyName} ${role} position placement preparation. Include the most important concepts, topics, and areas to focus on specifically for the ${role} role.

**FORMATTING REQUIREMENTS:**
- Use ## for main section headers
- Use ### for subsection headers  
- Use bullet points (-) for lists
- Use **bold** for important terms
- Use *italics* for emphasis
- Include code examples in \`backticks\` when relevant
- Structure it like a professional study guide

**SECTIONS TO INCLUDE:**

## Technical Skills Required for ${role}
### Programming Languages
- List the main programming languages ${companyName} uses for ${role} positions
- Mention proficiency levels expected for ${role}

### Role-Specific Technical Skills
- Key technical skills specific to ${role}
- Tools and technologies commonly used by ${role} at ${companyName}
- Industry standards and best practices for ${role}

### Data Structures & Algorithms (if applicable to ${role})
- Key data structures to master for ${role}
- Important algorithms and their applications in ${role}
- Common problem patterns relevant to ${role}

### System Design (if applicable to ${role})
- System design concepts relevant to ${role}
- Scalability considerations for ${role}
- Architecture patterns used in ${role}

## Company-Specific Information
### About ${companyName}
- Brief company overview
- Core products/services relevant to ${role}
- Engineering/team culture and values
- How ${role} fits into ${companyName}'s organization

### Interview Process for ${role}
- Typical interview rounds for ${role} position
- What to expect in each round for ${role}
- Role-specific interview formats and assessments
- Tips for success in ${role} interviews

## Key Topics to Study
### Core Computer Science
- Important CS fundamentals
- Operating systems concepts
- Database management
- Networking basics

### Advanced Topics
- Distributed systems
- Cloud computing (if relevant)
- Microservices architecture
- Security considerations

## Preparation Strategy
### Timeline
- Recommended preparation duration
- Week-by-week study plan
- Practice schedule

### Resources
- Recommended books and courses
- Online platforms for practice
- Mock interview resources

## Common Interview Questions Categories
### Technical Questions
- Most frequently asked topics
- Coding problem patterns
- System design scenarios

### Behavioral Questions
- Leadership and teamwork
- Problem-solving approach
- Company fit questions

## Tips for Success
### Technical Interview Tips
- Code optimization strategies
- Communication during coding
- Testing and debugging approach

### General Interview Tips
- How to research the company
- Questions to ask interviewers
- Follow-up best practices

Make it comprehensive, actionable, and specifically tailored to ${companyName}'s ${role} interview process and requirements.`;

    // Get questions and concepts in parallel using generateContent (no chat history needed)
    console.log('Sending prompts to Gemini for:', companyName, 'and role:', role);
    const [questionsResponse, conceptsResponse] = await Promise.all([
      generateContent(questionsPrompt, 4096),
      generateContent(conceptsPrompt, 4096)
    ]);
    console.log('Received responses from Gemini');
    console.log('Questions response preview:', questionsResponse.substring(0, 100));

    // Parse questions JSON with robust error handling
    let questions;
    try {
      console.log('Raw questions response length:', questionsResponse.length);
      console.log('First 200 chars:', questionsResponse.substring(0, 200));
      
      // Clean the response to extract JSON - more aggressive cleaning
      let cleanedQuestionsResponse = questionsResponse
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/^[^[\{]*/, '') // Remove any text before [ or {
        .replace(/[^\]\}]*$/, '') // Remove any text after ] or }
        .trim();
      
      // Try to find JSON array in the response
      const jsonArrayMatch = cleanedQuestionsResponse.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        cleanedQuestionsResponse = jsonArrayMatch[0];
      }
      
      console.log('Cleaned response length:', cleanedQuestionsResponse.length);
      
      questions = JSON.parse(cleanedQuestionsResponse);
      
      // Validate questions format
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format - not an array or empty');
      }

      // Validate and fix each question
      questions = questions.map((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
          console.warn(`Question ${index} missing required fields, using default`);
          return {
            question: `Technical question ${index + 1} for ${role} at ${companyName}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "Detailed explanation needed.",
            difficulty: "Medium",
            category: "Technical"
          };
        }
        // Ensure correctAnswer is valid
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          q.correctAnswer = 0;
        }
        // Add default values if missing
        q.difficulty = q.difficulty || "Medium";
        q.category = q.category || "Technical";
        q.explanation = q.explanation || "Review this concept for interviews.";
        return q;
      });

      console.log(`Successfully parsed ${questions.length} questions`);

    } catch (parseError) {
      console.error('Error parsing questions JSON:', parseError.message);
      console.error('Response that failed:', questionsResponse.substring(0, 500));
      
      // Fallback questions with company/role context
      questions = [
        {
          question: `What are the key responsibilities of a ${role} at ${companyName}?`,
          options: ["Data Analysis", "Stakeholder Management", "Strategic Planning", "All of the above"],
          correctAnswer: 3,
          explanation: `As a ${role}, you'll typically handle multiple responsibilities including analysis, communication, and planning.`,
          difficulty: "Easy",
          category: "Role Understanding"
        },
        {
          question: `Which skill is most important for ${role} position?`,
          options: ["Technical Knowledge", "Communication", "Problem Solving", "All are equally important"],
          correctAnswer: 3,
          explanation: "A balanced skill set is crucial for success in this role.",
          difficulty: "Medium",
          category: "Skills Assessment"
        }
      ];
      console.log('Using fallback questions');
    }

    // Save to database if user is authenticated
    if (userId) {
      try {
        const placement = new Placement({
          userId,
          companyName: companyName.trim(),
          role: role.trim(),
          questions,
          concepts: conceptsResponse
        });
        await placement.save();
      } catch (saveError) {
        console.error('Error saving placement data:', saveError);
        // Don't fail the request if saving fails
      }
    }

    res.status(200).json({
      questions,
      concepts: conceptsResponse,
      companyName: companyName.trim(),
      role: role.trim()
    });

  } catch (error) {
    console.error('Error generating placement content:', error);
    res.status(500).json({ error: 'Failed to generate placement content' });
  }
};

export const getPlacementHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required to access placement history' });
    }

    const history = await Placement.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching placement history:', error);
    res.status(500).json({ error: 'Failed to fetch placement history' });
  }
};

export const searchCompanies = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  try {
    const searchPrompt = `List 10 well-known technology companies whose names start with or contain "${query}". Include both large corporations and notable startups.

Return ONLY a JSON array of company names, no additional text:
["Company Name 1", "Company Name 2", ...]

Examples format: ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Tesla", "Uber", "Airbnb", "Stripe"]

Focus on:
- Tech companies (software, hardware, cloud, AI, etc.)
- Companies known for hiring software engineers
- Mix of FAANG, unicorns, and well-known startups
- Real company names only

Return exactly 10 suggestions that match "${query}".`;

    const response = await generateContent(searchPrompt, 1024);
    
    // Parse the JSON response with robust error handling
    let companies;
    try {
      console.log('Company search response length:', response.length);
      
      // More aggressive cleaning
      let cleanedResponse = response
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/^[^\[]*/, '') // Remove text before [
        .replace(/[^\]]*$/, '') // Remove text after ]
        .trim();
      
      // Try to extract JSON array
      const jsonMatch = cleanedResponse.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      console.log('Cleaned company response:', cleanedResponse.substring(0, 200));
      
      companies = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(companies)) {
        throw new Error('Invalid response format - not an array');
      }
      
      // Filter out any non-string entries and limit to 10
      companies = companies
        .filter(c => typeof c === 'string' && c.trim().length > 0)
        .slice(0, 10);
      
      if (companies.length === 0) {
        throw new Error('No valid companies in response');
      }
      
      console.log(`Found ${companies.length} companies`);
      
    } catch (parseError) {
      console.error('Error parsing companies:', parseError.message);
      console.error('Response:', response.substring(0, 300));
      
      // Fallback with common tech companies matching the query
      const queryLower = query.toLowerCase();
      const fallbackCompanies = [
        'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
        'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Adobe',
        'Oracle', 'IBM', 'Salesforce', 'Intel', 'Nvidia',
        'Twitter', 'LinkedIn', 'Spotify', 'Slack', 'Zoom',
        'PayPal', 'Stripe', 'Square', 'Shopify', 'Atlassian'
      ];
      
      companies = fallbackCompanies
        .filter(c => c.toLowerCase().includes(queryLower))
        .slice(0, 10);
      
      // If no matches, suggest based on first letter
      if (companies.length === 0) {
        companies = fallbackCompanies
          .filter(c => c.toLowerCase().startsWith(queryLower[0]))
          .slice(0, 10);
      }
      
      // If still no matches, return top 10
      if (companies.length === 0) {
        companies = fallbackCompanies.slice(0, 10);
      }
      
      console.log('Using fallback companies:', companies.length);
    }

    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({ error: 'Failed to search companies' });
  }
};