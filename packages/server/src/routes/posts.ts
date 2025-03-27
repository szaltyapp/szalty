import express from 'express';
import { User } from '../models/User';
import { Post } from '../models/Post';

const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { image, caption, userId } = req.body;
    
    // Find user by Firebase ID
    const user = await User.findOne({ firebaseId: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newPost = new Post({
      user: user._id,
      image,
      caption,
      createdAt: new Date()
    });
    
    await newPost.save();
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
