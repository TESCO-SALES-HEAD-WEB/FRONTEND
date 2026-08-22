const express = require('express');
const router = express.Router();
const loginRoutes = require('./login');
const leadRoutes = require('./lead.routes');
const appointmentRoutes = require('./appointment.routes');
const quotationRoutes = require('./quotation.routes');
const projectRoutes = require('./project.routes');
const paymentRoutes = require('./payment.routes');
const userRoutes = require('./users.routes');
const notificationRoutes = require('./notifications.routes');

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
router.use('/auth', loginRoutes);
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/quotations', quotationRoutes);
router.use('/projects', projectRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
