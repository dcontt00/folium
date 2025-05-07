enum ChangeType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
    NEW_PORTFOLIO = 'NEW_PORTFOLIO',
}

interface IChange {
    componentChanges: string | null;
    portfolioChanges: string | null;
    componentAdditions: string | null;
    componentRemovals: string | null;
}

export {ChangeType};
export type {IChange};

