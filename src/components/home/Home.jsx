import React from "react";
import vetcat from "../../assets/images/vetcat.jpg";
import vetdogcat from "../../assets/images/vetdogcat.jpg";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap"

const Home = () => {
  return (
    <Container className="home-container mt-5">
        <Row>
            <Col md={6} className="mb-3">
                 <Card>
                    <Card.Img variant="" src={vetcat} alt="About Us" className="hero-image"/>
                    <Card.Body>
                        <h2 className="text-info">About Us</h2>
                        <Card.Title>Comprehensive Care for your Furry Friends</Card.Title>
                        <Card.Text>
                            At Universal Pet Care, we belive every pet deserves the best. Our team of dedicated professionals is here to ensure your pet's health and happiness through 
                            comprehensive veterinary services. With decades of combined experience, our veterinrians and support staff are committed to providing personalized care tailored
                            to unique needs of each pet.
                        </Card.Text>
                        <Card.Text>
                              We offer a wide range of services, from preventative care and routine check-ups to advanced surgucal procedures and emergency care. Our state-of-the-art facility
                              is equipped with the latest in veterinary technology, which allows us to deliver high-quality care with precision and compassion. We offer a wide range of services
                              from preventative care and routine check-ups to advanced surgucal procedures and emergency care. Our state-of-the-art facility is equipped with the latest in 
                              veterinary technology, which allows us to deliver high-quality care with precision and. 
                        </Card.Text>
                        <Button variant='outline-info'>Meet Our Veterinarians</Button>
                    </Card.Body>
                 </Card>
            </Col>
            <Col md={6} className="mb-3">
                 <Card>
                     <Card.Img variant="" src={vetdogcat} alt="Our Services" className="hero-image"/>
                     <Card.Body>
                        <h2 className="text-info">Our Services</h2>
                        <Card.Title>What we do</Card.Title>
                        <ListGroup className='service-list'>
                            <ListGroup.Item>Veterinary Check-Ups</ListGroup.Item>
                            <ListGroup.Item>Emergency Surgery</ListGroup.Item>
                            <ListGroup.Item>Pet Vaccinations</ListGroup.Item>
                            <ListGroup.Item>Dental Care</ListGroup.Item>
                            <ListGroup.Item>Spaying and Neutering</ListGroup.Item>
                            <ListGroup.Item>And many more...</ListGroup.Item>
                        </ListGroup>
                        <Card.Text className="mt-3">
                            From routine check-ups to emergency surgery, our full range of veterinary services ensures your pet's health is in good hands.
                        </Card.Text>
                        <Button variant='outline-info'>Meet Our Veterinarians</Button>
                     </Card.Body>
                  </Card>
            </Col>
        </Row>
        <div className="card mb-5">
            <h4>
                What people are saying about {""}
                <span className="text-info">Universal Pet Care</span> Veterinarians
            </h4>
            <hr/>
            <p className="text-center">Here, we are going to be sliding veterinarians across</p>
        </div>
     
    </Container>
  );
}

export default Home
