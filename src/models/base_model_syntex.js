import mongoose, {Schema} from "mongoose";
// import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema (
    {

    },
    {
        timestamps:true
    }
)

export const User = mongoose.model("User",userSchema)