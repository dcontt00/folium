import mongoose from "mongoose";


const ContainerComponentSchema = new mongoose.Schema(
    {
        components: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Component",
            },
        ],
    },
    {timestamps: true}
)

export default ContainerComponentSchema;