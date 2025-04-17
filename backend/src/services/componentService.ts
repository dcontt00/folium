import {
    ButtonComponentModel,
    ComponentModel,
    ContainerComponentModel,
    ImageComponentModel,
    PortfolioModel,
    TextComponentModel
} from "@/models";
import {IComponent} from "@/interfaces";
import mongoose from "mongoose";
import {ApiError} from "@/classes";

async function removeOrphanComponents() {
    try {
        // Step 1: Get all component IDs that are referenced in any portfolio or containerComponent
        const portfolios = await PortfolioModel.find({}, {components: 1}).populate("components");
        const referencedComponentIds = new Set<string>();
        portfolios.forEach(portfolio => {
            portfolio.components.forEach((component: IComponent) => {
                referencedComponentIds.add(component._id.toString());
            });
        });


        // Step 2: Get all component IDs from the components collection
        const allComponents = await ComponentModel.find({}, {_id: 1});
        const allComponentIds = allComponents.map(component => component._id.toString());

        // Step 3: Find the difference between these two sets of IDs
        const orphanComponentIds = allComponentIds.filter(id => !referencedComponentIds.has(id));
        console.log("Orphan component IDs:", orphanComponentIds);
        console.log("Referenced component IDs:", referencedComponentIds);

        // Step 4: Remove orphan components
        await ComponentModel.deleteMany({_id: {$in: orphanComponentIds}});

    } catch (e) {
        console.error(e);
    }
}

async function createComponent(component: any, parent_id: mongoose.Types.ObjectId): Promise<any> {
    switch (component.__t) {
        case "TextComponent":
            if (!component.text) {
                throw new ApiError(400, "Text is required for text component");
            }
            return await TextComponentModel.create({
                componentId: component.componentId,
                type: component.type,
                index: component.index,
                text: component.text,
                parent_id: parent_id
            })

        case "ButtonComponent":
            if (!component.text || !component.url) {
                throw new ApiError(400, "Text and URL are required for button component");
            }
            return await ButtonComponentModel.create({
                componentId: component.componentId,
                color: component.color,
                index: component.index,
                text: component.text,
                url: component.url,
                parent_id: parent_id
            })
        case "ImageComponent":
            if (!component.url) {
                throw new ApiError(400, "URL is required for image component");
            }

            return await ImageComponentModel.create({
                componentId: component.componentId,
                parent_id: parent_id,
                index: component.index,
                url: component.url,
                width: component.width,
                caption: component.caption,
                overlayText: component.overlayText,
            })
        case "ContainerComponent":
            const containerComponents: Array<any> = [];

            // Create container component
            const containerComponent = await ContainerComponentModel.create({
                componentId: component.componentId,
                parent_id: parent_id,
                index: component.index,
            })


            // Create each component of container assigning the containerComponent as parent
            for (const comp of component.components) {
                await createComponent(comp, containerComponent._id).then((c) => {
                    containerComponents.push(c._id);
                })
            }

            // Update the containerComponent with the created components
            return await ContainerComponentModel.findOneAndUpdate(
                {_id: containerComponent._id},
                {components: containerComponents},
                {new: true}
            ).then(updatedComponent => {
                return updatedComponent
            })

    }
}


export {
    removeOrphanComponents,
    createComponent
}