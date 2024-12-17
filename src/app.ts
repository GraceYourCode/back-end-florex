import express from 'express';
import authRoutes from './routes/authRoutes'
import verificationRoutes from './routes/verificationRoutes'
import userRoutes from './routes/userRoutes'

const app = express();
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use("/api/verification", verificationRoutes)
app.use("/api", userRoutes)

export default app;
