export default interface Component {
    _id: string | null;
    __t: string; // Type of component
    index: number;
    parent_id: string;
}