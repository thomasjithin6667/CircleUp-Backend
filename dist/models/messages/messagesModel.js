"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Message = (0, mongoose_1.model)('Message', MessageSchema);
exports.default = Message;
