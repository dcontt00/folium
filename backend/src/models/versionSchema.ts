// models/Version.ts
import {Schema} from 'mongoose';


const VersionSchema: Schema = new Schema({
    portfolioId: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    changes: {type: String, required: true},
    components: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Component',
        },
    ],
    title: {type: String, required: true},
    description: {type: String},
    url: {type: String, required: true},
});
export default VersionSchema