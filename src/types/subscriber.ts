import { Document, Types } from "mongoose";
import { ISegment } from "./segment";
import { IUser } from "./user";

export interface ICustomField {
    [key: string]: any;
}

export interface ISubscriber extends Document {
    name?: string;
    email: string;
    notes: string;
    isSubscribed: boolean;
    segmentId: Types.Array<Types.ObjectId | ISegment>;
    createdBy: Types.Array<Types.ObjectId | IUser>;
    customFields?: ICustomField;
}