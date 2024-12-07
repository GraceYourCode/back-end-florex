import { model, models, Schema } from "mongoose";

interface IRevokedTokens extends Document {
  token: string;
}

const revokedTokenSchema = new Schema<IRevokedTokens>({
  token: {
    type: String,
    required: [true, "Token is required!"]
  }
});

export const RevokedToken = models.RevokedToken || model<IRevokedTokens>("RevokedToken", revokedTokenSchema)