/**
 * Parse M3U playlist data into a structured format
 * @param {string} data - Raw M3U playlist content
 * @returns {Object} Object containing items and categories
 */
const parseM3U = (data) => {
  if (!data) {
    return { items: [], categories: [] };
  }

  const lines = data.split('\n');
  const items = [];
  const categories = new Set();

  let currentItem = null;

  lines.forEach(line => {
    line = line.trim();

    // Skip empty lines or comments that aren't directives
    if (!line || (line.startsWith('#') && !line.startsWith('#EXTINF:') && !line.startsWith('#EXTGRP:') && !line.startsWith('#EXTVLCOPT:'))) {
      return;
    }

    // Parse info line
    if (line.startsWith('#EXTINF:')) {
      currentItem = {
        name: '',
        url: '',
        group: '',
        logo: '',
        duration: 0,
      };

      // Extract duration
      const durationMatch = line.match(/#EXTINF:(-?\d+)/);
      if (durationMatch) {
        currentItem.duration = parseInt(durationMatch[1], 10);
      }

      // Extract title
      const titleMatch = line.match(/,(.+)$/);
      if (titleMatch) {
        currentItem.name = titleMatch[1].trim();
      }

      // Extract attributes like tvg-logo, group-title, etc.
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      if (logoMatch) {
        currentItem.logo = logoMatch[1];
      }

      const groupMatch = line.match(/group-title="([^"]+)"/);
      if (groupMatch) {
        currentItem.group = groupMatch[1];
        categories.add(groupMatch[1]);
      }
    }
    // Parse group line (alternative to group-title attribute)
    else if (line.startsWith('#EXTGRP:') && currentItem) {
      const group = line.substring(8).trim();
      currentItem.group = group;
      categories.add(group);
    }
    // Parse additional options
    else if (line.startsWith('#EXTVLCOPT:') && currentItem) {
      // Handle VLC specific options if needed
    }
    // Parse URL line
    else if (!line.startsWith('#') && currentItem) {
      currentItem.url = line;
      items.push({...currentItem});
      currentItem = null;
    }
  });

  return {
    items,
    categories: Array.from(categories)
  };
};

export default parseM3U; 