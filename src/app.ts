import express from 'express';
import authRoutes from './routes/authRoutes'
import verificationRoutes from './routes/verificationRoutes'

const app = express();
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use("/api/verification", verificationRoutes)

export default app;
