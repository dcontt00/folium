enum ChangeType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
    NEW_PORTFOLIO = 'NEW_PORTFOLIO',
}

interface IChange {
    type: ChangeType;
    message: string;
}

export {IChange, ChangeType}
