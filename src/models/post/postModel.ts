import {Schema, model } from "mongoose";
import PostInterface from "./postTypes";

const PostSchema = new Schema<PostInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    hideComment:{
        type:Boolean,
        default:false
    },
    hideLikes:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
    
});

const Post = model<PostInterface>('Post', PostSchema);

export default Post;