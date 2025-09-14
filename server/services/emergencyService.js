import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (use database in production)
let emergencyAlerts = [];

export class EmergencyService {
  static async createAlert(alertData) {
    const alert = {
      ...alertData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    emergencyAlerts.push(alert);

    // Simulate emergency response dispatch
    console.log(`🚨 EMERGENCY ALERT: ${alert.type} at ${alert.location.latitude}, ${alert.location.longitude}`);
    
    // In production, this would trigger real emergency services
    setTimeout(() => {
      this.simulateResponse(alert.id);
    }, 3000);

    return alert;
  }

  static async getAlerts(filters = {}) {
    let filteredAlerts = [...emergencyAlerts];

    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
    }

    if (filters.priority) {
      filteredAlerts = filteredAlerts.filter(alert => alert.priority === filters.priority);
    }

    return filteredAlerts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, filters.limit || 50);
  }

  static async updateAlert(alertId, updateData) {
    const alertIndex = emergencyAlerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex === -1) {
      throw new Error('Alert not found');
    }

    emergencyAlerts[alertIndex] = {
      ...emergencyAlerts[alertIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return emergencyAlerts[alertIndex];
  }

  static async simulateResponse(alertId) {
    const alert = emergencyAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'responding';
      alert.responseTime = new Date().toISOString();
      console.log(`📡 Emergency response dispatched for alert ${alertId}`);
    }
  }

  static async handleEmergencyAlert(data, ws) {
    try {
      const alert = await this.createAlert(data);
      
      // Broadcast to all connected emergency services
      ws.send(JSON.stringify({
        type: 'EMERGENCY_ALERT_CREATED',
        alert
      }));

      return alert;
    } catch (error) {
      console.error('Emergency alert handling error:', error);
      throw error;
    }
  }
}