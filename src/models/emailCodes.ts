import { model, models, Schema } from "mongoose";

interface ICode extends Document {
  email: string;
  code: string | number;
  expiredAt: Date;
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
  expiredAt: {
    type: Date,
    required: true,
  }
})

export const Code = models.Code || model<ICode>("Code", codeSchema)