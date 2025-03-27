import mongoose from "mongoose";
import UserSchema from "./userSchema";
import PortfolioSchema from "./portfolioSchema";
import StyleSchema from "./styleSchema";
import buttonComponentModel from "./portfolioComponents/buttonComponentModel";
import textComponentModel from "./portfolioComponents/textComponentModel";
import imageComponentModel from "./portfolioComponents/imageComponentModel";
import componentModel from "./portfolioComponents/componentModel";

const userModel = mongoose.model('User', UserSchema);
const portfolioModel = mongoose.model('Portfolio', PortfolioSchema);
const styleModel = mongoose.model('Style', StyleSchema);


// Components

export {
    userModel,
    portfolioModel,
    styleModel,
    textComponentModel,
    buttonComponentModel,
    imageComponentModel,
    componentModel
};