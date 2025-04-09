import {IChange} from "./IChange";
import Component from "./component";

export default interface IVersion extends Document {
    portfolioId: string;
    data: any;
    createdAt: Date;
    relativeCreatedAt: string
    changes: IChange[];
    components: Component[];
    title: string;
    description: string;
    url: string;
}