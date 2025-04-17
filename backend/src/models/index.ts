import mongoose, {Document} from "mongoose";
import UserSchema from "../schemas/UserSchema";
import PortfolioSchema from "../schemas/PortfolioSchema";
import StyleSchema from "../schemas/StyleSchema";
import buttonComponentModel from "./portfolioComponents/buttonComponentModel";
import textComponentModel from "./portfolioComponents/textComponentModel";
import imageComponentModel from "./portfolioComponents/imageComponentModel";
import componentModel from "./portfolioComponents/componentModel";
import containerComponentModel from "./portfolioComponents/containerComponentModel";
import versionSchema from "../schemas/VersionSchema";
import IVersion from "../interfaces/IVersion";
import Portfolio from "../classes/Portfolio";


const userModel = mongoose.model('User', UserSchema);
const portfolioModel = mongoose.model<Document & Portfolio>('Portfolio', PortfolioSchema);
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