import mongoose from "mongoose";
import {UserSchema} from "@/schemas";

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;