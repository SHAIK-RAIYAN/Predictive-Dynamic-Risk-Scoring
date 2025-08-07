import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  deleteDoc,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhvu9zVtcbaWnq_84rmTdDSpb389oHEN0",
  authDomain: "riskguardai-0123.firebaseapp.com",
  projectId: "riskguardai-0123",
  storageBucket: "riskguardai-0123.firebasestorage.app",
  messagingSenderId: "454935417856",
  appId: "1:454935417856:web:3caed9e15aa182b94ff4e5",
  measurementId: "G-NCFMBLFVMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class FirebaseService {
  constructor() {
    this.db = db;
    this.auth = auth;
    this.initializeData();
  }

  // Initialize development data
  async initializeData() {
    try {
      // Check if data already exists
      const entitiesSnapshot = await getDocs(collection(db, 'entities'));
      if (entitiesSnapshot.empty) {
        await this.createInitialData();
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  // Create initial development data
  async createInitialData() {
    console.log('Creating initial development data...');

    // Create entities
    const entities = [
      {
        id: 'user-john.doe',
        name: 'John Doe',
        type: 'User',
        department: 'Engineering',
        riskScore: 45,
        status: 'High',
        lastActivity: '2 min ago',
        ipAddress: '192.168.1.100',
        email: 'john.doe@company.com',
        createdAt: serverTimestamp()
      },
      {
        id: 'server-prod-01',
        name: 'Production Server 01',
        type: 'Server',
        department: 'Infrastructure',
        riskScore: 38,
        status: 'Medium',
        lastActivity: '5 min ago',
        ipAddress: '10.0.0.50',
        location: 'Data Center A',
        createdAt: serverTimestamp()
      },
      {
        id: 'user-sarah.smith',
        name: 'Sarah Smith',
        type: 'User',
        department: 'Finance',
        riskScore: 42,
        status: 'High',
        lastActivity: '8 min ago',
        ipAddress: '192.168.1.101',
        email: 'sarah.smith@company.com',
        createdAt: serverTimestamp()
      },
      {
        id: 'database-main',
        name: 'Main Database',
        type: 'Database',
        department: 'IT',
        riskScore: 35,
        status: 'Medium',
        lastActivity: '12 min ago',
        ipAddress: '10.0.0.100',
        version: 'PostgreSQL 13',
        createdAt: serverTimestamp()
      },
      {
        id: 'user-mike.wilson',
        name: 'Mike Wilson',
        type: 'User',
        department: 'HR',
        riskScore: 31,
        status: 'Medium',
        lastActivity: '15 min ago',
        ipAddress: '192.168.1.102',
        email: 'mike.wilson@company.com',
        createdAt: serverTimestamp()
      },
      {
        id: 'web-server-01',
        name: 'Web Server 01',
        type: 'Server',
        department: 'Infrastructure',
        riskScore: 22,
        status: 'Low',
        lastActivity: '20 min ago',
        ipAddress: '10.0.0.51',
        location: 'Data Center B',
        createdAt: serverTimestamp()
      },
      {
        id: 'user-lisa.jones',
        name: 'Lisa Jones',
        type: 'User',
        department: 'Marketing',
        riskScore: 18,
        status: 'Low',
        lastActivity: '25 min ago',
        ipAddress: '192.168.1.103',
        email: 'lisa.jones@company.com',
        createdAt: serverTimestamp()
      },
      {
        id: 'backup-server',
        name: 'Backup Server',
        type: 'Server',
        department: 'IT',
        riskScore: 28,
        status: 'Medium',
        lastActivity: '30 min ago',
        ipAddress: '10.0.0.200',
        location: 'Data Center A',
        createdAt: serverTimestamp()
      },
      {
        id: 'user-alex.brown',
        name: 'Alex Brown',
        type: 'User',
        department: 'Sales',
        riskScore: 25,
        status: 'Medium',
        lastActivity: '35 min ago',
        ipAddress: '192.168.1.104',
        email: 'alex.brown@company.com',
        createdAt: serverTimestamp()
      },
      {
        id: 'app-server-02',
        name: 'Application Server 02',
        type: 'Server',
        department: 'Infrastructure',
        riskScore: 33,
        status: 'Medium',
        lastActivity: '40 min ago',
        ipAddress: '10.0.0.52',
        location: 'Data Center B',
        createdAt: serverTimestamp()
      }
    ];

    // Add entities to Firestore
    for (const entity of entities) {
      await addDoc(collection(db, 'entities'), entity);
    }

    // Create risk events
    const riskEvents = [
      {
        entityId: 'user-john.doe',
        eventType: 'LOGIN_FAILURE',
        severity: 'HIGH',
        description: 'Multiple failed login attempts',
        riskScore: 15,
        timestamp: serverTimestamp(),
        ipAddress: '192.168.1.100'
      },
      {
        entityId: 'server-prod-01',
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'MEDIUM',
        description: 'Access attempt to restricted resource',
        riskScore: 12,
        timestamp: serverTimestamp(),
        ipAddress: '10.0.0.50'
      },
      {
        entityId: 'user-sarah.smith',
        eventType: 'LARGE_FILE_TRANSFER',
        severity: 'HIGH',
        description: 'Large file download detected',
        riskScore: 18,
        timestamp: serverTimestamp(),
        ipAddress: '192.168.1.101'
      },
      {
        entityId: 'database-main',
        eventType: 'PRIVILEGE_ESCALATION',
        severity: 'CRITICAL',
        description: 'Database admin access attempt',
        riskScore: 25,
        timestamp: serverTimestamp(),
        ipAddress: '10.0.0.100'
      },
      {
        entityId: 'user-mike.wilson',
        eventType: 'UNUSUAL_ACTIVITY',
        severity: 'MEDIUM',
        description: 'Login outside business hours',
        riskScore: 8,
        timestamp: serverTimestamp(),
        ipAddress: '192.168.1.102'
      }
    ];

    // Add risk events to Firestore
    for (const event of riskEvents) {
      await addDoc(collection(db, 'riskEvents'), event);
    }

    // Create analytics data
    const analyticsData = {
      riskTrends: [
        { month: 'Jan', avgScore: 28, highRisk: 15, mediumRisk: 45, lowRisk: 120 },
        { month: 'Feb', avgScore: 32, highRisk: 18, mediumRisk: 52, lowRisk: 115 },
        { month: 'Mar', avgScore: 35, highRisk: 22, mediumRisk: 58, lowRisk: 110 },
        { month: 'Apr', avgScore: 31, highRisk: 19, mediumRisk: 49, lowRisk: 118 },
        { month: 'May', avgScore: 38, highRisk: 25, mediumRisk: 62, lowRisk: 105 },
        { month: 'Jun', avgScore: 42, highRisk: 30, mediumRisk: 68, lowRisk: 98 }
      ],
      departmentRisk: [
        { department: 'Engineering', avgScore: 35, entities: 45 },
        { department: 'Finance', avgScore: 28, entities: 23 },
        { department: 'IT', avgScore: 42, entities: 38 },
        { department: 'HR', avgScore: 22, entities: 15 },
        { department: 'Marketing', avgScore: 31, entities: 28 }
      ],
      threatTypes: [
        { type: 'Privilege Escalation', count: 45, percentage: 35 },
        { type: 'Data Exfiltration', count: 32, percentage: 25 },
        { type: 'Unauthorized Access', count: 28, percentage: 22 },
        { type: 'Malware Activity', count: 15, percentage: 12 },
        { type: 'Other', count: 8, percentage: 6 }
      ],
      timeAnalysis: [
        { hour: '00:00', incidents: 5, avgScore: 25 },
        { hour: '04:00', incidents: 3, avgScore: 22 },
        { hour: '08:00', incidents: 12, avgScore: 35 },
        { hour: '12:00', incidents: 18, avgScore: 42 },
        { hour: '16:00', incidents: 15, avgScore: 38 },
        { hour: '20:00', incidents: 8, avgScore: 28 }
      ]
    };

    await addDoc(collection(db, 'analytics'), analyticsData);

    console.log('Initial development data created successfully!');
  }

  // Get all entities
  async getEntities() {
    try {
      const querySnapshot = await getDocs(collection(db, 'entities'));
      const entities = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          firestoreId: doc.id, // Keep the Firestore document ID
          id: data.id, // Use the custom ID field
          ...data
        };
      });
      console.log('Retrieved entities from Firebase:', entities);
      return entities;
    } catch (error) {
      console.error('Error getting entities:', error);
      return [];
    }
  }

  // Subscribe to entities changes
  subscribeToEntities(callback) {
    return onSnapshot(collection(db, 'entities'), (snapshot) => {
      const entities = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          firestoreId: doc.id, // Keep the Firestore document ID
          id: data.id, // Use the custom ID field
          ...data
        };
      });
      callback(entities);
    });
  }

  // Get risk events
  async getRiskEvents() {
    try {
      const querySnapshot = await getDocs(collection(db, 'riskEvents'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting risk events:', error);
      return [];
    }
  }

  // Subscribe to risk events changes
  subscribeToRiskEvents(callback) {
    return onSnapshot(collection(db, 'riskEvents'), (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(events);
    });
  }

  // Get analytics data
  async getAnalytics() {
    try {
      const querySnapshot = await getDocs(collection(db, 'analytics'));
      const analytics = querySnapshot.docs[0]?.data();
      return analytics || {};
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {};
    }
  }

  // Subscribe to analytics changes
  subscribeToAnalytics(callback) {
    return onSnapshot(collection(db, 'analytics'), (snapshot) => {
      const analytics = snapshot.docs[0]?.data() || {};
      callback(analytics);
    });
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const entities = await this.getEntities();
      const events = await this.getRiskEvents();
      
      const highRiskEntities = entities.filter(e => e.riskScore >= 40).length;
      const mediumRiskEntities = entities.filter(e => e.riskScore >= 25 && e.riskScore < 40).length;
      const lowRiskEntities = entities.filter(e => e.riskScore < 25).length;
      
      const overallRiskScore = entities.reduce((sum, entity) => sum + entity.riskScore, 0) / entities.length;
      
      return {
        overallRiskScore: Math.round(overallRiskScore * 10) / 10,
        riskTrend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        totalEntities: entities.length,
        highRiskEntities,
        mediumRiskEntities,
        lowRiskEntities,
        recentAlerts: events.filter(e => e.timestamp > Date.now() - 24 * 60 * 60 * 1000).length,
        falsePositives: Math.floor(Math.random() * 5) + 1
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {};
    }
  }

  // Get risk trend data
  async getRiskTrend() {
    try {
      const analytics = await this.getAnalytics();
      return analytics.riskTrends || [];
    } catch (error) {
      console.error('Error getting risk trend:', error);
      return [];
    }
  }

  // Get top risk entities
  async getTopRiskEntities() {
    try {
      const entities = await this.getEntities();
      return entities
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5)
        .map(entity => ({
          id: entity.id,
          name: entity.name,
          department: entity.department,
          riskScore: entity.riskScore,
          status: entity.status,
          lastActivity: entity.lastActivity
        }));
    } catch (error) {
      console.error('Error getting top risk entities:', error);
      return [];
    }
  }

  // Assess entity risk
  async assessEntityRisk(entityId) {
    try {
      const entities = await this.getEntities();
      console.log('Firebase entities:', entities);
      console.log('Looking for entity ID:', entityId);
      
      const entity = entities.find(e => e.id === entityId);
      console.log('Found entity:', entity);
      
      if (!entity) {
        throw new Error('Entity not found');
      }

      // Generate dynamic risk factors based on entity
      const factors = [
        {
          id: 1,
          name: 'Unusual Login Time',
          weight: 0.15,
          score: Math.floor(Math.random() * 10) + 5,
          description: 'Login outside normal business hours'
        },
        {
          id: 2,
          name: 'Large File Transfer',
          weight: 0.25,
          score: Math.floor(Math.random() * 12) + 8,
          description: 'Transfer of files > 100MB'
        },
        {
          id: 3,
          name: 'Failed Authentication',
          weight: 0.20,
          score: Math.floor(Math.random() * 8) + 3,
          description: 'Multiple failed login attempts'
        },
        {
          id: 4,
          name: 'Privilege Escalation',
          weight: 0.30,
          score: Math.floor(Math.random() * 15) + 10,
          description: 'Access to restricted resources'
        },
        {
          id: 5,
          name: 'Network Anomaly',
          weight: 0.10,
          score: Math.floor(Math.random() * 6) + 2,
          description: 'Unusual network traffic patterns'
        }
      ];

      const history = [
        {
          timestamp: '2024-01-15 14:30',
          event: 'Login from new IP',
          score: Math.floor(Math.random() * 8) + 3
        },
        {
          timestamp: '2024-01-15 15:45',
          event: 'Large file download',
          score: Math.floor(Math.random() * 12) + 8
        },
        {
          timestamp: '2024-01-15 16:20',
          event: 'Access to admin panel',
          score: Math.floor(Math.random() * 10) + 5
        },
        {
          timestamp: '2024-01-15 17:10',
          event: 'Failed login attempt',
          score: Math.floor(Math.random() * 5) + 2
        },
        {
          timestamp: '2024-01-15 18:00',
          event: 'Database query execution',
          score: Math.floor(Math.random() * 8) + 4
        }
      ];

      const recommendations = [
        'Review recent login patterns',
        'Monitor file transfer activities',
        'Implement additional authentication for admin access',
        'Enable enhanced logging for this entity'
      ];

      return {
        entityId: entity.id,
        entityName: entity.name,
        entityType: entity.type,
        entityDepartment: entity.department,
        entityEmail: entity.email,
        entityIP: entity.ipAddress,
        overallScore: entity.riskScore,
        riskLevel: this.getRiskLevel(entity.riskScore),
        factors,
        history,
        recommendations
      };
    } catch (error) {
      console.error('Error assessing entity risk:', error);
      throw error;
    }
  }

  // Get risk level
  getRiskLevel(score) {
    if (score >= 40) return 'Critical';
    if (score >= 30) return 'High';
    if (score >= 20) return 'Medium';
    return 'Low';
  }

  // Add new entity
  async addEntity(entityData) {
    try {
      const docRef = await addDoc(collection(db, 'entities'), {
        ...entityData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding entity:', error);
      throw error;
    }
  }

  // Update entity
  async updateEntity(entityId, updateData) {
    try {
      // Find the entity by custom ID to get the Firestore document ID
      const entities = await this.getEntities();
      const entity = entities.find(e => e.id === entityId);
      
      if (!entity) {
        throw new Error('Entity not found');
      }
      
      const entityRef = doc(db, 'entities', entity.firestoreId);
      await updateDoc(entityRef, updateData);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }

  // Delete entity
  async deleteEntity(entityId) {
    try {
      // Find the entity by custom ID to get the Firestore document ID
      const entities = await this.getEntities();
      const entity = entities.find(e => e.id === entityId);
      
      if (!entity) {
        throw new Error('Entity not found');
      }
      
      const entityRef = doc(db, 'entities', entity.firestoreId);
      await deleteDoc(entityRef);
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
}

// Create singleton instance
const firebaseService = new FirebaseService();

// Real-time service for dashboard updates
const realTimeService = {
  onDashboardDataChange(callback) {
    const unsubscribers = [];
    
    // Subscribe to entities
    const userUnsubscribe = firebaseService.subscribeToEntities((users) => {
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
    
    // Return unsubscribe function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }
};

export default firebaseService;
export { realTimeService };
