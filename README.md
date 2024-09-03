# Movie and User Management System

This project is a Movie and User Management System built using Node.js, Express, and MongoDB. The system allows you to manage movies, users, comments, and ratings. It provides various APIs to interact with the database, retrieve information, and perform CRUD operations.
# Course: Data Storage in Distributed Environments

## Features

- **Movie Management**: Add, update, delete, and retrieve movie details.
- **User Management**: Add, update, delete, and retrieve user details.
- **Comment Management**: Add comments to movies, retrieve comments, and manage comment details.
- **Rating Management**: Retrieve movies by ratings, sort by average scores, and manage ratings per occupation.
- **Search and Filter**: Search movies by genre, year, and title. Retrieve movies with specific rating criteria.
- **Top Movies**: List top-scoring movies and movies with most five-star ratings.
- **Original Title Extraction**: Extract and display original titles from movie titles with parenthesis.

## Project Structure

The project consists of the following main files and directories:

- `Home.js`: The entry point of the application, initializing the server and connecting to the database.
- `User.js`, `Users.js`: Handles user-related API routes and operations.
- `Movie.js`, `Movies.js`, `MovieCard.js`: Handles movie-related API routes and operations.
- `UserCard.js`: Component for displaying user-related information.
- `comments.js`: Manages comments associated with movies.
- `db/config.js`: Configuration file for connecting to the MongoDB database.

## API Endpoints

### User Endpoints

- `GET /users`: Retrieve the first 50 users from the database.
- `POST /users`: Add one or more new users to the database.
- `GET /users/:id`: Retrieve a user by their ID, including their top 5 rated movies.
- `PUT /users/:id`: Update a user's information by ID.
- `DELETE /users/:id`: Delete a user by ID.
- `GET /users/top/occupation`: Return the number of ratings per occupation in descending order.

### Movie Endpoints

- `GET /movies`: Retrieve the first 50 movies from the database.
- `POST /movies`: Add one or more new movies to the database.
- `GET /movies/:id`: Retrieve a movie by its ID, including its average score and comments.
- `PUT /movies/:id`: Update a movie's information by ID.
- `DELETE /movies/:id`: Delete a movie by ID.
- `GET /movies/star`: Retrieve movies with the most 5-star ratings.
- `GET /movies/comments`: List all movies that have comments, sorted by the number of comments.
- `GET /movies/higher/:num_movies`: Display a list of top-scoring movies, limited by the specified number.
- `GET /movies/ratings/:order`: List movies ordered by the total number of ratings in ascending or descending order.
- `GET /movies/genres/:genre_name`: List top movies by a specific genre.
- `GET /movies/genres/:genre_name/year/:year`: List movies by genre and year.
- `GET /movies/originaltitle`: List movies that include the original title in parenthesis.

### Comments Endpoints

- Managed through movie endpoints and specific routes for retrieving and aggregating comments.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repository.git
