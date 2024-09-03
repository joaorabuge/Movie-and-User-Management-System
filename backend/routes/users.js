import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();
// 2 - return first 50 documents from users collection
router.get("/", async (req, res) => {
  let results = await db.collection('users').find()
  .limit(50)
  .toArray();
res.send(results).status(200);
});

//--------------------------------------------------------------------------------------------------------
// 4 - add user or multiple users
router.post("/", async (req, res) => {
    try {
      const newUsers = req.body; 
  
      // Check if the input is an array and contains at least one user.
      if (!Array.isArray(newUsers) || newUsers.length === 0) {
        return res.status(400).send({ error: "Please provide at least one user in the request body." });
      }
  
      const result = await db.collection('users').insertMany(newUsers);
      res.status(201).send(newUsers); 
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while trying to create new users" });
    }
  });

//--------------------------------------------------------------------------------------------------------
// 6 - Return a user from the users collection by its _id, include in the response the top 5 scored movie of the user
  router.get("/:id", async (req, res) => {
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
      
      const pipeline = [
        { $match: { "_id": _id } }, 
        { $unwind: "$movies"},
        { $group: {
            _id: "$_id",
            name: { $first: "$name" },
            gender: { $first: "$gender" },
            age: { $first: "$age" },
            occupation: { $first: "$occupation" },
            num_ratings: { $first: "$num_ratings" },
            movies: { $push: "$movies" },
            topMovies: {$push: "$movies"}
          }
        },
        { $unwind: "$topMovies"},
        { $sort: { "topMovies.rating": -1 } },
        { $group: {
            _id: "$_id",
            name: { $first: "$name" },
            gender: { $first: "$gender" },
            age: { $first: "$age" },
            occupation: { $first: "$occupation" },
            num_ratings: { $first: "$num_ratings" },
            movies: { $first: "$movies" },
            topMovies: {$push: "$topMovies"}
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            gender: 1,
            age: 1,
            occupation: 1,
            num_ratings: 1,
            movies: { $slice: ["$movies", 5] }, // for better visualization of the result in postman slice the fisrt 5 
            topMovies: { $slice: ["$topMovies", 5] } // Slice the first 5 
          }
        }
      ];
      
      const result = await db.collection('users').aggregate(pipeline).toArray();
  
      if (result.length === 0) {
        return res.status(404).send({ message: "No users found for the given user ID." });
      }
        
        res.status(200).send(result);
    
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while retrieving the user." });
    }
  });

// 8 - remove a user by _id
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
    const result = await db.collection('users').deleteOne({ _id: _id });
  
    // Check if any document was deleted
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "No user found to delete" });
    }
  
    res.status(200).send({ success: true, message: "User successfully deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while deleting the user" });
    }
  });

// 10 - update a user
router.put("/:id", async (req, res) => {
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
    
    const updatedUser = req.body; 
    
    const result = await db.collection('users').updateOne(
      { _id: _id },
      { $set: updatedUser }
    );

    // Check if the movie was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the User' });
  }
});
  
export default router;