import mongoose, {Document} from "mongoose";
import Portfolio from "@/classes/Portfolio";
import {PortfolioSchema} from "@/schemas";

const PortfolioModel = mongoose.model<Document & Portfolio>('Portfolio', PortfolioSchema);
export default PortfolioModel