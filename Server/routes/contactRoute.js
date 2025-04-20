const express = require("express");
const router = express.Router();
const { 
    addContact, 
    getContacts, 
    removeContact, 
    updateContactStatus,
    getPendingRequests 
} = require("../controllers/contactController");

// Add a new contact
router.post("/add", addContact);

// Get pending contact requests (specific route should come before generic route)
router.get("/pending/:userId", getPendingRequests);

// Get all contacts for a user (generic route with id parameter)
router.get("/:id", getContacts);

// Remove a contact
router.delete("/:userId/:contactId", removeContact);

// Update contact status
router.put("/:userId/:contactId", updateContactStatus);

module.exports = router; 