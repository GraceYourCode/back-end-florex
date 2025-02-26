import { Request, Response } from "express";
import { Message } from "../models/Messages";
import { Room } from "../models/messageRooms";

export const createRoom = async (req: Request, res: Response) => {
  const { user1, user2 } = req.body;

  try {
    const newRoom = new Room ({
      users: [user1, user2]
    })

    await newRoom.save();

    res.status(201).json({success: true, message: "New room created", roomId: newRoom._id});
  } catch (error) {
    res.status(500).json({success: false, error: (error as Error).message})
  }
}

export const sendMessage = async (req: Request, res: Response) => {
  const { sender, receiver, message } = req.body;

  try {
    const room = await Room.findOne({
      $or: [
        { users: [sender, receiver] },
        { users: [receiver, sender] },
      ],
    });

    if (!room) 
      res.status(403).json({success:false, error: "Room does not exist!"});

    const roomId = room._id;

    const newMessage = new Message ({
      sender,
      receiver,
      message,
      roomId,
      timeStamp: new Date(),
    })

    await newMessage.save();

    res.status(201).json({success: true, message: "Message successfully created", data: newMessage});
  } catch (error) {
    res.status(500).json({success: false, error: (error as Error).message})
  }
}

export const getMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId }).sort({ timeStamp: 1 });

    res.status(200).json({success: true, data: messages});
  } catch (error) {
    res.status(500).json({success: false, error: (error as Error).message})
  }
}