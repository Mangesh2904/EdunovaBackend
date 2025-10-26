import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Search for recent YouTube videos using Perplexity AI
 * @param {string} query - Search query for YouTube videos
 * @param {number} count - Number of videos to return
 * @returns {Promise<Array>} Array of video objects with title, channel, and search_query
 */
export const searchYouTubeVideos = async (query, count = 3) => {
  try {
    if (!PERPLEXITY_API_KEY) {
      console.warn('Perplexity API key not configured, using fallback');
      return getFallbackVideos(query, count);
    }

    const prompt = `Find ${count} high-quality, recent YouTube videos or playlists about "${query}".

CRITICAL: You MUST provide actual, working YouTube video URLs in this format: https://www.youtube.com/watch?v=VIDEO_ID

Requirements:
1. Videos uploaded within last 2 years (2023-2025)
2. From well-known educational channels (freeCodeCamp, Traversy Media, Web Dev Simplified, etc.)
3. MUST include real YouTube video URLs with actual video IDs
4. Verify the videos exist and are available

Return ONLY a JSON array:
[
  {
    "title": "Specific topic the video covers",
    "channel": "Verified channel name",
    "url": "https://www.youtube.com/watch?v=REAL_VIDEO_ID",
    "type": "Full Course|Tutorial|Crash Course|Playlist"
  }
]

IMPORTANT: 
- "url" field is REQUIRED and must be a real YouTube video URL
- Do NOT return search queries - only direct video links
- If you cannot find exact URLs, search YouTube yourself and provide the actual video URL
- Each video must have a working URL that opens the video directly

Example of correct format:
[
  {
    "title": "React Hooks Complete Guide",
    "channel": "Traversy Media", 
    "url": "https://www.youtube.com/watch?v=TNhaISOUy6Q",
    "type": "Tutorial"
  }
]`;

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      console.warn('No valid JSON found in Perplexity response, using fallback');
      return getFallbackVideos(query, count);
    }

    const videos = JSON.parse(jsonMatch[0]);
    
    // Validate and clean results
    const validVideos = videos
      .filter(v => v.title && v.channel && (v.url || v.search_query))
      .map(v => {
        // If URL exists, ensure it's a proper YouTube URL
        if (v.url && !v.url.includes('youtube.com')) {
          // Invalid URL, create search query as fallback
          v.search_query = `${v.channel} ${v.title}`;
          delete v.url;
        }
        // If no URL but has search_query, that's fine
        // If no URL and no search_query, create search_query
        if (!v.url && !v.search_query) {
          v.search_query = `${v.channel} ${v.title}`;
        }
        return v;
      })
      .slice(0, count);

    if (validVideos.length === 0) {
      console.warn('No valid videos from Perplexity, using fallback');
      return getFallbackVideos(query, count);
    }

    return validVideos;

  } catch (error) {
    console.error('Perplexity API error:', error.message);
    return getFallbackVideos(query, count);
  }
};

/**
 * Verify if resources are genuine and available using Perplexity
 * @param {string} companyName - Company name
 * @param {string} role - Job role
 * @returns {Promise<Object>} Verified resources object
 */
export const verifyPlacementResources = async (companyName, role) => {
  try {
    if (!PERPLEXITY_API_KEY) {
      console.warn('Perplexity API key not configured, using Gemini only');
      return null;
    }

    const prompt = `Find genuine, recent YouTube videos for ${role} interview preparation at ${companyName}.

CRITICAL: You MUST provide actual, working YouTube video URLs with real video IDs.

Requirements:
1. Videos from last 2 years (2023-2025)
2. From reputable channels (freeCodeCamp, Traversy Media, etc.)
3. MUST include real YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
4. 5-8 diverse resources covering interview prep, technical skills, company culture
5. Each video MUST have a working URL that opens directly

Return ONLY this JSON format:
{
  "youtube": [
    {
      "title": "What this video teaches",
      "channel": "Channel name",
      "url": "https://www.youtube.com/watch?v=REAL_VIDEO_ID",
      "type": "Full Course|Tutorial|Interview Prep|Crash Course",
      "description": "Why useful for ${role} at ${companyName}"
    }
  ]
}

IMPORTANT:
- "url" field is REQUIRED - must be real YouTube video URL
- Do NOT provide search queries - only direct video links
- Search YouTube yourself and provide actual working URLs
- Each video must open directly when clicked`;

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = response.data.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.warn('No valid JSON found in Perplexity response for resources');
      return null;
    }

    const resources = JSON.parse(jsonMatch[0]);
    
    // Validate that YouTube resources have URLs
    if (resources.youtube && Array.isArray(resources.youtube)) {
      resources.youtube = resources.youtube
        .filter(v => v.url && v.url.includes('youtube.com'))
        .map(v => {
          // Ensure proper URL format
          if (!v.url.startsWith('http')) {
            v.url = 'https://' + v.url;
          }
          // If still no valid URL, create search query as fallback
          if (!v.url.includes('youtube.com/watch')) {
            v.search_query = `${v.channel} ${v.title}`;
          }
          return v;
        });
      
      // Log how many valid URLs we got
      const urlCount = resources.youtube.filter(v => v.url && v.url.includes('youtube.com/watch')).length;
      console.log(`Got ${urlCount} YouTube videos with direct URLs out of ${resources.youtube.length} total`);
    }
    
    return resources;

  } catch (error) {
    console.error('Perplexity resource verification error:', error.message);
    return null;
  }
};

/**
 * Fallback video suggestions when Perplexity is unavailable
 */
function getFallbackVideos(query, count) {
  const channels = [
    'freeCodeCamp',
    'Traversy Media',
    'The Net Ninja',
    'Programming with Mosh',
    'Web Dev Simplified',
    'Fireship',
    'Tech With Tim',
    'Corey Schafer'
  ];

  const results = [];
  for (let i = 0; i < Math.min(count, 3); i++) {
    results.push({
      title: `${query} Tutorial`,
      channel: channels[i % channels.length],
      search_query: `${channels[i % channels.length]} ${query} 2024`,
      type: 'Tutorial'
    });
  }
  return results;
}
