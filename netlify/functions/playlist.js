const axios = require('axios');

// Parse M3U playlist data
const parseM3UPlaylist = (playlistContent) => {
  const lines = playlistContent.split('\n');
  const playlist = [];
  let currentItem = null;

  lines.forEach((line) => {
    if (line.startsWith('#EXTINF:')) {
      currentItem = {
        raw: line,
        url: '',
        attributes: {}
      };
      
      // Parse attributes
      const attributesMatch = line.match(/tvg-([^=]+)="([^"]+)"/g);
      if (attributesMatch) {
        attributesMatch.forEach(attr => {
          const [key, value] = attr.replace(/tvg-([^=]+)="([^"]+)"/, '$1,$2').split(',');
          currentItem.attributes[key] = value;
        });
      }
      
      // Parse title
      const titleMatch = line.match(/,(.*)$/);
      if (titleMatch) {
        currentItem.title = titleMatch[1].trim();
        
        // Parse series info (if applicable)
        const seriesMatch = currentItem.title.match(/^(.*?)\s+S(\d+)E(\d+)$/i);
        if (seriesMatch) {
          currentItem.seriesName = seriesMatch[1].trim();
          currentItem.seasonNumber = parseInt(seriesMatch[2], 10);
          currentItem.episodeNumber = parseInt(seriesMatch[3], 10);
          currentItem.isSeries = true;
        }
      }
      
      // Parse group
      const groupMatch = line.match(/group-title="([^"]+)"/);
      if (groupMatch) {
        currentItem.group = groupMatch[1];
      }
    } else if (line.trim() !== '' && !line.startsWith('#') && currentItem) {
      currentItem.url = line.trim();
      playlist.push(currentItem);
      currentItem = null;
    }
  });

  return playlist;
};

// Group items by category with better organization
const categorizePlaylist = (playlist) => {
  const categories = {};
  const seriesMap = {};
  
  // First pass: identify all series and their episodes
  playlist.forEach(item => {
    if (item.isSeries) {
      const seriesKey = `${item.group} | ${item.seriesName}`;
      if (!seriesMap[seriesKey]) {
        seriesMap[seriesKey] = {
          title: item.seriesName,
          group: item.group,
          seasons: {},
          logo: item.attributes.logo || ''
        };
      }
      
      if (!seriesMap[seriesKey].seasons[item.seasonNumber]) {
        seriesMap[seriesKey].seasons[item.seasonNumber] = [];
      }
      
      seriesMap[seriesKey].seasons[item.seasonNumber].push(item);
    }
  });
  
  // Sort episodes within each season
  Object.values(seriesMap).forEach(series => {
    Object.keys(series.seasons).forEach(seasonNum => {
      series.seasons[seasonNum].sort((a, b) => a.episodeNumber - b.episodeNumber);
    });
  });
  
  // Second pass: group non-series items by category
  playlist.forEach(item => {
    if (!item.isSeries) {
      const group = item.group || 'Uncategorized';
      if (!categories[group]) {
        categories[group] = [];
      }
      categories[group].push(item);
    }
  });
  
  // Add special series category
  if (Object.keys(seriesMap).length > 0) {
    categories['__series__'] = seriesMap;
  }
  
  return categories;
};

exports.handler = async function(event, context) {
  // Check if request is GET method
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Get URL from query parameters
  const params = new URLSearchParams(event.queryStringParameters);
  const url = params.get('url');

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Playlist URL is required' })
    };
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const playlist = parseM3UPlaylist(response.data);
    const categorized = categorizePlaylist(playlist);
    
    // Create a flat array of all items for easy lookup
    const allItems = [];
    Object.entries(categorized).forEach(([category, items]) => {
      if (category === '__series__') {
        // Handle series differently
        Object.values(items).forEach(series => {
          Object.values(series.seasons).forEach(episodes => {
            allItems.push(...episodes);
          });
        });
      } else {
        allItems.push(...items);
      }
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        count: playlist.length,
        categories: categorized,
        allItems
      })
    };
  } catch (error) {
    console.error('Error fetching playlist:', error.message);
    return { 
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch playlist',
        message: error.message
      })
    };
  }
}; 