import { ISubscriber } from "../types/subscriber";
import mongoose, { model, Schema } from "mongoose";

const subscriberSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        isSubscribed: {
            type: Boolean,
            default: true,
        },
        segmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Segment',
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        customFields: {
            type: Map,
            of: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

export default model<ISubscriber>("Subscriber", subscriberSchema);
