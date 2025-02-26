import { model, models, Schema } from "mongoose";

interface IMessage {
  sender: string;
  receiver: string;
  message: string;
  timeStamp: Date;
  roomId: Schema.Types.ObjectId;
};

const messageSchema = new Schema<IMessage>({
  receiver: {
    type: String,
    required: [true, "the receiver is required"!]
  },
  sender: {
    type: String,
    required: [true, "the sender is required!"]
  },
  message: {
    type: String,
    required: [true, "You can't send an empty message"]
  },
  timeStamp: {
    type: Date,
    required: [true, "Date is required!"],
    default: Date.now,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: [true, "the room id is required!"]
  },
});

export const Message = models.Message || model<IMessage>("Message", messageSchema);