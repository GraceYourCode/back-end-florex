import express from 'express';
import authRoutes from './routes/authRoutes'
import verificationRoutes from './routes/verificationRoutes'
import userRoutes from './routes/userRoutes'
import chatRoutes from './routes/chatRoutes'

const app = express();
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use("/api/verification", verificationRoutes)
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

export default app;
