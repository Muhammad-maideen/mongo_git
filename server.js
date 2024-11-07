// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));



const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


  //Define  a Post Schema
const postSchema = new mongoose.Schema({
  course: {type: String, required:true},
  description: {type: String, required:true},
});

const Post = mongoose.model("Post", postSchema);

//Post the new data to api
app.post("/api/posts", async (req, res) => {
  const newPost = new Post({
    course: req.body.course,
    description: req.body.description,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "Error creating new post", error });
  }
});

//get the all data from api
app.get("/api/posts", async (req, res) => {
  try {
    const limit = Number(req.query.limit); // to limit the number of posts to show
    const posts = limit ? await Post.find().limit(limit) : await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// get the single data from api using id
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({ message: `Post with ${id} id not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});

// update the single data from api using id
app.put("/api/posts/:id", async (req, res) => {
  try {
    const Updatedpost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if(Updatedpost){
      res.status(200).json(Updatedpost);
    }else{
      res.status(404).json({ message: `Post with ${req.params.id} id not found` });
    }
  }catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// delete the single data from api using id
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if(deletedPost){
      res.status(200).json({ message: `Post with ${req.params.id} id deleted` });
    }else{
      res.status(404).json({ message: `Post with ${req.params.id} id not found` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


