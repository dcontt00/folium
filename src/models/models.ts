import mongoose from "mongoose";
import UserSchema from "./userSchema";

const userModel = mongoose.model('User', UserSchema);

export {userModel};