import StyleModel from "@/models/StyleModel";
import StyleClassModel from "@/models/StyleClassModel";
import styleModel from "@/models/StyleModel";
import portfolioModel from "@/models/PortfolioModel";

async function createPortfolioStyle() {
    const rootStyleClass = await StyleClassModel.create(
        {
            identifier: "root",
        }
    )
    return await StyleModel.create({
        classes: {
            "root": rootStyleClass._id
        },
    });

}


export {
    createPortfolioStyle,
}