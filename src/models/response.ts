import { IResponse } from "../types/response";
import { model, Schema } from "mongoose";


const responseSchema: Schema = new Schema(
    {
        message: {
            type: String,
        },
        email: {
            type: String,
        },
        response: {
            type: String,
        },
        messageId: {
            type: String,
        },
        envelope: {
            from: {
                type: String,
            },
            to: {
                type: [String],
            },
        },
        accepted: {
            type: [String],
        },
        rejected: {
            type: [String],
        },
        pending: {
            type: [String],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }
);

export default model<IResponse>("Response", responseSchema);
