import mongoose from "mongoose";
import UserSchema from "@/schemas/UserSchema";

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;