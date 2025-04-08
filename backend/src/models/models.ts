import mongoose from "mongoose";
import UserSchema from "./userSchema";
import PortfolioSchema from "./portfolioSchema";
import StyleSchema from "./styleSchema";
import buttonComponentModel from "./portfolioComponents/buttonComponentModel";
import textComponentModel from "./portfolioComponents/textComponentModel";
import imageComponentModel from "./portfolioComponents/imageComponentModel";
import componentModel from "./portfolioComponents/componentModel";
import containerComponentModel from "./portfolioComponents/containerComponentModel";
import versionSchema from "./versionSchema";
import Portfolio from "../interfaces/portfolio";
import IVersion from "../interfaces/IVersion";


const userModel = mongoose.model('User', UserSchema);
const portfolioModel = mongoose.model<Portfolio>('Portfolio', PortfolioSchema);
const styleModel = mongoose.model('Style', StyleSchema);
const versionModel = mongoose.model<IVersion>('Version', versionSchema);

// Components

export {
    userModel,
    portfolioModel,
    styleModel,
    textComponentModel,
    buttonComponentModel,
    imageComponentModel,
    componentModel,
    containerComponentModel,
    versionModel,
};