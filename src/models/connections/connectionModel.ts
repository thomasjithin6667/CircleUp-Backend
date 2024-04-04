import mongoose, { Schema, model } from "mongoose";
import ConnectionInterface from "./connectionTypes";

const ConnectionSchema: Schema = new Schema({
  userId:{
    type: Schema.Types.ObjectId, 
    ref: "User",
    required:true
  },
 connections: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  requested: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  requestSent: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

const Connections = mongoose.model<ConnectionInterface>(
  "Connections",
  ConnectionSchema
);

export default Connections;