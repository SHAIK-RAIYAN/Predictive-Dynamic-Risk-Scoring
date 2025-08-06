import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  onValue, 
  off 
} from 'firebase/database';
import { db, realtimeDb, auth } from '../lib/firebase';

// Sample data for demonstration
const sampleUsers = [
  {
    id: 'user_001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Security Analyst',
    department: 'IT Security',
    riskLevel: 'LOW',
    lastActivity: new Date(),
    riskScore: 12.5
  },
  {
    id: 'user_002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'System Administrator',
    department: 'IT Operations',
    riskLevel: 'MEDIUM',
    lastActivity: new Date(),
    riskScore: 28.3
  },
  {
    id: 'user_003',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Database Administrator',
    department: 'Data Management',
    riskLevel: 'HIGH',
    lastActivity: new Date(),
    riskScore: 42.1
  },
  {
    id: 'user_004',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Network Engineer',
    department: 'Network Infrastructure',
    riskLevel: 'LOW',
    lastActivity: new Date(),
    riskScore: 8.7
  },
  {
    id: 'user_005',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'Application Developer',
    department: 'Software Development',
    riskLevel: 'MEDIUM',
    lastActivity: new Date(),
    riskScore: 31.2
  }
];

const sampleRiskEvents = [
  {
    id: 'event_001',
    entityId: 'user_001',
    eventType: 'LOGIN_FAILURE',
    severity: 'MEDIUM',
    description: 'Multiple failed login attempts detected',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    sourceIp: '192.168.1.100',
    location: 'New York, NY',
    riskScore: 15.2
  },
  {
    id: 'event_002',
    entityId: 'user_002',
    eventType: 'PRIVILEGE_ESCALATION',
    severity: 'HIGH',
    description: 'Unauthorized privilege escalation attempt',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    sourceIp: '192.168.1.101',
    location: 'San Francisco, CA',
    riskScore: 38.7
  },
  {
    id: 'event_003',
    entityId: 'user_003',
    eventType: 'LARGE_FILE_TRANSFER',
    severity: 'HIGH',
    description: 'Large file transfer to external location',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    sourceIp: '192.168.1.102',
    location: 'Chicago, IL',
    riskScore: 45.3
  },
  {
    id: 'event_004',
    entityId: 'user_004',
    eventType: 'SUSPICIOUS_ACTIVITY',
    severity: 'LOW',
    description: 'Unusual access pattern detected',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    sourceIp: '192.168.1.103',
    location: 'Boston, MA',
    riskScore: 12.8
  },
  {
    id: 'event_005',
    entityId: 'user_005',
    eventType: 'UNAUTHORIZED_FILE_ACCESS',
    severity: 'MEDIUM',
    description: 'Access to restricted file directory',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    sourceIp: '192.168.1.104',
    location: 'Seattle, WA',
    riskScore: 25.6
  }
];

const sampleAnalytics = [
  {
    id: 'analytics_001',
    date: new Date().toISOString().split('T')[0],
    totalEvents: 156,
    highRiskEvents: 23,
    mediumRiskEvents: 67,
    lowRiskEvents: 66,
    averageRiskScore: 28.4,
    topThreats: ['Privilege Escalation', 'Large File Transfer', 'Login Failures'],
    activeUsers: 45
  }
];

class FirebaseService {
  constructor() {
    this.listeners = new Map();
  }

