
import { Document, Schema, model, Types } from 'mongoose';


export interface INotification extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  postId?: Types.ObjectId;
  jobId?: Types.ObjectId;
  applicationId?: Types.ObjectId;
  message: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


const Notification = model<INotification>('Notification', notificationSchema);


export default Notification;
