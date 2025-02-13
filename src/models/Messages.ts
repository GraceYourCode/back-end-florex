import { model, models, Schema } from "mongoose";

interface IMessage {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  message: string;
  timeStamp: Date;
};

const messageSchema = new Schema<IMessage>({
  receiver: {
    type: Schema.Types.ObjectId,
    required: [true, "the receiver is required"!]
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: [true, "the sender is required!"]
  },
  message: {
    type: String,
    required: [true, "You can't send an emoty message"]
  },
  timeStamp: {
    type: Date,
    required: [true, "Date is required!"],
    default: Date.now,
  }
});

export const Message = models.Message || model<IMessage>("Message", messageSchema);