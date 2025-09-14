import { EmergencyService } from './emergencyService.js';
import { GeofencingService } from './geofencingService.js';
import { BlockchainService } from './blockchainService.js';
import { culturalData } from '../data/cultural.js';

export class DashboardService {
  static async getTouristDashboard(userId) {
    const recentTransactions = await BlockchainService.getTransactions({ userId, limit: 5 });
    const nearbyAttractions = GeofencingService.findNearbyAttractions(26.1445, 91.7362);
    
    return {
      user: { id: userId },
      safetyStatus: 'safe',
      currentLocation: 'Guwahati, Assam',
      recentTransactions,
      nearbyAttractions,
      culturalHighlights: culturalData.slice(0, 4),
      emergencyContacts: {
        emergency: '112',
        tourist: '1363',
        police: '100'
      }
    };
  }

  static async getPoliceDashboard(userId) {
    const activeAlerts = await EmergencyService.getAlerts({ status: 'active', limit: 10 });
    const recentAlerts = await EmergencyService.getAlerts({ limit: 20 });
    
    return {
      user: { id: userId },
      activeIncidents: activeAlerts.length,
      totalIncidents: recentAlerts.length,
      responseTime: '4.2 minutes',
      activeAlerts,
      incidentStats: {
        resolved: recentAlerts.filter(a => a.status === 'resolved').length,
        pending: recentAlerts.filter(a => a.status === 'active').length,
        investigating: recentAlerts.filter(a => a.status === 'investigating').length
      }
    };
  }

  static async getTransportDashboard(userId) {
    // Mock transport data
    const vehicles = [
      { id: 'AS01AB1234', status: 'active', passengers: 45, route: 'Guwahati-Shillong' },
      { id: 'ML05CD5678', status: 'active', passengers: 3, route: 'Shillong City' },
      { id: 'MN07EF9012', status: 'maintenance', passengers: 0, route: 'Imphal-Moreh' }
    ];

    return {
      user: { id: userId },
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      totalPassengers: vehicles.reduce((sum, v) => sum + v.passengers, 0),
      vehicles,
      permitStatus: {
        valid: 5,
        expiring: 2,
        expired: 1
      }
    };
  }

  static async getSuperAdminDashboard() {
    const totalAlerts = await EmergencyService.getAlerts({ limit: 1000 });
    const recentTransactions = await BlockchainService.getTransactions({ limit: 100 });
    
    return {
      systemHealth: {
        uptime: '99.8%',
        activeUsers: 1247,
        emergencyAlerts: totalAlerts.length,
        responseTime: '2.3m'
      },
      userDistribution: {
        tourists: 847,
        police: 156,
        transport: 234,
        admins: 10
      },
      regionalActivity: {
        'Assam': 342,
        'Meghalaya': 198,
        'Arunachal Pradesh': 156,
        'Nagaland': 134,
        'Manipur': 123,
        'Tripura': 98,
        'Mizoram': 87,
        'Sikkim': 109
      },
      systemStatus: {
        blockchain: 'operational',
        emergency: 'active',
        geofencing: 'running',
        cultural: 'synced'
      }
    };
  }
}