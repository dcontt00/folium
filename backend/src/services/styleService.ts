import StyleModel from "@/models/StyleModel";
import StyleClassModel from "@/models/StyleClassModel";

async function createPortfolioStyle() {
    const rootStyleClass = await StyleClassModel.create(
        {
            identifier: "root",
            backgroundColor: "#242424",
            display: "flex",
            flexDirection: "column",
            gap: "1"
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