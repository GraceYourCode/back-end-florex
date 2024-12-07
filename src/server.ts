import dotenv from 'dotenv';
import app from './app';
import { connectToDB } from './utils/database';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectToDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// export default app;
