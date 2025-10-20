import React from 'react';
import RatingStars from '../rating/RatingStars';
import {Carousel, Col, Row, Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import placeholderImage from "../../assets/images/placeholder.jpg"

const VetsSlider = ({vets}) => {
  return (
    <main>
        <Carousel interval={5000} indicators={true} controls={true}>
            {vets && vets.map((vet, index) => (
                <Carousel.Item key={index}>
                    <Row className='align-items-center'>
                        <Col xs={12} md={4} className='text-center'>
                            <Card.Img
                                src={vet.photo ? `data:image/png;base64, ${vet.photo}` : placeholderImage}
                                alt={`Dr. ${vet.firstName} ${vet.lastName}`}
                                style={{
                                    width: "200px", height: "200px", borderRadius: "50%", 
                                    objectFit: "cover", objectPosition: "center", border: "2px solid #e5e7eb", 
                                    backgroundColor: "#f3f4f6", display: "block", margin: "0 auto"
                                }}
                            />
                        </Col>
                        <Col>
                            <div>
                                <RatingStars rating={vet.averageRating}/>
                            </div>
                            <div>
                                <p className='text-success'>
                                    Dr. {`${vet.firstName} ${vet.lastName}`}
                                </p>
                            </div>
                            <p>{vet.specialization}</p>
                            <p className='text-muted' style={{textAlign: "justify", marginRight: "3rem"}}>
                                {vet.bio
                                    ? vet.bio
                                    : `Dr. ${vet.firstName} ${vet.lastName} is a ${vet.specialization?.toLowerCase() || "veterinarian"} who provides compassionate care for pets.`
                                }
                            </p>
                            <p>
                                <Link 
                                    className='me-3 link-2'
                                    to={`/vet-reviews/${vet.id}/veterinarian`}>
                                    What are people saying about:
                                </Link>
                                Dr. {`${vet.firstName} ${vet.lastName}`}
                            </p>
                            <div>
                                <Link className='me-3' to={"/doctors"}>
                                    Meet All Veterinarians
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Carousel.Item>
            ))}
        </Carousel>
    </main>
  );
};

export default VetsSlider;
