import { Document,Types } from "mongoose";

export interface Conversation {
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDocument extends Conversation, Document {}