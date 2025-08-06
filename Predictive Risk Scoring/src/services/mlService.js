// Machine Learning Service for Risk Scoring
// Implements Isolation Forest and Random Forest algorithms

class IsolationForest {
  constructor(nEstimators = 100, maxSamples = 256, contamination = 0.1) {
    this.nEstimators = nEstimators;
    this.maxSamples = maxSamples;
    this.contamination = contamination;
    this.trees = [];
    this.isFitted = false;
  }

  // Fit the model with training data
  fit(X) {
    this.trees = [];
    const nSamples = X.length;
    const sampleSize = Math.min(this.maxSamples, nSamples);

    // Create isolation trees
    for (let i = 0; i < this.nEstimators; i++) {
      const tree = new IsolationTree(sampleSize);
      const sampleIndices = this.getRandomSampleIndices(nSamples, sampleSize);
      const sampleData = sampleIndices.map(idx => X[idx]);
      tree.fit(sampleData);
      this.trees.push(tree);
    }

    this.isFitted = true;
  }

  // Predict anomaly scores
  predict(X) {
    if (!this.isFitted) {
      throw new Error('Model must be fitted before prediction');
    }

    if (Array.isArray(X[0])) {
      // Multiple samples
      return X.map(sample => this.predictSingle(sample));
    } else {
      // Single sample
      return this.predictSingle(X);
    }
  }

  predictSingle(sample) {
    const pathLengths = this.trees.map(tree => tree.getPathLength(sample));
    const avgPathLength = pathLengths.reduce((sum, length) => sum + length, 0) / this.trees.length;
    
    // Convert to anomaly score
    const expectedPathLength = this.getExpectedPathLength(sample.length);
    return Math.exp(-avgPathLength / expectedPathLength);
  }

  getRandomSampleIndices(nSamples, sampleSize) {
    const indices = [];
    while (indices.length < sampleSize) {
      const idx = Math.floor(Math.random() * nSamples);
      if (!indices.includes(idx)) {
        indices.push(idx);
      }
    }
    return indices;
  }

  getExpectedPathLength(n) {
    if (n <= 1) return 0;
    if (n == 2) return 1;
    return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n;
  }
}

class IsolationTree {
  constructor(maxSamples) {
    this.maxSamples = maxSamples;
    this.root = null;
  }

  fit(X) {
    this.root = this.buildTree(X, 0);
  }

  buildTree(X, depth) {
    const nSamples = X.length;
    
    // Stop conditions
    if (nSamples <= 1 || depth >= Math.log2(this.maxSamples)) {
      return { type: 'leaf', size: nSamples };
    }

    // Select random feature and split value
    const nFeatures = X[0].length;
    const featureIdx = Math.floor(Math.random() * nFeatures);
    
    const featureValues = X.map(sample => sample[featureIdx]);
    const minVal = Math.min(...featureValues);
    const maxVal = Math.max(...featureValues);
    const splitValue = minVal + Math.random() * (maxVal - minVal);

    // Split data
    const leftData = X.filter(sample => sample[featureIdx] < splitValue);
    const rightData = X.filter(sample => sample[featureIdx] >= splitValue);

    return {
      type: 'node',
      featureIdx,
      splitValue,
      left: this.buildTree(leftData, depth + 1),
      right: this.buildTree(rightData, depth + 1)
    };
  }

  getPathLength(sample) {
    return this.traverseTree(sample, this.root, 0);
  }

  traverseTree(sample, node, depth) {
    if (node.type === 'leaf') {
      return depth + this.getC(node.size);
    }

    const featureValue = sample[node.featureIdx];
    const nextNode = featureValue < node.splitValue ? node.left : node.right;
    return this.traverseTree(sample, nextNode, depth + 1);
  }

  getC(n) {
    if (n <= 1) return 0;
    if (n == 2) return 1;
    return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n;
  }
}

