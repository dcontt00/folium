import {ComponentModel, VersionModel} from "@/models";
import mongoose from "mongoose";
import {restorePortfolio} from "@/services/portfolioService";
import {ApiError, Portfolio, StyleClass} from "@/classes";
import Changes from "@/classes/Changes";
import styleModel from "@/models/StyleModel";
import Component from "@/classes/components/Component";
import {IPortfolio, IServiceResult} from "@/interfaces";
import Style from "@/classes/Style";


async function getVersion(versionId: string, restore: boolean): Promise<IServiceResult> {
    const version = await getVersionById(versionId)

    if (version == null) {
        throw new ApiError(404, "Version not found");
    }

    const components: Component[] = await ComponentModel.find({_id: {$in: version.components}})
    const style = await styleModel
        .findById(version.style)
        .populate("classes")

    if (restore) {
        const restoredPortfolio = await restorePortfolio(version, components, style)
        await deleteOlderVersions(version.portfolioId, version.createdAt)

        return {
            status: 200,
            success: true,
            data: restoredPortfolio,
        }


    } else {
        const portfolio: IPortfolio = {
            _id: version.portfolioId,
            title: version.title,
            description: version.description,
            url: version.url,
            components: components,
            // @ts-ignore
            style: style,
        }
        return {
            status: 200,
            success: true,
            data: portfolio,
        };
    }
}

async function getVersionById(id: string,) {
    return VersionModel.findById(id);
}

async function deleteOlderVersions(portfolioId: mongoose.Types.ObjectId, date: any) {
    return VersionModel.deleteMany({
        portfolioId: portfolioId,
        createdAt: {$gt: date}
    });
}

async function createVersion(
    prevPortfolio: Portfolio,
    newPortfolio: Portfolio,
) {
    const changes2 = new Changes();

    await getPortfolioChanges(prevPortfolio, newPortfolio, changes2)
    getComponentAdditions(prevPortfolio.components, newPortfolio.components, changes2);
    const prevStyle = await styleModel.findById(prevPortfolio.style).populate("classes").lean();
    const currentStyle = await styleModel.findById(newPortfolio.style).populate("classes").lean();

    // Detect changes and removals
    // @ts-ignore
    await getComponentUpdatesAndRemovals(prevPortfolio.components, newPortfolio.components, prevStyle, currentStyle, changes2);

    return await VersionModel.create({
        portfolioId: newPortfolio._id,
        changes: changes2.toJSON(),
        components: newPortfolio.components,
        description: newPortfolio.description,
        url: newPortfolio.url,
        title: newPortfolio.title,
        style: newPortfolio.style,
    }).then((version) => {
        return version;
    })
}

/**
 * Compares styles between two versions and detects changes.
 * @param {Map<string, StyleClass>} styleA - The style classes of the previous version.
 * @param {Map<string, StyleClass>} styleB - The style classes of the current version.
 * @param {Component} component - The component being compared.
 * @param {Changes} changes - The object to store detected changes.
 */
function compareStyles(styleA: Map<string, StyleClass>, styleB: Map<string, StyleClass>, component: Component, changes: Changes) {

    const keys = new Set([...styleA.keys(), ...styleB.keys()]);
    // Remove keys that are not in the style
    const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__"];
    for (const key of keysToRemove) {
        keys.delete(key);
    }

    for (const key of keys) {

        if (!key.includes(component.className)) {
            continue;
        }

        const prevClass = styleA.get(key);
        const currentClass = styleB.get(key);

        if (!prevClass || !currentClass) {
            continue;
        }

        const currentClassKeyValues = Object.entries(currentClass).filter(([key]) => !keysToRemove.includes(key));
        const currentClassKeyValueObject = Object.fromEntries(currentClassKeyValues);
        const prevClassKeyValues = Object.entries(prevClass).filter(([key]) => !keysToRemove.includes(key));
        const prevClassKeyValueObject = Object.fromEntries(prevClassKeyValues);

        for (const key2 of Object.keys(currentClassKeyValueObject)) {
            if (prevClassKeyValueObject[key2] !== currentClassKeyValueObject[key2]) {
                changes.addComponentChange(component, key2, prevClassKeyValueObject[key2], currentClassKeyValueObject[key2])

            }
        }


    }
}

/**
 * Identifies updates and removals of components between two versions of a portfolio.
 * @param {Component[]} previousComponents - The components in the previous version.
 * @param {Component[]} currentComponents - The components in the current version.
 * @param {Style} prevStyle - The style of the previous version.
 * @param {Style} currentStyle - The style of the current version.
 * @param {Changes} changes - The object to store detected changes.
 */
