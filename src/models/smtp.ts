import { ISmtp } from "../types/smtp";
import mongoose, { model, Schema } from "mongoose";
import { encrypt } from "../utils/encryption.js";

const smtpSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    service: {
      type: String,
    },
    pool: {
      type: Boolean,
    },
    host: {
      type: String,
    },
    port: {
      type: Number,
    },
    secure: {
      type: Boolean,
    },
    auth: {
      user: {
        type: String,
        required: true,
      },
      pass: {
        type: String,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  }
);


smtpSchema.pre<ISmtp>("save", function (next) {
  if (!this.isModified("auth.pass")) return next();

  const hashedPass = encrypt(this.auth.pass);
  this.auth.pass = hashedPass;

  next();
});

export default model<ISmtp>("Smtp", smtpSchema);
