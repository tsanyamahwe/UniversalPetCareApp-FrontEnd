import React from 'react';
import { Accordion, Card, Col, Placeholder } from 'react-bootstrap';
import placeholder from "../../assets/images/placeholder.jpg";
import { Link } from 'react-router-dom';
import UserImage from '../common/UserImage';

const VeterinarianCard = ({vet}) => {
  return (
     <Col key={vet.id} className="mb-3 xs={12}">
         <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <div className="d-flex align-items-center">
                        <Link>
                           <UserImage userId={vet.id} userPhoto={vet.photo} placeholder={placeholder}/>
                        </Link>
                    </div>
                    <div className='flex-grow-2 ml-3 px-5'>
                        <Card.Title className="title">Dr. {vet.firstName} {vet.lastName}</Card.Title>
                        <Card.Title><h6>{vet.specialization}</h6></Card.Title>
                        <Card.Text className="review rating-stars">Reviews: Some stars</Card.Text>
                        <Link to={`/book-appointment/${vet.id}/new-appointment`} className="link">Book Appointment</Link>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                     <div>
                        <Link to={`veterinarian/${vet.id}/veterinarian`} className="link-2">See what people say about: </Link>{""}
                        <span className='margin-left-space'>Dr. {vet.firstName}</span>
                     </div>
                </Accordion.Body>                
            </Accordion.Item>
         </Accordion>      
     </Col>
  );
};

export default VeterinarianCard;
