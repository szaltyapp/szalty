import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import postsRoutes from './routes/posts';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// Routes
app.use('/api/posts', postsRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Szalty API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
