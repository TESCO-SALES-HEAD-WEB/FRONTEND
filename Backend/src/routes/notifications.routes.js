const router = require('express').Router();
const Notification = require('../models/Notification');
const { syncNotifications } = require('../services/notificationSync');

// This app only ever shows Sales Head notifications from the shared collection.
const SCOPE = { recipientRole: 'Sales Head' };

// GET /api/notifications — newest-first list (limit 50) + computed unreadCount.
// Syncs from the real shared collections first so the list reflects current DB state.
router.get('/', async (req, res) => {
  try {
    await syncNotifications();
    const [notifications, unreadCount] = await Promise.all([
      Notification.find(SCOPE).sort({ eventAt: -1, createdAt: -1 }).limit(50).lean(),
      Notification.countDocuments({ ...SCOPE, isRead: false })
    ]);
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notifications/unread-count — just the badge number.
router.get('/unread-count', async (req, res) => {
  try {
    await syncNotifications();
    const unreadCount = await Notification.countDocuments({ ...SCOPE, isRead: false });
    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notifications/:id/read — mark one notification read.
router.patch('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/notifications/read-all — mark all unread notifications read.
router.patch('/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { ...SCOPE, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    res.json({ success: true, updated: result.modifiedCount || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
