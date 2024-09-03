import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import MovieCard from "../components/MovieCard";
import Button from 'react-bootstrap/Button';

export default function App() {
  let params = useParams();
  let navigate = useNavigate();
  let [user, setUser] = useState(); 
  let [movies, setMovies] = useState([]); 

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      setUser(data);
      console.log(data[0].topMovies);
      return data[0].topMovies; // Return topMovies for further processing
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  const deleteUser = async () => {
    try {
      await fetch(`http://localhost:3000/users/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      alert('User was successfully deleted');
      navigate('/'); // Redirect to the home page
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the user.');
    }
  }

  useEffect(() => {
    getUser().then(movies => {
      if (movies && Array.isArray(movies)) {
        Promise.all(
          movies.map(movie =>
            fetch(`http://localhost:3000/movies/${movie.movieid}`)
              .then(res => res.json())
              .then(movieArray => movieArray[0]) // Extract the first element
          )
        ).then(fetchedMovies => {
            console.log("Movies", fetchedMovies); 
            setMovies(fetchedMovies);
        }).catch(error => {
          console.error('Error fetching movie details:', error);
        });
      }
    });
  }, [params.id]);  

  return (
    <>
      {user ?
        <div className="container pt-5 pb-5">
            <h1 className="title">{user[0].name}</h1>
            <div className="top-margin">
              <p><strong>Gender: </strong> {user[0].gender}</p>
              <p><strong>Age: </strong> {user[0].age}</p>
              <p><strong>Occupation: </strong> {user[0].occupation}</p>
              <p><strong>Number of Ratings: </strong> {user[0].num_ratings}</p>
            </div>
            <div className="pt-5">
              <h4 className="text-center"><strong>TOP 5 MOVIES</strong></h4>
              <div className="container pt-5 pb-5">
                <CardGroup>
                  <Row xs={1} md={2} className="d-flex justify-content-around">
                    {movies.map((movie) => {
                      return (
                        <MovieCard 
                          key={movie._id} 
                          {...movie} 
                        />
                      );
                    })}
                  </Row>
                </CardGroup>
              </div>
              <div className="text-center">
                <Button variant='outline-secondary m-2' onClick={deleteUser}>Delete User</Button>
                <Button variant='outline-primary' href="/users" >Go Back</Button>
              </div>
            </div>
        </div>
        : null
      }
    </>
  )
}
