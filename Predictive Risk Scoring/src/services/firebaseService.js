import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Collections
const COLLECTIONS = {
  RISK_ASSESSMENTS: 'risk_assessments',
  ENTITIES: 'entities',
  RISK_EVENTS: 'risk_events',
  USERS: 'users',
  NOTIFICATIONS: 'notifications'
};

// Risk Assessment Services
export const riskAssessmentService = {
  // Create a new risk assessment
  async create(assessmentData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.RISK_ASSESSMENTS), {
        ...assessmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...assessmentData };
    } catch (error) {
      console.error('Error creating risk assessment:', error);
      throw error;
    }
  },

  // Get all risk assessments for a user
  async getByUserId(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.RISK_ASSESSMENTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching risk assessments:', error);
      throw error;
    }
  },

  // Get a specific risk assessment
  async getById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.RISK_ASSESSMENTS, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
      throw error;
    }
  },

  // Update a risk assessment
  async update(id, updateData) {
    try {
      const docRef = doc(db, COLLECTIONS.RISK_ASSESSMENTS, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating risk assessment:', error);
      throw error;
    }
  },

  // Delete a risk assessment
  async delete(id) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.RISK_ASSESSMENTS, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting risk assessment:', error);
      throw error;
    }
  }
};

// Entity Services
export const entityService = {
  // Create a new entity
  async create(entityData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ENTITIES), {
        ...entityData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...entityData };
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  },

  // Get all entities
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.ENTITIES));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  },

  // Get entities with high risk scores
  async getHighRisk() {
    try {
      const q = query(
        collection(db, COLLECTIONS.ENTITIES),
        where('riskScore', '>=', 30),
        orderBy('riskScore', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching high risk entities:', error);
      throw error;
    }
  },

  // Update entity risk score
  async updateRiskScore(id, riskScore) {
    try {
      const docRef = doc(db, COLLECTIONS.ENTITIES, id);
      await updateDoc(docRef, {
        riskScore,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating entity risk score:', error);
      throw error;
    }
  }
};

// Risk Events Services
export const riskEventService = {
  // Create a new risk event
  async create(eventData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.RISK_EVENTS), {
        ...eventData,
        timestamp: serverTimestamp()
      });
      return { id: docRef.id, ...eventData };
    } catch (error) {
      console.error('Error creating risk event:', error);
      throw error;
    }
  },

  // Get recent risk events
  async getRecent(limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.RISK_EVENTS),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching recent risk events:', error);
      throw error;
    }
  },

  // Get risk events for a specific entity
  async getByEntityId(entityId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.RISK_EVENTS),
        where('entityId', '==', entityId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching entity risk events:', error);
      throw error;
    }
  }
};

// Real-time listeners
export const realTimeService = {
  // Listen to dashboard data changes
  onDashboardDataChange(callback) {
    const unsubscribeFunctions = [];

    // Listen to high risk entities
    const entitiesUnsubscribe = onSnapshot(
      query(
        collection(db, COLLECTIONS.ENTITIES),
        where('riskScore', '>=', 30),
        orderBy('riskScore', 'desc'),
        limit(5)
      ),
      (snapshot) => {
        const entities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback({ type: 'entities', data: entities });
      }
    );

    // Listen to recent risk events
    const eventsUnsubscribe = onSnapshot(
      query(
        collection(db, COLLECTIONS.RISK_EVENTS),
        orderBy('timestamp', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback({ type: 'events', data: events });
      }
    );

    unsubscribeFunctions.push(entitiesUnsubscribe, eventsUnsubscribe);

    // Return unsubscribe function
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }
};

// User Services
export const userService = {
  // Create or update user profile
  async createOrUpdate(userId, userData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { id: userId, ...userData };
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, COLLECTIONS.USERS), {
          id: userId,
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { id: userId, ...userData };
      } catch (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }
    }
  },

  // Get user profile
  async getById(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};

export default {
  riskAssessmentService,
  entityService,
  riskEventService,
  realTimeService,
  userService
};
