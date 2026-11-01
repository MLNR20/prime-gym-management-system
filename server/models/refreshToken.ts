import { Schema, model, Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  admin: Types.ObjectId;
  // SHA-256 of the opaque token handed to the client; the raw value is never stored.
  tokenHash: string;
  // Every token minted by rotating a login shares its family, so a replayed
  // (already-rotated) token can revoke the whole chain.
  family: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "RefreshToken" }
);

// Mongo removes the document once expiresAt has passed.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
export default RefreshToken;
