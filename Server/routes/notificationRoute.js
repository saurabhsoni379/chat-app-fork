const router = require('express').Router();
const { 
    getNotifications, 
    updateNotificationStatus, 
    deleteNotification
} = require('../controllers/notificationController');

router.get('/:userId', getNotifications);
router.patch('/:notificationId', updateNotificationStatus);
router.delete('/:notificationId', deleteNotification);

module.exports = router; 