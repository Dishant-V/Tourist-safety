import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { EmergencyService } from '../services/emergencyService.js';

const router = express.Router();

// Create emergency alert
router.post('/alert', authenticateToken, async (req, res) => {
  try {
    const { type, location, description, priority = 'high' } = req.body;

    if (!type || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, location' 
      });
    }

    const alert = {
      id: uuidv4(),
      userId: req.user.id,
      blockchainId: req.user.blockchainId,
      type,
      location,
      description,
      priority,
      status: 'active',
      timestamp: new Date().toISOString(),
      responseTime: null,
      resolvedAt: null
    };

    // Process emergency alert
    const result = await EmergencyService.createAlert(alert);

    res.status(201).json({
      message: 'Emergency alert created successfully',
      alert: result,
      estimatedResponseTime: '3-5 minutes'
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ error: 'Failed to create emergency alert' });
  }
});

// Get emergency alerts (for authorities)
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    const { status, priority, limit = 50 } = req.query;
    
    const alerts = await EmergencyService.getAlerts({
      status,
      priority,
      limit: parseInt(limit),
      userRole: req.user.role
    });

    res.json({
      alerts,
      total: alerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to retrieve alerts' });
  }
});

// Update alert status (for authorities)
router.patch('/alerts/:alertId', authenticateToken, async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes, responseTime } = req.body;

    if (!['police', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const updatedAlert = await EmergencyService.updateAlert(alertId, {
      status,
      notes,
      responseTime,
      updatedBy: req.user.id,
      updatedAt: new Date().toISOString()
    });

    res.json({
      message: 'Alert updated successfully',
      alert: updatedAlert
    });

  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Emergency contacts
router.get('/contacts', (req, res) => {
  const contacts = {
    emergency: {
      number: '112',
      description: 'All Emergency Services'
    },
    tourist: {
      number: '1363',
      description: 'Tourist Helpline'
    },
    police: {
      number: '100',
      description: 'Police Emergency'
    },
    medical: {
      number: '108',
      description: 'Medical Emergency'
    },
    fire: {
      number: '101',
      description: 'Fire Emergency'
    }
  };

  res.json({ contacts });
});

export default router;