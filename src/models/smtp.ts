import { ISmtp } from "../types/smtp";
import { model, Schema } from "mongoose";
import { encrypt, decrypt } from "../utils/encryption.js";

const smtpSchema: Schema = new Schema(
  {
    name: { type: String },
    service: { type: String },
    pool: { type: Boolean },
    host: { type: String, required: true },
    port: { type: Number, required: true },
    secure: { type: Boolean, required: true },
    auth: {
      user: { type: String, required: true },
      pass: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

smtpSchema.pre<ISmtp>("save", function (next) {
  if (!this.isModified("auth.pass")) return next();

  const hashedPass = encrypt(this.auth.pass);
  this.auth.pass = hashedPass;

  next();
});

export default model<ISmtp>("Smtp", smtpSchema);
