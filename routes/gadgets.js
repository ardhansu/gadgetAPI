const express = require('express');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { generateCodename, generateSuccessProbability, generateConfirmationCode } = require('../utils/generators');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createGadgetSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional()
});

const updateGadgetSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('AVAILABLE', 'DEPLOYED', 'DESTROYED').optional()
});

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/gadgets - Retrieve all gadgets
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const gadgets = await prisma.gadget.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Add mission success probability to each gadget
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: `${generateSuccessProbability()}%`
    }));

    res.json({
      message: 'Mission successful: Gadget inventory retrieved',
      count: gadgetsWithProbability.length,
      gadgets: gadgetsWithProbability
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/gadgets/:id - Retrieve specific gadget
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const gadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!gadget) {
      return res.status(404).json({
        error: 'Mission failed: Gadget not found',
        message: 'The requested gadget does not exist in the inventory'
      });
    }

    res.json({
      message: 'Mission successful: Gadget retrieved',
      gadget: {
        ...gadget,
        missionSuccessProbability: `${generateSuccessProbability()}%`
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/gadgets - Add new gadget
router.post('/', authorizeRole('HANDLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { error, value } = createGadgetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Mission failed: Invalid gadget data',
        details: error.details.map(d => d.message)
      });
    }

    const { name, description } = value;

    // Generate unique codename
    let codename;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      codename = generateCodename();
      const existingGadget = await prisma.gadget.findUnique({
        where: { codename }
      });
      
      if (!existingGadget) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        error: 'Mission failed: Unable to generate unique codename',
        message: 'Please try again'
      });
    }

    const gadget = await prisma.gadget.create({
      data: {
        name,
        codename,
        description
      }
    });

    res.status(201).json({
      message: 'Mission successful: Gadget added to inventory',
      gadget: {
        ...gadget,
        missionSuccessProbability: `${generateSuccessProbability()}%`
      }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/gadgets/:id - Update gadget
router.patch('/:id', authorizeRole('HANDLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateGadgetSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Mission failed: Invalid update data',
        details: error.details.map(d => d.message)
      });
    }

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return res.status(404).json({
        error: 'Mission failed: Gadget not found',
        message: 'The requested gadget does not exist in the inventory'
      });
    }

    if (existingGadget.status === 'DECOMMISSIONED') {
      return res.status(400).json({
        error: 'Mission failed: Cannot update decommissioned gadget',
        message: 'This gadget has been decommissioned and cannot be modified'
      });
    }

    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: value
    });

    res.json({
      message: 'Mission successful: Gadget updated',
      gadget: {
        ...updatedGadget,
        missionSuccessProbability: `${generateSuccessProbability()}%`
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/gadgets/:id - Decommission gadget
router.delete('/:id', authorizeRole('HANDLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return res.status(404).json({
        error: 'Mission failed: Gadget not found',
        message: 'The requested gadget does not exist in the inventory'
      });
    }

    if (existingGadget.status === 'DECOMMISSIONED') {
      return res.status(400).json({
        error: 'Mission failed: Gadget already decommissioned',
        message: 'This gadget has already been decommissioned'
      });
    }

    // Soft delete by marking as decommissioned
    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'DECOMMISSIONED',
        decommissionedAt: new Date()
      }
    });

    res.json({
      message: 'Mission successful: Gadget decommissioned',
      gadget: decommissionedGadget
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/gadgets/:id/self-destruct - Trigger self-destruct
router.post('/:id/self-destruct', authorizeRole('HANDLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if gadget exists
    const existingGadget = await prisma.gadget.findUnique({
      where: { id }
    });

    if (!existingGadget) {
      return res.status(404).json({
        error: 'Mission failed: Gadget not found',
        message: 'The requested gadget does not exist in the inventory'
      });
    }

    if (existingGadget.status === 'DECOMMISSIONED') {
      return res.status(400).json({
        error: 'Mission failed: Cannot self-destruct decommissioned gadget',
        message: 'This gadget has already been decommissioned'
      });
    }

    if (existingGadget.status === 'DESTROYED') {
      return res.status(400).json({
        error: 'Mission failed: Gadget already destroyed',
        message: 'This gadget has already been destroyed'
      });
    }

    if (existingGadget.selfDestructActivated) {
      return res.status(400).json({
        error: 'Mission failed: Self-destruct already activated',
        message: 'The self-destruct sequence has already been initiated'
      });
    }

    // Generate confirmation code
    const confirmationCode = generateConfirmationCode();

    // Update gadget to mark self-destruct as activated
    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        selfDestructActivated: true,
        selfDestructAt: new Date(),
        status: 'DESTROYED'
      }
    });

    res.json({
      message: 'Mission successful: Self-destruct sequence activated',
      confirmationCode,
      gadget: updatedGadget,
      warning: 'This gadget will self-destruct in 5 seconds...'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;