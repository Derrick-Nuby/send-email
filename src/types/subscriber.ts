import { Document, Types } from "mongoose";
import { ISegment } from "./segment";

export interface ICustomField {
    [key: string]: any;
}

export interface ISubscriber extends Document {
    name?: string;
    email: string;
    notes: string;
    isSubscribed: boolean;
    segmentId: Types.Array<Types.ObjectId | ISegment>;
    customFields?: ICustomField;
}