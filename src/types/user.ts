import { Document, Types } from "mongoose";
import { ISmtp } from "./smtp";
export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password: string;
  isAdmin: boolean;
  smtpConfig: Types.Array<Types.ObjectId | ISmtp>;
}