import { model, models, Schema } from "mongoose";

interface IRooms {
  users: [Schema.Types.ObjectId, Schema.Types.ObjectId]
}

const roomSchema = new Schema<IRooms> ({
 users: {
  type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
  required: [true, "Both users are required!"]
 }
})

export const Room = models.Room || model<IRooms>("Room", roomSchema);