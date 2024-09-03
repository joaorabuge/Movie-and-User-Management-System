import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function UserCard(props) {
  let image;
  if(props.gender == "M"){
    image ="/maleIcon.png";
  }else{
    image ="/femaleIcon.png";
  }
  return (
    <Card style={{ width: '18rem'}} className="mb-3 shadow">
      
      <Card.Body>
        <Card.Title><strong>{props.name}</strong></Card.Title>
        <div className='text-center m-4'>
          <Card.Img src={image} className='userImage'/>
        </div>
        <Card.Text>
          <strong>Gender: </strong>{props.gender}
        </Card.Text>
        <Card.Text>
          <strong>Age: </strong>{props.age}
        </Card.Text>
        <Card.Text>
          <strong>Occupation: </strong>{props.occupation.split}
        </Card.Text>
        <Card.Text>
          <strong>Number of ratings: </strong>{props.num_ratings}
        </Card.Text> 
      </Card.Body>
      <Button href={"/user/" + props._id} className='mb-4  btn-outline-primary button-margin'>Open User</Button>
    </Card>
    
  );
}

export default UserCard;