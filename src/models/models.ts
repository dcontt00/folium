import mongoose from "mongoose";
import UserSchema from "./userSchema";
import PortfolioSchema from "./portfolioSchema";
import StyleSchema from "./styleSchema";
import TextComponentSchema from "./portfolioComponents/textComponentSchema";
import ButtonComponentSchema from "./portfolioComponents/buttonComponentSchema";

const userModel = mongoose.model('User', UserSchema);
const portfolioModel = mongoose.model('Portfolio', PortfolioSchema);
const styleModel = mongoose.model('Style', StyleSchema);
const textComponentModel = mongoose.model('TextComponent', TextComponentSchema);
const buttonComponentModel = mongoose.model('ButtonComponent', ButtonComponentSchema);

export {userModel, portfolioModel, styleModel, textComponentModel, buttonComponentModel};