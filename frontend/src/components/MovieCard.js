import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MovieCard(props) {
  return (
    <Card style={{ width: '18rem'}} className="mb-3 shadow">
      <Card.Body>
        <Card.Title className="card-title"><strong>{props.title}</strong></Card.Title>
        <div className='text-center'>
          <Card.Img src={"/interstellar.jpg"} className='mb-4'/>
        </div>
        <Card.Text>
          <strong>Genres: </strong>{props.genres.map((genre, index) => <span key={index}>{genre} </span>)}
        </Card.Text>
        <Card.Text>
          <strong>Year: </strong>{props.year}
        </Card.Text>
      </Card.Body>
      <Button href={"/movie/" + props._id} className='mb-4  btn-outline-primary btn-outline-primary:hover button-margin'>Open Movie</Button>
  </Card>

  );
}

export default MovieCard;