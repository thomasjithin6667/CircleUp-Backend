"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
// Conversation Routes
router.post("/add-conversation", chatController_1.addConversationController);
router.get("/get-conversations/:userId", chatController_1.getUserConversationController);
router.get("/find-conversation/:firstUserId/:secondUserId", chatController_1.findConversationController);
// Messages Routes
router.post('/add-message', chatController_1.addMessageController);
router.get('/get-messages/:conversationId', chatController_1.getMessagesController);
exports.default = router;
