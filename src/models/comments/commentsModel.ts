
import { Schema, model, Document, Types } from 'mongoose';
import {ReplyCommentInterface , CommentInterface }from './commentsTypes'

const ReplyCommentSchema = new Schema<ReplyCommentInterface>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  replyComment: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


const CommentSchema = new Schema<CommentInterface>({
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    replyComments: [ReplyCommentSchema]
 
  },{timestamps:true});
  
  const Comment = model<CommentInterface>('Comment', CommentSchema);
  
  export default Comment;