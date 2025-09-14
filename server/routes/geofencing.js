import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { GeofencingService } from '../services/geofencingService.js';

const router = express.Router();

// Update user location
router.post('/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Missing required fields: latitude, longitude' 
      });
    }

    const locationUpdate = {
      userId: req.user.id,
      blockchainId: req.user.blockchainId,
      location: { latitude, longitude, accuracy },
      timestamp: new Date().toISOString()
    };

    const result = await GeofencingService.updateLocation(locationUpdate);

    res.json({
      message: 'Location updated successfully',
      safetyStatus: result.safetyStatus,
      alerts: result.alerts,
      nearbyAttractions: result.nearbyAttractions
    });

  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Get safety zones
router.get('/safety-zones', (req, res) => {
  try {
    const safetyZones = GeofencingService.getSafetyZones();
    
    res.json({
      zones: safetyZones,
      total: safetyZones.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Safety zones error:', error);
    res.status(500).json({ error: 'Failed to retrieve safety zones' });
  }
});

// Check location safety
router.post('/check-safety', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Missing required fields: latitude, longitude' 
      });
    }

    const safetyCheck = await GeofencingService.checkLocationSafety({
      latitude,
      longitude,
      userId: req.user.id
    });

    res.json({
      safetyLevel: safetyCheck.level,
      warnings: safetyCheck.warnings,
      recommendations: safetyCheck.recommendations,
      nearbyServices: safetyCheck.nearbyServices
    });

  } catch (error) {
    console.error('Safety check error:', error);
    res.status(500).json({ error: 'Failed to check location safety' });
  }
});

export default router;