import { ISegment } from "../types/segment";
import mongoose, { model, Schema } from "mongoose";

const segmentSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

export default model<ISegment>("Segment", segmentSchema);
