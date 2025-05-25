const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const createPost = async (req, res) => {
  const { text, type, location } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!text || !type || !location) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newPost = await prisma.post.create({
      data: {
        text,
        type,
        location,
        userId
      }
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  const { location, type } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
        type: type || undefined,
      },
      include: {
        user: { select: { username: true } },
        replies: {
          include: { user: { select: { username: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};




const replyToPost = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newReply = await prisma.reply.create({
      data: {
        text,
        postId: parseInt(id),
        userId
      }
    });

    res.status(201).json(newReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reactToPost = async (req, res) => {
  const { type } = req.body; // 'like' or 'dislike'
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const postId = parseInt(id);

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const existingReaction = await prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingReaction) {
      // Update existing reaction
      await prisma.reaction.update({
        where: { userId_postId: { userId, postId } },
        data: { type },
      });
      return res.json({ message: `Reaction updated to ${type}` });
    } else {
      // Create new reaction
      await prisma.reaction.create({
        data: { type, userId, postId },
      });
      return res.json({ message: `Post ${type}d` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { createPost, getPosts,reactToPost ,replyToPost};