class RandomForest {
  constructor(nEstimators = 100, maxDepth = 10, minSamplesSplit = 2) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.trees = [];
    this.isFitted = false;
  }

  fit(X, y) {
    this.trees = [];
    const nSamples = X.length;

    for (let i = 0; i < this.nEstimators; i++) {
      const tree = new DecisionTree(this.maxDepth, this.minSamplesSplit);
      
      // Bootstrap sample
      const sampleIndices = this.getBootstrapSample(nSamples);
      const sampleX = sampleIndices.map(idx => X[idx]);
      const sampleY = sampleIndices.map(idx => y[idx]);
      
      tree.fit(sampleX, sampleY);
      this.trees.push(tree);
    }

    this.isFitted = true;
  }

  predict(X) {
    if (!this.isFitted) {
      throw new Error('Model must be fitted before prediction');
    }

    if (Array.isArray(X[0])) {
      return X.map(sample => this.predictSingle(sample));
    } else {
      return this.predictSingle(X);
    }
  }

  predictSingle(sample) {
    const predictions = this.trees.map(tree => tree.predict(sample));
    
    // For regression, return average
    if (typeof predictions[0] === 'number') {
      return predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;
    }
    
    // For classification, return most common prediction
    const counts = {};
    predictions.forEach(pred => {
      counts[pred] = (counts[pred] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  getBootstrapSample(nSamples) {
    const indices = [];
    for (let i = 0; i < nSamples; i++) {
      indices.push(Math.floor(Math.random() * nSamples));
    }
    return indices;
  }
}

class DecisionTree {
  constructor(maxDepth, minSamplesSplit) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.root = null;
  }

  fit(X, y) {
    this.root = this.buildTree(X, y, 0);
  }

  buildTree(X, y, depth) {
    const nSamples = X.length;
    const uniqueClasses = [...new Set(y)];
    
    // Stop conditions
    if (depth >= this.maxDepth || nSamples < this.minSamplesSplit || uniqueClasses.length === 1) {
      return { type: 'leaf', prediction: this.getMajorityClass(y) };
    }

    // Find best split
    const bestSplit = this.findBestSplit(X, y);
    
    if (!bestSplit) {
      return { type: 'leaf', prediction: this.getMajorityClass(y) };
    }

    // Split data
    const leftIndices = [];
    const rightIndices = [];
    
    for (let i = 0; i < nSamples; i++) {
      if (X[i][bestSplit.featureIdx] < bestSplit.threshold) {
        leftIndices.push(i);
      } else {
        rightIndices.push(i);
      }
    }

    const leftX = leftIndices.map(idx => X[idx]);
    const leftY = leftIndices.map(idx => y[idx]);
    const rightX = rightIndices.map(idx => X[idx]);
    const rightY = rightIndices.map(idx => y[idx]);

    return {
      type: 'node',
      featureIdx: bestSplit.featureIdx,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1)
    };
  }

  findBestSplit(X, y) {
    const nSamples = X.length;
    const nFeatures = X[0].length;
    let bestGini = Infinity;
    let bestSplit = null;

    for (let featureIdx = 0; featureIdx < nFeatures; featureIdx++) {
      const featureValues = X.map(sample => sample[featureIdx]);
      const uniqueValues = [...new Set(featureValues)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        const leftY = [];
        const rightY = [];
        
        for (let j = 0; j < nSamples; j++) {
          if (X[j][featureIdx] < threshold) {
            leftY.push(y[j]);
          } else {
            rightY.push(y[j]);
          }
        }

        if (leftY.length === 0 || rightY.length === 0) continue;

        const gini = this.calculateGiniImpurity(leftY, rightY);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestSplit = { featureIdx, threshold };
        }
      }
    }

    return bestSplit;
  }

  calculateGiniImpurity(leftY, rightY) {
    const leftGini = this.gini(leftY);
    const rightGini = this.gini(rightY);
    const leftWeight = leftY.length / (leftY.length + rightY.length);
    const rightWeight = rightY.length / (leftY.length + rightY.length);
    
    return leftWeight * leftGini + rightWeight * rightGini;
  }

  gini(y) {
    const counts = {};
    y.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
    
    let gini = 1;
    const n = y.length;
    
    Object.values(counts).forEach(count => {
      gini -= Math.pow(count / n, 2);
    });
    
    return gini;
  }

  getMajorityClass(y) {
    const counts = {};
    y.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  predict(sample) {
    return this.traverseTree(sample, this.root);
  }

  traverseTree(sample, node) {
    if (node.type === 'leaf') {
      return node.prediction;
    }

    const featureValue = sample[node.featureIdx];
    const nextNode = featureValue < node.threshold ? node.left : node.right;
    return this.traverseTree(sample, nextNode);
  }
}

// Feature extraction utilities
class FeatureExtractor {
  static extractFeatures(entity, events) {
    const features = [];

    // Entity-based features
    features.push(entity.riskScore || 0);
    features.push(this.getEntityAgeInDays(entity));
    features.push(this.getEntityActivityScore(entity));

    // Event-based features
    features.push(this.getEventCount(events, 'LOGIN_FAILURE'));
    features.push(this.getEventCount(events, 'PRIVILEGE_ESCALATION'));
    features.push(this.getEventCount(events, 'LARGE_FILE_TRANSFER'));
    features.push(this.getEventCount(events, 'UNAUTHORIZED_FILE_ACCESS'));
    features.push(this.getEventCount(events, 'SUSPICIOUS_ACTIVITY'));

    // Time-based features
    features.push(this.getRecentActivityScore(events));
    features.push(this.getAfterHoursActivityScore(events));
    features.push(this.getWeekendActivityScore(events));

    // Severity-based features
    features.push(this.getHighSeverityEventCount(events));
    features.push(this.getAverageEventSeverity(events));

    // Network features
    features.push(this.getUniqueIpCount(events));
    features.push(this.getPortScanAttempts(events));

    // File system features
    features.push(this.getLargeFileTransferCount(events));
    features.push(this.getTotalDataTransferred(events));

    return features;
  }

  static getEntityAgeInDays(entity) {
    if (!entity.createdAt) return 0;
    const createdAt = new Date(entity.createdAt);
    const now = new Date();
    return Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  }

  static getEntityActivityScore(entity) {
    if (!entity.lastActivity) return 0;
    const lastActivity = new Date(entity.lastActivity);
    const now = new Date();
    const hoursSinceLastActivity = (now - lastActivity) / (1000 * 60 * 60);
    return Math.max(0, 24 - hoursSinceLastActivity);
  }

  static getEventCount(events, eventType) {
    return events.filter(event => event.eventType === eventType).length;
  }

  static getRecentActivityScore(events) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return events.filter(event => new Date(event.timestamp) > oneHourAgo).length;
  }

  static getAfterHoursActivityScore(events) {
    return events.filter(event => {
      const hour = new Date(event.timestamp).getHours();
      return hour < 6 || hour > 22;
    }).length;
  }

  static getWeekendActivityScore(events) {
    return events.filter(event => {
      const day = new Date(event.timestamp).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    }).length;
  }

  static getHighSeverityEventCount(events) {
    return events.filter(event => event.severity === 'HIGH').length;
  }

  static getAverageEventSeverity(events) {
    if (events.length === 0) return 0;
    const severityMap = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
    const totalSeverity = events.reduce((sum, event) => sum + (severityMap[event.severity] || 0), 0);
    return totalSeverity / events.length;
  }

  static getUniqueIpCount(events) {
    const uniqueIps = new Set(events.map(event => event.sourceIp).filter(ip => ip));
    return uniqueIps.size;
  }

  static getPortScanAttempts(events) {
    return events.filter(event => event.eventType === 'PORT_SCAN').length;
  }

  static getLargeFileTransferCount(events) {
    return events.filter(event => event.eventType === 'LARGE_FILE_TRANSFER').length;
  }

  static getTotalDataTransferred(events) {
    return events
      .filter(event => event.fileSize)
      .reduce((sum, event) => sum + (event.fileSize || 0), 0) / (1024 * 1024); // Convert to MB
  }
}

