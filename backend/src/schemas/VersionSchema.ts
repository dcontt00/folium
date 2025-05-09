// models/Version.ts
import {Schema} from 'mongoose';
import {formatDistanceToNow} from "date-fns";
import {IVersion} from "@/interfaces";


const VersionSchema: Schema<IVersion> = new Schema({
        portfolioId: {type: Schema.Types.ObjectId, required: true},
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
        description: {type: String},
        url: {type: String, required: true},
        style: {type: Schema.Types.ObjectId, ref: "Style", required: true},
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);


VersionSchema.virtual("relativeCreatedAt").get(function () {
    return formatDistanceToNow(this.createdAt, {addSuffix: true});
});

export default VersionSchema