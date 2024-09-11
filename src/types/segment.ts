import { Document, Types } from "mongoose";
import { IUser } from "./user";

export interface ISegment extends Document {
    name: string;
    description: string;
    createdBy: Types.Array<Types.ObjectId | IUser>;
}