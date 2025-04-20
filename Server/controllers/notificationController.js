const mongoose = require('mongoose');
const Notification = require('../model/notificationModel');

// Get all notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const notifications = await Notification.find({ user: userId })
            .populate('fromUser', 'username email avatarImage')
            .sort({ createdAt: -1 });
        
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update notification status
const updateNotificationStatus = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { status } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID" });
        }
        
        // Validate status
        const validStatuses = ['pending', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { status },
            { new: true }
        );
        
        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        return res.status(200).json(updatedNotification);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID" });
        }
        
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);
        
        if (!deletedNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotifications,
    updateNotificationStatus,
    deleteNotification
}; 