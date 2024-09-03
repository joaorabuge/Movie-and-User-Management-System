import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import MovieCard from "../components/MovieCard";

export default function App() {
  let [movies, setMovies] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/movies', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      setMovies(data);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="pb-5">
      <div className="bg-purple d-flex justify-content-center p-5 shadow">
        <div className="container bg-white row flex-lg-row-reverse align-items-center p-5 rounded-3 border shadow-lg">
          <div className="col-10 col-sm-8 col-lg-6">
            <img src="/toystory.jpg" className="d-block mx-lg-auto img-fluid shadow-lg rounded-3" width="400"  loading="lazy"/>
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold m-5">Latest Release</h1>
            <p className="lead m-5">Toy Story 3 is a 2010 American animated comedy-drama film produced by Pixar Animation Studios for Walt Disney Pictures.</p>
            <div className=" m-5 d-grid gap-3 d-md-flex">
              <Button className="btn btn-outline-section btn-lg" href={"/movie/" + 1}>Open Movie Details</Button>
              <Button className="btn btn-outline-secondary btn-lg" href={"#movieDetails"}>See other Movies</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h2 id="movieDetails" className="title mt-5 mb-5 text-center">Movies</h2>
        <CardGroup>
            <Row xs={1} md={2} className="d-flex justify-content-around">
            {movies && movies.map((movie) => {
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
    </div>
  )
}