import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { BlockchainService } from '../services/blockchainService.js';

const router = express.Router();

// Verify blockchain ID
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { blockchainId } = req.body;

    if (!blockchainId) {
      return res.status(400).json({ error: 'Blockchain ID required' });
    }

    const verification = await BlockchainService.verifyId(blockchainId);

    res.json({
      valid: verification.valid,
      details: verification.details,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Blockchain verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Create transaction
router.post('/transaction', authenticateToken, async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ 
        error: 'Missing required fields: type, data' 
      });
    }

    const transaction = await BlockchainService.createTransaction({
      userId: req.user.id,
      blockchainId: req.user.blockchainId,
      type,
      data,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, type } = req.query;

    const transactions = await BlockchainService.getTransactions({
      userId: req.user.id,
      limit: parseInt(limit),
      type
    });

    res.json({
      transactions,
      total: transactions.length
    });

  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

export default router;