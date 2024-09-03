import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();
//--------------------------------------------------------------------------------------------------------
// 20 - Add new comment to a movie
router.post('/', async (req, res) => {
  try {
    const { movie_id, comment, user_id } = req.body;
    console.log(movie_id);
    console.log(comment);
    console.log(user_id);
    if (!movie_id || !comment || !user_id) {
      return res.status(400).send({ error: "Movie ID, user ID, and comment text are required." });
    }

    const newComment = {
      "movie_id": movie_id,
      "user_id": user_id,
      "comment": comment,
      "date": new Date() 
    };

    const result = await db.collection('comments').insertOne(newComment);

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while adding the comment" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 22 - Remove comment by _id
router.delete("/:id", async (req, res) => {
  try {
    
  const id = req.params.id; // Extracting the id from the route parameters
/*
    // Check if the provided id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID provided" });
    }
      
   const _id = new ObjectId(id); // Create an ObjectId
*/
  // Check if the provided id is valid
  if (!id) {
    return res.status(400).send({ error: "Invalid ID provided" });
  }

  const _id = parseInt(id);
  const result = await db.collection('comments').deleteOne({ _id: _id });

  // Check if any document was deleted
  if (result.deletedCount === 0) {
    return res.status(404).send({ error: "No comment found to delete" });
  }

  res.status(200).send({ success: true, message: "Comment successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while deleting the comment" });
  }
});

export default router;