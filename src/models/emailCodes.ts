import { model, models, Schema } from "mongoose";

interface ICode extends Document {
  email: string;
  code: string | number;
  expired: boolean;
}

const codeSchema = new Schema<ICode>({
  email: {
    type: String,
    required: true
  },
  code: {
    type: String || Number,
    required: true
  },
  expired: {
    type: Boolean,
    default: false
  }
})

export const Code = models.Code || model<ICode>("Code", codeSchema)