// Main ML Service
class MLService {
  constructor() {
    this.isolationForest = new IsolationForest(100, 256, 0.1);
    this.randomForest = new RandomForest(50, 10, 2);
    this.isFitted = false;
  }

  // Train models with sample data
  async trainModels(entities, events) {
    try {
      console.log('Training ML models...');
      
      // Prepare training data
      const trainingData = [];
      const labels = [];

      for (const entity of entities) {
        const entityEvents = events.filter(event => event.entityId === entity.id);
        const features = FeatureExtractor.extractFeatures(entity, entityEvents);
        
        trainingData.push(features);
        
        // Create risk level labels
        let riskLevel;
        if (entity.riskScore < 15) riskLevel = 'LOW';
        else if (entity.riskScore < 30) riskLevel = 'MEDIUM';
        else riskLevel = 'HIGH';
        
        labels.push(riskLevel);
      }

      // Train Isolation Forest for anomaly detection
      this.isolationForest.fit(trainingData);
      
      // Train Random Forest for risk level classification
      this.randomForest.fit(trainingData, labels);
      
      this.isFitted = true;
      console.log('ML models trained successfully');
      
    } catch (error) {
      console.error('Error training ML models:', error);
      throw error;
    }
  }

  // Calculate risk score for an entity
  calculateRiskScore(entity, events) {
    if (!this.isFitted) {
      console.warn('Models not fitted, using default risk calculation');
      return this.calculateDefaultRiskScore(entity, events);
    }

    try {
      const features = FeatureExtractor.extractFeatures(entity, events);
      
      // Get anomaly score from Isolation Forest
      const anomalyScore = this.isolationForest.predict(features);
      
      // Get risk level prediction from Random Forest
      const riskLevel = this.randomForest.predict(features);
      
      // Convert anomaly score to risk score (0-50 range)
      const baseRiskScore = this.convertAnomalyScoreToRiskScore(anomalyScore);
      
      // Apply rule-based adjustments
      const adjustedRiskScore = this.applyRuleBasedAdjustments(baseRiskScore, entity, events);
      
      // Ensure score is within bounds
      return Math.max(5.0, Math.min(50.0, adjustedRiskScore));
      
    } catch (error) {
      console.error('Error calculating risk score:', error);
      return this.calculateDefaultRiskScore(entity, events);
    }
  }

