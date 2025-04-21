import mongoose from "mongoose";
import ContainerComponent from "@/classes/components/ContainerComponent";


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


ContainerComponentSchema.loadClass(ContainerComponent)

export default ContainerComponentSchema;