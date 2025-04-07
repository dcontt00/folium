// models/Version.ts
import {Schema} from 'mongoose';


const VersionSchema: Schema = new Schema({
    portfolioId: {type: String, required: true},
    data: {type: Schema.Types.Mixed, required: true},
    createdAt: {type: Date, default: Date.now},
    changes: {type: String, required: true},
});
export default VersionSchema