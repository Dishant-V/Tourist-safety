import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// In-memory blockchain simulation
let blockchainTransactions = [];

export class BlockchainService {
  static generateHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  static async verifyId(blockchainId) {
    // Simulate blockchain ID verification
    const isValid = blockchainId.startsWith('BLK-NE-') && blockchainId.length > 10;
    
    return {
      valid: isValid,
      details: {
        format: isValid ? 'valid' : 'invalid',
        network: 'NE-Tourist-Safety-Chain',
        timestamp: new Date().toISOString()
      }
    };
  }

  static async createTransaction(transactionData) {
    const transaction = {
      id: uuidv4(),
      ...transactionData,
      hash: this.generateHash(transactionData),
      blockNumber: blockchainTransactions.length + 1,
      confirmations: 0,
      status: 'pending'
    };

    blockchainTransactions.push(transaction);

    // Simulate blockchain confirmation
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.confirmations = 6;
    }, 2000);

    return transaction;
  }

  static async getTransactions(filters = {}) {
    let filteredTransactions = [...blockchainTransactions];

    if (filters.userId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.userId === filters.userId);
    }

    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === filters.type);
    }

    return filteredTransactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, filters.limit || 20);
  }

  static syncDailyTransactions() {
    console.log('🔗 Syncing blockchain transactions...');
    // In production, this would sync with actual blockchain network
  }
}