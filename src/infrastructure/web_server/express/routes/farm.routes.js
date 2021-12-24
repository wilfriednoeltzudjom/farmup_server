const express = require('express');

const bandRoutes = require('./band.routes');
const supplierRoutes = require('./supplier.routes');
const customerRoutes = require('./customer.routes');

const router = express.Router();

router.use('/:farmId/bands', bandRoutes);
router.use('/:farmId/suppliers', supplierRoutes);
router.use('/:farmId/customers', customerRoutes);

module.exports = router;
