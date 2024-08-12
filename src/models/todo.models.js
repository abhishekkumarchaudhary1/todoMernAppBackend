import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const todoSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
        index: true,

      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: 'true'
      },
      ownerId: {
        type: String,
        required: true
      },
    }, 
    { timestamps: true }
)

export const Todo = mongoose.model("Todo", todoSchema);