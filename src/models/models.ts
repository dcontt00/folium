import mongoose from "mongoose";
import UserSchema from "./user";

const userModel = mongoose.model('User', UserSchema);

export {userModel};