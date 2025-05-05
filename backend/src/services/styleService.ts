import StyleModel from "@/models/StyleModel";
import StyleClassModel from "@/models/StyleClassModel";

async function createPortfolioStyle() {
    const rootStyleClass = await StyleClassModel.create(
        {
            identifier: "root",
            backgroundColor: "#242424",
            color: "white",
            alignItems: "flex-start"
        }
    )

    const containerStyleClass = await StyleClassModel.create(
        {
            identifier: "container",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            color: "white",
            alignItems: "flex-start"
        }
    )

    return await StyleModel.create({
        classes: {
            "root": rootStyleClass._id,
            "container": containerStyleClass._id
        },
    });

}


export {
    createPortfolioStyle,
}