import express from 'express';
import { culturalData } from '../data/cultural.js';

const router = express.Router();

// Get all cultural items
router.get('/items', (req, res) => {
  try {
    const { type, region, limit = 50 } = req.query;
    
    let filteredData = culturalData;

    if (type) {
      filteredData = filteredData.filter(item => item.type === type);
    }

    if (region) {
      filteredData = filteredData.filter(item => 
        item.region.toLowerCase().includes(region.toLowerCase())
      );
    }

    const limitedData = filteredData.slice(0, parseInt(limit));

    res.json({
      items: limitedData,
      total: limitedData.length,
      filters: { type, region, limit }
    });

  } catch (error) {
    console.error('Cultural items error:', error);
    res.status(500).json({ error: 'Failed to retrieve cultural items' });
  }
});

// Get specific cultural item
router.get('/items/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const item = culturalData.find(item => item.id === itemId);

    if (!item) {
      return res.status(404).json({ error: 'Cultural item not found' });
    }

    res.json({ item });

  } catch (error) {
    console.error('Cultural item error:', error);
    res.status(500).json({ error: 'Failed to retrieve cultural item' });
  }
});

// Get cultural statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalItems: culturalData.length,
      byType: {},
      byRegion: {},
      recentlyAdded: culturalData
        .filter(item => item.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };

    // Count by type
    culturalData.forEach(item => {
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    });

    // Count by region
    culturalData.forEach(item => {
      stats.byRegion[item.region] = (stats.byRegion[item.region] || 0) + 1;
    });

    res.json({ stats });

  } catch (error) {
    console.error('Cultural stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve cultural statistics' });
  }
});

export default router;