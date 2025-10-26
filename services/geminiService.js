import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// For chatbot with conversation history
export const askGemini = async (prompt, chatHistory = []) => {
  try {
    // If no chat history, use generateContent instead
    if (!chatHistory || chatHistory.length === 0) {
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get response from Gemini');
  }
};

// For single prompts without conversation history
export const generateContent = async (prompt, maxTokens = 4096) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    });
    return result.response.text();
  } catch (error) {
    console.error('Gemini generateContent error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

export const generateStructuredRoadmap = async (topic, weeks) => {
  const prompt = `Generate a comprehensive ${weeks}-week learning roadmap for "${topic}".

Return ONLY valid JSON in this exact format (YouTube videos will be added separately):
{
  "topic": "${topic}",
  "duration_weeks": ${weeks},
  "total_estimated_hours": <number>,
  "description": "<brief overview>",
  "prerequisites": ["prereq1", "prereq2"],
  "milestones": [
    {
      "week": 1,
      "title": "Week 1: <Title>",
      "topics": ["topic1", "topic2", "topic3"],
      "difficulty": "Beginner|Intermediate|Advanced",
      "estimated_hours": <number>
    }
  ],
  "projects": [
    {
      "title": "<project name>",
      "description": "<what to build>",
      "week_assignment": <week_number>,
      "difficulty": "Beginner|Intermediate|Advanced",
      "estimated_hours": <number>
    }
  ]
}

Focus on creating a comprehensive learning path with clear topics for each week. YouTube resources will be added automatically using AI-powered search.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const roadmapData = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!roadmapData.milestones || roadmapData.milestones.length === 0) {
      throw new Error('Invalid roadmap structure: missing milestones');
    }

    // Add YouTube videos using Gemini for each week
    console.log('Fetching YouTube videos using Gemini AI...');
    for (let i = 0; i < roadmapData.milestones.length; i++) {
      const milestone = roadmapData.milestones[i];
      try {
        // Create a search query combining topic and week topics
        const weekTopics = milestone.topics ? milestone.topics.join(', ') : milestone.title;
        const searchQuery = `${topic} ${weekTopics}`;
        
        // Fetch 2-3 videos for this week using Gemini
        const videos = await getSimpleYouTubeVideos(searchQuery, 3);
        milestone.youtube_videos = videos;
        
        console.log(`Added ${videos.length} videos for Week ${milestone.week}`);
      } catch (error) {
        console.error(`Error fetching videos for week ${milestone.week}:`, error);
        // Continue with next week if this one fails
        milestone.youtube_videos = [];
      }
    }

    return roadmapData;
  } catch (error) {
    console.error('Error generating structured roadmap:', error);
    throw new Error(`Failed to generate roadmap: ${error.message}`);
  }
};

/**
 * Get YouTube videos for a simple search query
 * @param {string} query - Search query
 * @param {number} count - Number of videos
 * @returns {Promise<Array>} Array of video objects
 */
const getSimpleYouTubeVideos = async (query, count = 3) => {
  try {
    const prompt = `Find ${count} YouTube tutorial videos about "${query}".

Return ONLY a JSON array with video information:
[
  {
    "title": "Video title",
    "channel": "Channel name",
    "search_query": "${query}",
    "type": "Tutorial"
  }
]

Use diverse, well-known educational channels.`;

    const result = await generateContent(prompt, 512);
    let cleanedResponse = result
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();
    
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const videos = JSON.parse(jsonMatch[0]);
      return videos.slice(0, count);
    }
  } catch (error) {
    console.error('Error getting simple YouTube videos:', error);
  }
  
  // Fallback
  return [{
    title: `${query} Tutorial`,
    channel: "freeCodeCamp",
    search_query: `${query} tutorial 2024`,
    type: "Tutorial"
  }];
};

/**
 * Get YouTube video recommendations with direct links using Gemini
 * @param {string} companyName - Company name
 * @param {string} role - Job role
 * @returns {Promise<Object>} YouTube resources with direct links
 */
export const getYouTubeResources = async (companyName, role) => {
  try {
    const prompt = `You are helping someone prepare for a ${role} interview at ${companyName}.

Recommend 6-8 specific YouTube videos that would be helpful. For each video, you MUST provide:
1. A realistic video title
2. The channel name
3. A direct YouTube URL in format: https://www.youtube.com/watch?v=VIDEO_ID (use realistic video IDs)
4. Video type (Tutorial/Full Course/Interview Prep/etc.)
5. Brief description of relevance

IMPORTANT GUIDELINES:
- Use DIVERSE channels (freeCodeCamp, Traversy Media, Fireship, NeetCode, ByteByteGo, Clément Mihailescu, Tech With Tim, Web Dev Simplified, Hussein Nasser, etc.)
- Each URL must be a valid YouTube watch URL with a video ID
- DON'T repeat the same channel
- Focus on ${role} skills and ${companyName} interview prep
- Include recent, popular videos when possible

Return ONLY this exact JSON format (no markdown, no extra text):
{
  "youtube": [
    {
      "title": "Complete video title here",
      "channel": "Channel Name",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "type": "Tutorial",
      "description": "Brief explanation of how this helps"
    }
  ]
}

Make sure each URL follows the pattern: https://www.youtube.com/watch?v=XXXXXXXXXXX (11 characters for video ID)`;

    const result = await generateContent(prompt, 2048);
    
    // Clean the response to extract JSON
    let cleanedResponse = result
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
    
    // Try to find JSON object in the response
    const jsonObjectMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      cleanedResponse = jsonObjectMatch[0];
    }
    
    const resources = JSON.parse(cleanedResponse);
    
    // Validate that we have YouTube resources
    if (!resources.youtube || !Array.isArray(resources.youtube) || resources.youtube.length === 0) {
      throw new Error('No YouTube resources found in Gemini response');
    }
    
    // Validate and clean URLs
    resources.youtube = resources.youtube.map(video => {
      // Check if URL is valid YouTube watch URL
      if (video.url && video.url.match(/youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/)) {
        // URL looks good, keep it
        return video;
      } else {
        // URL is missing or invalid, add search_query for fallback
        video.search_query = `${video.channel} ${video.title}`;
        delete video.url; // Remove invalid URL
        return video;
      }
    });
    
    console.log(`Gemini provided ${resources.youtube.length} YouTube videos`);
    return resources;
    
  } catch (error) {
    console.error('Error getting YouTube resources from Gemini:', error);
    throw error; // Let the controller handle the error
  }
};

