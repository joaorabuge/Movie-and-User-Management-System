import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
} from '@stacks/transactions';
import { utf8ToBytes } from '@stacks/common';
import { userSession } from '../auth';
import Button from 'react-bootstrap/Button';
const bytes = utf8ToBytes('foo'); 
const bufCV = bufferCV(bytes);

export default function App() {
  let params = useParams();
  let [movie, setMovie] = useState([]);

  const submitMessage = async (e) => {
    e.preventDefault();
    
    const functionArgs = [
      bufCV
    ];
    
    const options = {
      contractAddress: '',
      contractName: '',
      functionName: 'set-value',
      functionArgs,
      appDetails: {
        name: 'Movies App Rating',
        icon: window.location.origin + '/my-app-logo.svg',
      },
      onFinish: data => {
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);


        window.location.reload();
      },
    };

    const response = await openContractCall(options);
    
  };

  const getMovie = async () => {
    try {
      const response = await fetch(`http://localhost:3000/movies/${params.id}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      setMovie(data);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getMovie();
  }, []);

  function renderStars(avgScore) {
    const filledStars = Math.round(avgScore);
    return '★'.repeat(filledStars) + '☆'.repeat(5 - filledStars);
  }

  return (
    <>
      {movie.length > 0 ?
        <div className="container pt-5 pb-5">
          <div className="d-flex align-items-center mb-5">
            <h1 className="title me-3"><strong>{movie[0].title}</strong></h1>
            <div className="star-rating pb-3">
              {renderStars(movie[0].avg_score)}
            </div>
          </div>
          <div className="mb-5">
            <p><strong>Genres: </strong>{movie[0].genres.join(', ')}</p>
            <p><strong>Year: </strong>{movie[0].year}</p>
          </div>
          <div className="text-center mb-5 min-height p-5 rounded-4 border shadow-sm bg-purple text-white">
            <h4 className="mb-4"><strong>Comments</strong></h4>
            {movie[0].comments.length > 0 ? <p>{movie[0].comments.join('\n ')}</p> : <p> This movie doesn't have comments</p>}
          </div>
          <div className="text-center">
                <Button variant='outline-primary' href="/movies" >Go Back</Button>
          </div>
          {userSession.isUserSignedIn() ? <a href="#" onClick={submitMessage}>Blockchain transaction</a> : null}
        </div>
        : null
      }
    </>
    )
}