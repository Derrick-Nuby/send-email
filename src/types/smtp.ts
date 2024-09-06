import { Document } from "mongoose";

export interface ISmtp extends Document {
    name: string;
    service?: string;
    pool?: boolean;
    host?: string;
    port?: number;
    secure?: boolean;
    auth: {
        user: string;
        pass: string;
    },
}
