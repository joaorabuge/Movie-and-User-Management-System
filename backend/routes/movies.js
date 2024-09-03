import express from "express";
import db from "../db/config.js";
import { ObjectId } from "mongodb";

const router = express.Router();

//--------------------------------------------------------------------------------------------------------
// 1 - retrieves a list with all movies (you can limit to 50 movies)
router.get("/", async (req, res) => {
    let results = await db.collection('movies').find()
    .limit(50)
    .toArray();
    res.send(results).status(200);
});

//--------------------------------------------------------------------------------------------------------
// 3 - Add a new movie document to the movies collection
router.post("/", async (req, res) => {
    try {
      const newMovies = req.body; 
  
      // Check if the input is an array and contains at least one movie.
      if (!Array.isArray(newMovies) || newMovies.length === 0) {
        return res.status(400).send({ error: "Please provide at least one movie in the request body." });
      }
  
      const result = await db.collection('movies').insertMany(newMovies);
      res.status(201).send(newMovies); // Send back the new movie documents that were added to the collection
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while trying to create new movies" });
    }
  });

//--------------------------------------------------------------------------------------------------------
// 13 - Return movies with most 5 stars. Show movie information

router.get("/star", async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$movies" },
      { $match: { "movies.rating": 5 } },
      { $group: {
          _id: "$movies.movieid",
          number_of_five_stars: { $count: {} }
        }
      },
      { $sort: { number_of_five_stars: -1 } },
      { $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      { $unwind: "$movie_details" },
      { $project: {
          _id: 1,
          title: "$movie_details.title",
          genres: "$movie_details.genres",
          year: "$movie_details.year",
          number_of_five_stars: 1
        }
      }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the movies with most 5 stars" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 15 - For each user return, _id, name, max_rating, min_rating and avg_rating. Sort by avg_rating
router.get("/users", async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$movies" },
      { $group: { 
          _id: "$_id",
          name: { $first: "$name" },
          max_rating: { $max: "$movies.rating" },
          min_rating: { $min: "$movies.rating" },
          avg_rating: { $avg: "$movies.rating" }
        }
      },
      { $sort: { avg_rating: -1 }},
      { $project: { 
          _id: 1,
          name: 1,
          max_rating: 1,
          min_rating: 1,
          avg_rating: 1
        }
      }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving user ratings data" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 16 - List all movies that have comments. Sort by number of comments.
router.get("/comments", async (req, res) => {
  try {
    const pipeline = [
      { $group: {
          _id: "$movie_id", 
          numberOfComments: { $count: {} } 
        }
      },
      { $lookup: {
          from: "movies", 
          localField: "_id",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      { $unwind: "$movie_details" },
      { $project: { 
          _id: 1,
          title: "$movie_details.title",
          genres: "$movie_details.genres",
          year: "$movie_details.year",
          numberOfComments: 1
        }
      },
      { $sort: { numberOfComments: -1 } } 
    ];

    const results = await db.collection('comments').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the movies with comments" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 17 - Return number of ratings per occupation in descending order. Result should have “occupation” and “number of ratings”
router.get("/occupation", async (req, res) => {
  try {
    const pipeline = [
      { $group: {
          _id: "$occupation",
          num_ratings: { $sum: "$num_ratings" } 
        }
      },
      { $sort: { num_ratings: -1 } }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the number of ratings per occupation" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 21 - For each movie that includes the original title in parenthesis, create a new field named “original_title” and return a list with all this movies in the response
router.get('/originaltitle', async (req, res) => {
  try {
    const movies = await db.collection('movies')
                           .find({ title: { $regex: /\(.*\)/ } })
                           .toArray();

    movies.forEach(movie => {
      const match = movie.title.match(/\((.*?)\)/);
      if (match && match[1]) {
        movie.original_title = match[1];
      }
    });

    res.status(200).json(movies); 
  } catch (error) {
    console.error('Error retrieving movies with original title:', error);
    res.status(500).send({ error: "An error occurred while retrieving the movies with original titles" });
  }
});



//--------------------------------------------------------------------------------------------------------
// 5 - retrieves movie by its _id with average score and comments
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
      { $unwind: "$movies" }, 
      { $match: { "movies.movieid": _id } },
      { $group: {
          _id: "$movies.movieid", avg_score: {$avg: "$movies.rating"}
        }
      },
      { $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movies" 
        }
      },
      { $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "movie_id",
          as: "comments" 
        }
      },
      { $unwind: "$movies"},
      { $project: {
          _id: 1,
          title: "$movies.title",
          genres: "$movies.genres",
          year: "$movies.year",
          avg_score: 1,
          comments: "$comments.comment"
        }
      }
    ];

      const result = await db.collection('users').aggregate(pipeline).toArray();

      if (result.length === 0) {
          return res.status(404).send({ message: "No movies found for the given movie ID." });
      }
      
      res.status(200).send(result);
  
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while retrieving the movie." });
  }
});


//--------------------------------------------------------------------------------------------------------
// 7 - remove a movie by _id
router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id; 
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
      const result = await db.collection('movies').deleteOne({ _id: _id });
  
      // Check if any document was deleted
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "No movies found for the given movie ID to delete" });
      }
  
      res.status(200).send({ success: true, message: "Movie successfully deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "An error occurred while deleting the movie" });
    }
  });

//--------------------------------------------------------------------------------------------------------
// 9 - update a movie
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
    
    const updatedMovie = req.body; 
    
    const result = await db.collection('movies').updateOne(
      { _id: _id },
      { $set: updatedMovie }
    );

    // Check if the movie was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the movie' });
  }
});

