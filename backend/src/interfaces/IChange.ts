enum ChangeType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
}

interface IChange {
    type: ChangeType;
    message: string;
}

export {IChange, ChangeType}
