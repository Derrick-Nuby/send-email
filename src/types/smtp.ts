import { Document } from "mongoose";

export interface ISmtp extends Document {
    name: string;
    service?: string;
    pool?: boolean;
    host?: string;
    port?: number;
    secure?: boolean;
    fromEmail?: string;
    createdBy: string;
    isTested?: boolean;
    lastTested?: Date;
    auth: {
        user: string;
        pass: string;
    },
}
