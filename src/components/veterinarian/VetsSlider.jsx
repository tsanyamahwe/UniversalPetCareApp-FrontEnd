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
                                src={
                                    vet.photo ? `data:image/png;base64, ${vet.photo}` : placeholderImage
                                }
                                alt={"photo"}
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "50%",
                                    objectFit: "contain"
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
                            <p>
                                <span className='text-info'>
                                    Dr. {`${vet.firstName} ${vet.lastName}`} is a {""}{vet.specialization} {""}
                                </span>
                                With 8 years of veterinary experience, he specializes in small animal surgery and 
                                emergency medicine. He earned his Doctor of Veterinary Medicine degree from Texas 
                                A&M University and has since dedicated his career to providing compassionate care 
                                for cats and dogs. Outside the clinic, he enjoys photography and spending time 
                                with his three cats.
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
