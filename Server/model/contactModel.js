const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'blocked'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add compound index to ensure unique contacts
contactSchema.index({ user: 1, contact: 1 }, { unique: true });

module.exports = mongoose.model("Contacts", contactSchema); 