async function getComponentUpdatesAndRemovals(previousComponents: any[], currentComponents: any[], prevStyle: Style, currentStyle: Style, changes: Changes) {
    for (const prevComponent of previousComponents) {
        const currentComponent = currentComponents.find(
            (component) => component.componentId === prevComponent.componentId
        );


        if (!currentComponent) {
            // Component was removed
            changes.removeComponent(prevComponent)

        } else {

            if (currentComponent.__t === "ContainerComponent") {
                // Manage container components
                // @ts-ignore
                getComponentAdditions(prevComponent.components, currentComponent.components, changes)

                // @ts-ignore
                await getComponentUpdatesAndRemovals(prevComponent.components, currentComponent.components, prevStyle, currentStyle, changes);

                changes.addComponent(currentComponent)

                continue;
            }

            // Compare fields to detect changes
            // @ts-ignore
            const allKeys = Object.keys(prevComponent.toObject());
            console.log("allKeys", allKeys)
            const keysToRemove = ["_id", "createdAt", "updatedAt", "__v", "$__", "_doc", "$isNew", "__t", "parent_id"];
            const keys = allKeys.filter(key => !keysToRemove.includes(key));
            for (const key of keys) {
                // @ts-ignore
                if (prevComponent[key]?.toString() !== currentComponent[key]?.toString() && currentComponent[key] !== undefined) {
                    // @ts-ignore
                    changes.addComponentChange(currentComponent, key, prevComponent[key], currentComponent[key])

                }
            }
        }
        // Compare styles
        compareStyles(prevStyle.classes, currentStyle.classes, prevComponent, changes);
    }
}

async function createFirstVersion(portfolio: Portfolio) {

    const changes = new Changes()
    changes.setPortfolioCreated(true)
    await VersionModel.create(
        {
            portfolioId: portfolio._id,
            changes: changes.toJSON(),
            components: portfolio.components,
            title: portfolio.title,
            description: portfolio.description,
            url: portfolio.url,
            style: portfolio.style,
        }
    ).then(() => {
    }).catch((err => {
        console.log("Error creating version", err)
        throw new ApiError(500, "Error creating version");
    }))
}

/**
 * Identifies additions of components between two versions of a portfolio.
 * @param {Component[]} previousComponents - The components in the previous version.
 * @param {Component[]} currentComponents - The components in the current version.
 * @param {Changes} changes - The object to store detected changes.
 */
function getComponentAdditions(previousComponents: Component[], currentComponents: Component[], changes: Changes) {

    for (const currentComponent of currentComponents) {
        if (!previousComponents.find((component) => component.componentId === currentComponent.componentId)) {
            // Check if a ContainerComponent with children was added
            // @ts-ignore
            if (currentComponent.__t === "ContainerComponent" && currentComponent.components.length != 0) {
                // @ts-ignore
                getComponentAdditions([], currentComponent.components, changes)
                changes.addComponent(currentComponent)

                // @ts-ignore
                changes.addComponentChange(currentComponent, "components", "[]", currentComponent.components)
            } else {
                changes.addComponent(currentComponent)

            }
        }
    }
}

/**
 * Detects changes between two portfolio objects.
 * @param {Portfolio} prevPortfolio - The previous portfolio object.
 * @param {Portfolio} newPortfolio - The new portfolio object.
 * @param {Changes} changes - The object to store detected changes.
 */
async function getPortfolioChanges(prevPortfolio: Portfolio, newPortfolio: Portfolio, changes: Changes) {

    // Check portfolio attributes
    if (prevPortfolio.title !== newPortfolio.title) {
        changes.addPortfolioChange("Title", prevPortfolio.title, newPortfolio.title)
    }

    if (prevPortfolio.description !== newPortfolio.description) {
        changes.addPortfolioChange("Description", prevPortfolio.description, newPortfolio.description)
    }

    if (prevPortfolio.url !== newPortfolio.url) {
        changes.addPortfolioChange("URL", prevPortfolio.url, newPortfolio.url)
    }
}

async function getVersionsByPortfolioId(portfolioId: string) {
    return VersionModel
        .find({portfolioId: portfolioId})
        .sort({createdAt: -1});

}

export {
    getVersionById,
    deleteOlderVersions,
    createVersion,
    getVersionsByPortfolioId,
    createFirstVersion,
    getVersion,
    getComponentUpdatesAndRemovals,
    getPortfolioChanges,
    getComponentAdditions
}