  // Initialize sample data
  async initializeSampleData() {
    try {
      console.log('Initializing sample data...');
      
      // Add sample users
      for (const user of sampleUsers) {
        await this.createUser(user);
      }

      // Add sample risk events
      for (const event of sampleRiskEvents) {
        await this.createRiskEvent(event);
      }

      // Add sample analytics
      for (const analytics of sampleAnalytics) {
        await this.createAnalytics(analytics);
      }

      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  // User Management
  async createUser(userData) {
    try {
      const userRef = doc(db, 'users', userData.id);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return userData.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      return usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Risk Events Management
  async createRiskEvent(eventData) {
    try {
      const eventRef = doc(db, 'riskEvents', eventData.id);
      await setDoc(eventRef, {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return eventData.id;
    } catch (error) {
      console.error('Error creating risk event:', error);
      throw error;
    }
  }

  async getRiskEvent(eventId) {
    try {
      const eventRef = doc(db, 'riskEvents', eventId);
      const eventSnap = await getDoc(eventRef);
      return eventSnap.exists() ? { id: eventSnap.id, ...eventSnap.data() } : null;
    } catch (error) {
      console.error('Error getting risk event:', error);
      throw error;
    }
  }

  async getAllRiskEvents() {
    try {
      const eventsRef = collection(db, 'riskEvents');
      const eventsSnap = await getDocs(eventsRef);
      return eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all risk events:', error);
      throw error;
    }
  }

  async getRiskEventsByEntity(entityId) {
    try {
      const eventsRef = collection(db, 'riskEvents');
      const q = query(eventsRef, where('entityId', '==', entityId), orderBy('timestamp', 'desc'));
      const eventsSnap = await getDocs(q);
      return eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting risk events by entity:', error);
      throw error;
    }
  }

  async updateRiskEvent(eventId, eventData) {
    try {
      const eventRef = doc(db, 'riskEvents', eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating risk event:', error);
      throw error;
    }
  }

  async deleteRiskEvent(eventId) {
    try {
      const eventRef = doc(db, 'riskEvents', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting risk event:', error);
      throw error;
    }
  }

  // Analytics Management
  async createAnalytics(analyticsData) {
    try {
      const analyticsRef = doc(db, 'analytics', analyticsData.id);
      await setDoc(analyticsRef, {
        ...analyticsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return analyticsData.id;
    } catch (error) {
      console.error('Error creating analytics:', error);
      throw error;
    }
  }

  async getAnalytics(analyticsId) {
    try {
      const analyticsRef = doc(db, 'analytics', analyticsId);
      const analyticsSnap = await getDoc(analyticsRef);
      return analyticsSnap.exists() ? { id: analyticsSnap.id, ...analyticsSnap.data() } : null;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  async getAllAnalytics() {
    try {
      const analyticsRef = collection(db, 'analytics');
      const analyticsSnap = await getDocs(analyticsRef);
      return analyticsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all analytics:', error);
      throw error;
    }
  }

  // Real-time Listeners
  subscribeToUsers(callback) {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(users);
    });
    
    this.listeners.set('users', unsubscribe);
    return unsubscribe;
  }

  subscribeToRiskEvents(callback) {
    const eventsRef = collection(db, 'riskEvents');
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(events);
    });
    
    this.listeners.set('riskEvents', unsubscribe);
    return unsubscribe;
  }

  subscribeToUserRiskEvents(userId, callback) {
    const eventsRef = collection(db, 'riskEvents');
    const q = query(eventsRef, where('entityId', '==', userId), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(events);
    });
    
    this.listeners.set(`userRiskEvents_${userId}`, unsubscribe);
    return unsubscribe;
  }

  subscribeToAnalytics(callback) {
    const analyticsRef = collection(db, 'analytics');
    const unsubscribe = onSnapshot(analyticsRef, (snapshot) => {
      const analytics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(analytics);
    });
    
    this.listeners.set('analytics', unsubscribe);
    return unsubscribe;
  }

  // Real-time Database for live monitoring
  subscribeToLiveMonitoring(callback) {
    const monitoringRef = ref(realtimeDb, 'liveMonitoring');
    const unsubscribe = onValue(monitoringRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    
    this.listeners.set('liveMonitoring', unsubscribe);
    return unsubscribe;
  }

  updateLiveMonitoringStatus(isActive) {
    const monitoringRef = ref(realtimeDb, 'liveMonitoring');
    set(monitoringRef, {
      isActive,
      lastUpdated: new Date().toISOString()
    });
  }

  // Machine Learning Data
  async createMLModel(modelData) {
    try {
      const modelRef = doc(db, 'mlModels', modelData.id);
      await setDoc(modelRef, {
        ...modelData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return modelData.id;
    } catch (error) {
      console.error('Error creating ML model:', error);
      throw error;
    }
  }

  async getMLModel(modelId) {
    try {
      const modelRef = doc(db, 'mlModels', modelId);
      const modelSnap = await getDoc(modelRef);
      return modelSnap.exists() ? { id: modelSnap.id, ...modelSnap.data() } : null;
    } catch (error) {
      console.error('Error getting ML model:', error);
      throw error;
    }
  }

  async getAllMLModels() {
    try {
      const modelsRef = collection(db, 'mlModels');
      const modelsSnap = await getDocs(modelsRef);
      return modelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all ML models:', error);
      throw error;
    }
  }

  // Cleanup listeners
  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }

  unsubscribe(listenerKey) {
    const unsubscribe = this.listeners.get(listenerKey);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerKey);
    }
  }
}

// Create singleton instance
const firebaseService = new FirebaseService();

// Real-time service for dashboard updates
const realTimeService = {
  onDashboardDataChange(callback) {
    const unsubscribers = [];
    
    // Subscribe to users
    const userUnsubscribe = firebaseService.subscribeToUsers((users) => {
      callback({ type: 'entities', data: users });
    });
    unsubscribers.push(userUnsubscribe);
    
    // Subscribe to risk events
    const eventsUnsubscribe = firebaseService.subscribeToRiskEvents((events) => {
      callback({ type: 'events', data: events });
    });
    unsubscribers.push(eventsUnsubscribe);
    
    // Subscribe to analytics
    const analyticsUnsubscribe = firebaseService.subscribeToAnalytics((analytics) => {
      callback({ type: 'analytics', data: analytics });
    });
    unsubscribers.push(analyticsUnsubscribe);
    
    // Subscribe to live monitoring
    const monitoringUnsubscribe = firebaseService.subscribeToLiveMonitoring((monitoring) => {
      callback({ type: 'monitoring', data: monitoring });
    });
    unsubscribers.push(monitoringUnsubscribe);
    
    // Return unsubscribe function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }
};

export { realTimeService };
export default firebaseService;
