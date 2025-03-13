import mongoose from "mongoose";
import UserSchema from "./userSchema";
import PortfolioSchema from "./portfolioSchema";
import StyleSchema from "./styleSchema";
import TextComponentSchema from "./textComponentSchema";

const userModel = mongoose.model('User', UserSchema);
const portfolioModel = mongoose.model('Portfolio', PortfolioSchema);
const styleModel = mongoose.model('Style', StyleSchema);
const textComponentModel = mongoose.model('TextComponent', TextComponentSchema);

export {userModel, portfolioModel, styleModel, textComponentModel};