  convertAnomalyScoreToRiskScore(anomalyScore) {
    // Isolation Forest returns lower scores for anomalies
    // We invert and scale to our risk score range
    const normalizedScore = 1.0 - anomalyScore;
    return 5.0 + (normalizedScore * 45.0);
  }

  applyRuleBasedAdjustments(baseScore, entity, events) {
    let adjustedScore = baseScore;

    // Rule 1: Recent high-severity events
    const recentHighSeverityEvents = events.filter(event => 
      event.severity === 'HIGH' && 
      new Date(event.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    adjustedScore += recentHighSeverityEvents * 5.0;

    // Rule 2: After-hours activity
    const afterHoursEvents = events.filter(event => {
      const hour = new Date(event.timestamp).getHours();
      return hour < 6 || hour > 22;
    }).length;
    if (afterHoursEvents > 0) {
      adjustedScore += 3.0;
    }

    // Rule 3: Multiple failed logins
    const failedLogins = events.filter(event => event.eventType === 'LOGIN_FAILURE').length;
    if (failedLogins > 3) {
      adjustedScore += failedLogins * 2.0;
    }

    // Rule 4: Large file transfers
    const largeTransfers = events.filter(event => event.eventType === 'LARGE_FILE_TRANSFER').length;
    adjustedScore += largeTransfers * 4.0;

    // Rule 5: Privilege escalation attempts
    const privilegeEscalations = events.filter(event => event.eventType === 'PRIVILEGE_ESCALATION').length;
    adjustedScore += privilegeEscalations * 8.0;

    return adjustedScore;
  }

  calculateDefaultRiskScore(entity, events) {
    let score = entity.riskScore || 15.0;
    
    // Simple adjustments based on recent events
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    score += recentEvents.length * 2.0;
    
    const highSeverityEvents = recentEvents.filter(event => event.severity === 'HIGH').length;
    score += highSeverityEvents * 5.0;
    
    return Math.max(5.0, Math.min(50.0, score));
  }

  // Get model performance metrics
  getModelInfo() {
    return {
      isFitted: this.isFitted,
      isolationForest: {
        nEstimators: this.isolationForest.nEstimators,
        maxSamples: this.isolationForest.maxSamples,
        contamination: this.isolationForest.contamination
      },
      randomForest: {
        nEstimators: this.randomForest.nEstimators,
        maxDepth: this.randomForest.maxDepth,
        minSamplesSplit: this.randomForest.minSamplesSplit
      }
    };
  }

  // Initialize models with sample data
  async initializeModels() {
    try {
      console.log('Initializing ML models with sample data...');
      
      // Get sample data from Firebase
      const users = await firebaseService.getAllUsers();
      const events = await firebaseService.getAllRiskEvents();
      
      if (users.length > 0 && events.length > 0) {
        await this.trainModels(users, events);
        console.log('ML models initialized successfully');
      } else {
        console.log('No sample data available for ML model training');
      }
    } catch (error) {
      console.error('Error initializing ML models:', error);
    }
  }
}

// Create singleton instance
const mlService = new MLService();

export default mlService; 