import type {IChange} from "./IChange";
import type Component from "./component";

export default interface IVersion extends Document {
    _id: string;
    portfolioId: string;
    data: any;
    createdAt: string;
    changes: IChange[];
    components: Component[];
    title: string;
    description: string;
    url: string;
    relativeCreatedAt: string;
}