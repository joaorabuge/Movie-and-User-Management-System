import React, {useState, useEffect} from "react";
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import UserCard from "../components/UserCard";

export default function App() {
  let [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
      });
      
      const data = await response.json();
      setUsers(data);
      console.log(data);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const sortByName = (ascending = true) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (ascending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setUsers(sortedUsers);
  };
  
  const sortByAge = (youngestFirst = true) => {
    const sortedUsers = [...users].sort((a, b) => {
      return youngestFirst ? a.age - b.age : b.age - a.age;
    });
    setUsers(sortedUsers);
  };
  
  const sortByRatings = (mostRatingsFirst = true) => {
    const sortedUsers = [...users].sort((a, b) => {
      return mostRatingsFirst ? b.num_ratings - a.num_ratings : a.num_ratings - b.num_ratings;
    });
    setUsers(sortedUsers);
  };

  return (
    <div className="container pt-5 pb-5">
      <div class="px-4 pt-5 my-5 text-center border-bottom">
        <h1 class="display-4 fw-bold">All Users of the collection</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">Know more about the collection users and their ratings</p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <Button className="btn btn-outline-section btn-lg" href={"#users"}>See All Users</Button>
          </div>
        </div>
        <div class="overflow-hidden mh">
          <img src="/screenshot.png" class="img-fluid border rounded-3 shadow-lg mb-4" alt="Example image" width="900" height="500" loading="lazy"/>
        </div>
      </div>
      <h2 className="title text-center pb-5" id="users">Users</h2>
      <div className="container mb-3">
      <DropdownButton title="Sort Users" variant="light">
        <Dropdown.Item onClick={() => sortByName(true)}>Sort by Name A-Z</Dropdown.Item>
        <Dropdown.Item onClick={() => sortByName(false)}>Sort by Name Z-A</Dropdown.Item>
        <Dropdown.Item onClick={() => sortByAge(true)}>Sort by Age Youngest-Oldest</Dropdown.Item>
        <Dropdown.Item onClick={() => sortByAge(false)}>Sort by Age Oldest-Youngest</Dropdown.Item>
        <Dropdown.Item onClick={() => sortByRatings(true)}>Sort by Ratings Highest-Lowest</Dropdown.Item>
        <Dropdown.Item onClick={() => sortByRatings(false)}>Sort by Ratings Lowest-Highest</Dropdown.Item>
      </DropdownButton>
      </div>
      <CardGroup>
        <Row xs={1} md={2} className="d-flex justify-content-around">
          {users && users.map((user) => {
            return (
            <UserCard 
              key={user._id} 
              {...user}
            />
            );
          })}
        </Row>
      </CardGroup>
    </div>
  )
}