import type Component from "~/interfaces/component";

enum ChangeType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
    NEW_PORTFOLIO = 'NEW_PORTFOLIO',
}

interface ComponentChanges {
    component: Component,
    changes: Change[]
}

interface Change {
    attribute: string;
    oldValue: string;
    newValue: string;
}

interface IChange {
    componentChanges: ComponentChanges[];
    portfolioChanges: string | null;
    componentAdditions: string | null;
    componentRemovals: string | null;
    portfolioCreated: boolean;
}

export {ChangeType};
export type {IChange};

