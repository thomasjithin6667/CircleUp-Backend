import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Conversation from "../models/conversations/conversationsModel";
import Message from "../models/messages/messagesModel";
import { log } from "console";

// @desc    Adda new conversation
// @route   get /chat/add-conversation
// @access  Public


export const addConversationController = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingConversation) {
      const conversation = await Conversation.find({
        members: { $all: [senderId, receiverId]},
      }).populate({
        path: 'members',
        select: 'username profileImageUrl'
      });
      const conversations = await Conversation.find({
        members: { $in: [senderId] },
      }).populate({
        path: 'members',
        select: 'username profileImageUrl'
      });

      return res.status(200).json({conversation,conversations});
    }
    

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const conversation = await newConversation.save();
    const conversations = await Conversation.find({
      members: { $in: [senderId] },
    }).populate({
      path: 'members',
      select: 'username profileImageUrl'
    });

    res.status(200).json({conversation,conversations});

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// @desc    Get conversations of a user
// @route   get /chat/get-conversation
// @access  Public

export const getUserConversationController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      }).populate({
        path: 'members',
        select: 'username profileImageUrl'
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// @desc    Get conversations of two users
// @route   get /chat/get-conversation
// @access  Public

export const findConversationController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


// @desc    Add new Message
// @route   get /chat/add-message
// @access  Public

export const addMessageController = asyncHandler(async (req: Request, res: Response) => {
  const newMessage = new Message(req.body);
console.log("reached here add me");

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @desc    Get User Message
// @route   get /chat/get-message
// @access  Public

export const getMessagesController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate({
        path: 'sender',
        select: 'username profileImageUrl'
      });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});