const mongoose = require('mongoose');
const Contact = require("../model/contactModel");
const User = require("../model/userModel");
const Notification = require("../model/notificationModel");

// Add a new contact (send a contact request)
const addContact = async (req, res) => {
    try {
        const { userId, contactId } = req.body;

        // Check if contact exists
        const contactUser = await User.findById(contactId);
        if (!contactUser) {
            return res.status(404).json({ message: "Contact user not found" });
        }

        // Check if contact already exists
        const existingContact = await Contact.findOne({
            user: userId,
            contact: contactId
        });

        if (existingContact) {
            return res.status(400).json({ message: "Contact already exists" });
        }

        // Create new contact as pending
        const newContact = await Contact.create({
            user: userId,
            contact: contactId,
            status: 'pending'
        });

        // Create the reciprocal contact relation as pending
        await Contact.create({
            user: contactId,
            contact: userId,
            status: 'pending'
        });

        // Create a notification for the contact request
        await Notification.create({
            user: contactId,
            fromUser: userId,
            type: 'contactRequest',
            status: 'pending'
        });

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all contacts for a user (only accepted contacts)
const getContacts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        console.log('Fetching contacts for user:', userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });    
        }

        const objectId = new mongoose.Types.ObjectId(userId);

        // Only return contacts with 'accepted' status
        const contacts = await Contact.find({ 
            user: objectId,
            status: 'accepted'
        }).populate('contact', 'username email avatarImage');
        
        console.log('Contacts found:', contacts);

        return res.json(contacts.map(contact => contact.contact));
    } catch (ex) {
        console.error('Error fetching contacts:', ex);
        next(ex);
    }
};

// Remove a contact
const removeContact = async (req, res) => {
    try {
        const { userId, contactId } = req.params;

        // Delete both sides of the contact relationship
        await Contact.findOneAndDelete({
            user: userId,
            contact: contactId
        });

        await Contact.findOneAndDelete({
            user: contactId,
            contact: userId
        });

        // Delete any pending notifications
        await Notification.deleteMany({
            user: contactId,
            fromUser: userId,
            type: 'contactRequest'
        });

        res.status(200).json({ message: "Contact removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update contact status (accept/reject)
const updateContactStatus = async (req, res) => {
    try {
        const { userId, contactId } = req.params;
        const { status, notificationId } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ message: "Invalid userId or contactId" });
        }

        // Validate status
        const validStatuses = ['pending', 'accepted', 'blocked'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Update both contact relationships
        const updatedContact = await Contact.findOneAndUpdate(
            { user: userId, contact: contactId },
            { status },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Update the reciprocal relationship
        await Contact.findOneAndUpdate(
            { user: contactId, contact: userId },
            { status }
        );

        // If notification ID is provided, update it as well
        if (notificationId && mongoose.Types.ObjectId.isValid(notificationId)) {
            await Notification.findByIdAndUpdate(
                notificationId,
                { status: status === 'accepted' ? 'accepted' : 'rejected' }
            );
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get pending contact requests for a user
const getPendingRequests = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json([]);
        }

        // Find contact records for this user with pending status
        const pendingContacts = await Contact.find({
            user: userId,
            status: 'pending'
        }).populate('contact', 'username email avatarImage');
        
        // For each pending contact, let's look up if there's a corresponding notification
        // to determine who initiated the request
        const pendingContactsWithInitiator = await Promise.all(
            pendingContacts.map(async (contact) => {
                // Look for a notification where this user is the recipient and the contact is the sender
                const receivedNotification = await Notification.findOne({
                    user: userId,
                    fromUser: contact.contact._id,
                    type: 'contactRequest'
                });
                
                // Look for a notification where this user is the sender and the contact is the recipient
                const sentNotification = await Notification.findOne({
                    user: contact.contact._id,
                    fromUser: userId,
                    type: 'contactRequest'
                });
                
                // Determine who initiated the request
                const fromUser = receivedNotification ? contact.contact._id : userId;
                
                // Return the contact with additional fromUser field
                return {
                    ...contact.toObject(),
                    fromUser
                };
            })
        );
        
        // Ensure we always return an array
        return res.status(200).json(pendingContactsWithInitiator || []);
    } catch (error) {
        console.error('Error in getPendingRequests:', error);
        // Return empty array on error
        return res.status(500).json([]);
    }
};

module.exports = {
    addContact,
    getContacts,
    removeContact,
    updateContactStatus,
    getPendingRequests
}; 