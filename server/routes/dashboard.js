import express from 'express';
import { authorizeRoles } from '../middleware/auth.js';
import { DashboardService } from '../services/dashboardService.js';

const router = express.Router();

// Tourist dashboard data
router.get('/tourist', authorizeRoles('tourist'), async (req, res) => {
  try {
    const dashboardData = await DashboardService.getTouristDashboard(req.user.id);
    res.json(dashboardData);
  } catch (error) {
    console.error('Tourist dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Police dashboard data
router.get('/police', authorizeRoles('police', 'superadmin'), async (req, res) => {
  try {
    const dashboardData = await DashboardService.getPoliceDashboard(req.user.id);
    res.json(dashboardData);
  } catch (error) {
    console.error('Police dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Transport dashboard data
router.get('/transport', authorizeRoles('transport', 'superadmin'), async (req, res) => {
  try {
    const dashboardData = await DashboardService.getTransportDashboard(req.user.id);
    res.json(dashboardData);
  } catch (error) {
    console.error('Transport dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Super admin dashboard data
router.get('/superadmin', authorizeRoles('superadmin'), async (req, res) => {
  try {
    const dashboardData = await DashboardService.getSuperAdminDashboard();
    res.json(dashboardData);
  } catch (error) {
    console.error('Super admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

export default router;