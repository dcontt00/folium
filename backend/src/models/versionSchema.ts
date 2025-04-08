// models/Version.ts
import {Schema} from 'mongoose';


const VersionSchema: Schema = new Schema({
    portfolioId: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    changes: [
        {
            type: Schema.Types.Mixed,
            ref: "Change",
        },
    ],
    components: [
        {
            type: Schema.Types.Mixed,
            ref: 'Component',
        },
    ],
    title: {type: String, required: true},
    description: {type: String},
    url: {type: String, required: true},
});
export default VersionSchema