const SAFE_ZONES = [
  {
    name: 'Guwahati City Center',
    center: { lat: 26.1445, lng: 91.7362 },
    radius: 5,
    safetyLevel: 'safe'
  },
  {
    name: 'Kaziranga National Park',
    center: { lat: 26.5775, lng: 93.1717 },
    radius: 3,
    safetyLevel: 'caution'
  },
  {
    name: 'Shillong Central',
    center: { lat: 25.5788, lng: 91.8933 },
    radius: 4,
    safetyLevel: 'safe'
  },
  {
    name: 'Tawang Town',
    center: { lat: 27.5886, lng: 91.8597 },
    radius: 2,
    safetyLevel: 'caution'
  }
];

export class GeofencingService {
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static async updateLocation(locationData) {
    const { location } = locationData;
    const currentZone = this.findCurrentZone(location.latitude, location.longitude);
    
    const result = {
      safetyStatus: currentZone ? currentZone.safetyLevel : 'unknown',
      currentZone: currentZone?.name || 'Unknown area',
      alerts: [],
      nearbyAttractions: this.findNearbyAttractions(location.latitude, location.longitude)
    };

    // Generate alerts based on safety level
    if (!currentZone) {
      result.alerts.push({
        type: 'warning',
        message: 'You are in an unmapped area. Exercise caution and stay alert.'
      });
    } else if (currentZone.safetyLevel === 'caution') {
      result.alerts.push({
        type: 'caution',
        message: `You are in ${currentZone.name}. Follow local guidelines and stay with groups.`
      });
    }

    return result;
  }

  static findCurrentZone(latitude, longitude) {
    for (const zone of SAFE_ZONES) {
      const distance = this.calculateDistance(
        latitude, longitude,
        zone.center.lat, zone.center.lng
      );
      
      if (distance <= zone.radius) {
        return zone;
      }
    }
    return null;
  }

  static findNearbyAttractions(latitude, longitude, radius = 50) {
    // Mock nearby attractions based on location
    const attractions = [
      { name: 'Kamakhya Temple', distance: '12 km', type: 'Religious' },
      { name: 'Assam State Museum', distance: '8 km', type: 'Cultural' },
      { name: 'Brahmaputra River Cruise', distance: '5 km', type: 'Adventure' }
    ];

    return attractions;
  }

  static getSafetyZones() {
    return SAFE_ZONES;
  }

  static async checkLocationSafety({ latitude, longitude, userId }) {
    const currentZone = this.findCurrentZone(latitude, longitude);
    
    const safetyCheck = {
      level: currentZone ? currentZone.safetyLevel : 'unknown',
      warnings: [],
      recommendations: [],
      nearbyServices: []
    };

    if (!currentZone) {
      safetyCheck.warnings.push('Location not in mapped safe zones');
      safetyCheck.recommendations.push('Move to nearest safe zone');
    }

    // Add nearby emergency services
    safetyCheck.nearbyServices = [
      { type: 'Police Station', distance: '2.3 km', contact: '100' },
      { type: 'Hospital', distance: '1.8 km', contact: '108' },
      { type: 'Tourist Help Center', distance: '0.9 km', contact: '1363' }
    ];

    return safetyCheck;
  }

  static updateSafetyZones() {
    console.log('🗺️  Updating safety zones...');
    // In production, this would fetch updated zone data
  }

  static async updateLocation(locationData, ws) {
    try {
      const result = await this.updateLocation(locationData);
      
      if (ws) {
        ws.send(JSON.stringify({
          type: 'LOCATION_UPDATE_RESPONSE',
          data: result
        }));
      }

      return result;
    } catch (error) {
      console.error('Location update error:', error);
      throw error;
    }
  }
}