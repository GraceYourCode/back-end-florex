import { model, models, Schema } from "mongoose";

interface IRooms {
  users: [string, string]
}

const roomSchema = new Schema<IRooms> ({
 users: {
  type: [String, String],
  required: [true, "Both users are required!"]
 }
})

export const Room = models.Room || model<IRooms>("Room", roomSchema);