//--------------------------------------------------------------------------------------------------------
// 11 - Displays list of top scored movies (by average score), sorted in descending order. Show movie information (title, year, etc.) in the response.Limit to {num_movies}
router.get("/higher/:num_movies", async (req, res) => {
  try {
    const numMovies = parseInt(req.params.num_movies);
    
    if (numMovies <= 0) {
      return res.status(400).send({ error: "Number of movies must be a positive integer" });
    }

    const pipeline = [
      { $unwind: "$movies" },
      { $group: {
          _id: "$movies.movieid", avg_score: {$avg: "$movies.rating"}
        }
      },
      { $sort: { avg_score: -1 }},
      { $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      { $unwind: "$movie_details" }, 
      { $project: {
        _id: 1,
        title: "$movie_details.title",
        genres: "$movie_details.genres",
        year: "$movie_details.year",
        avg_score: 1,
      }},
      { $limit: numMovies}
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the top scored movies" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 12 - Return list of movies ordered by total number of ratings. Show movie information.:order - “asc” or “desc”
router.get("/ratings/:order", async (req, res) => {
  const order = req.params.order; 

  // Check if the order parameter is valid
  if (order !== 'asc' && order !== 'desc') {
    return res.status(400).send({ error: "Order must be 'asc' or 'desc'" });
  }

  const sortOrder = order === 'asc' ? 1 : -1;

  try {
    const pipeline = [
      { $unwind: "$movies" },
      { $group: {
          _id: "$movies.movieid",
          total_ratings: { $count: {} }
        }
      },
      { $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      { $unwind: "$movie_details" },
      { $sort: { total_ratings: sortOrder } },
      { $project: {
          _id: 1,
          title: "$movie_details.title",
          genres: "$movie_details.genres",
          year: "$movie_details.year",
          total_ratings: 1
        }
      }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the movies ordered by number of ratings" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 14 - Return total number of ratings of users between {min_age} and {max_age}
router.get("/top/age/:min_age-:max_age", async (req, res) => {
  try {
    const min_age = parseInt(req.params.min_age);
    const max_age = parseInt(req.params.max_age);

    // Validate the age parameters
    if (isNaN(min_age) || isNaN(max_age)) {
      return res.status(400).send({ error: "Minimum and maximum age must be valid integers" });
    }

    const pipeline = [
      { $match: {
          age: { $gte: min_age, $lte: max_age }
        }
      },
      { $unwind: "$movies"},
      { $group: {
          _id: null,
          total_ratings: { $count: {} }
        }
      },
      { $project: {
          _id: 0,
          total_ratings: 1
        }
      }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      // No results, send back zero ratings
      res.status(200).json({ total_ratings: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the total number of ratings" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 18 - Return list of top movies by {genre_name}. Include title and info of the movie
router.get('/genres/:genre_name', async (req, res) => {
  try {
    const genreName = req.params.genre_name;

    const pipeline = [
      { $unwind: "$movies" },
      { $group: {
          _id: "$movies.movieid", avg_score: {$avg: "$movies.rating"}
        }
      },
      { $sort: { avg_score: -1 }},
      { $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      { $unwind: "$movie_details"},
      //{ $unwind: "$movie_details.genres"},
      { $match: { "movie_details.genres": genreName } },
      { $project: {
          _id: 1,
          title: "$movie_details.title",
          genres: "$movie_details.genres",
          year: "$movie_details.year",
          avg_score: 1
        }
      }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the top movies by genre" });
  }
});

//--------------------------------------------------------------------------------------------------------
// 19 - List of movies by {genre_name} and {year}
router.get('/genres/:genre_name/year/:year', async (req, res) => {
  try {
    const genreName = req.params.genre_name;
    let year = req.params.year;
    
    // Year validation
    if (isNaN(year) || year.toString().length !== 4) {
      return res.status(400).send({ error: "Year must be a 4-digit number." });
    }

    const pipeline = [
      { $match: { 
        "genres": genreName,
        "year": year
    }},
    ];

    const results = await db.collection('movies').aggregate(pipeline).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the movies by genre and year" });
  }
});

router.get("/moviehorror", async (req, res) => {
  let result = await db.Movies.countDocuments({genres:{$regex:'Horror'}}) 
  res.send(result).status(200);
});

//--------------------------------------------------------------------------------------------------------
// 23 - In a new collection named: “ratings_by_user” save all the ratings of each user.
router.post('/user/ratings', async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$movies" },
      //{$limit: 400}, //Remove the comment to test it in postman
      { $lookup: {
          from: "movies",
          localField: "movies.movieid",
          foreignField: "_id",
          as: "movie_details"
        }
      },
      {$unwind: "$movie_details"},
      { $group: {
          _id: "$_id",
          name: { $first:"$name"},
          ratings: { $push: {
            movie_id: "$movie_details._id", 
            rating: "$movies.rating",
            title: "$movie_details.title",
            genres: "$movie_details.genres",
            year: "$movie_details.year"
            } 
          }
        }
      },
      { $out: "ratings_by_user" }
    ];

    const results = await db.collection('users').aggregate(pipeline).toArray();
    res.status(201).send({ message: "Collection created"});
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while retrieving the ratings"});
  }
});

export default router;