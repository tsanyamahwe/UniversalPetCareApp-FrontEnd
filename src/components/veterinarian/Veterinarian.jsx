import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import {Card, Col, Container, Row } from 'react-bootstrap';
import UserImage from '../common/UserImage';
import { BsFillArrowRightSquareFill } from 'react-icons/bs';
import RatingStars from '../rating/RatingStars';
import Review from '../review/Review';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import Rating from '../rating/Rating';
import { getUserById } from '../user/UserService';

const Veterinarian = () => {
    const[veterinarian, setVeterinarian] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const{vetId} = useParams();
    
    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();
    
    const getUser = async () => {
        setIsLoading(true);
        try {
            console.log("The vetId :", vetId);
            const result = await getUserById(vetId);
            console.log("The response :", result);
            setVeterinarian(result.data);
            setIsLoading(false);
        } catch (error) {
            console.error("The error message :", error);
            setErrorMessage(error.result.data.message);
            setShowErrorAlert(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, [vetId]);

    if(isLoading){
        return <h1>Loading...</h1>;
    };

    if (showErrorAlert) {
        return (
            <Container>
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            </Container>
        );
    };

    if (!veterinarian) {
        return (
            <Container>
                <div className="alert alert-warning">
                    Veterinarian not found
                </div>
            </Container>
        );
    };

  return (
    <Container>
        {veterinarian && (
            <Card>
                <Row>
                    <Col>
                        <UserImage
                            userId={veterinarian.id}
                            userPhoto={veterinarian.photo}
                            altText={`${veterinarian.firstName}'s photo`}
                        />
                    </Col>
                    <Col>
                        <Link to={"/doctors"}><BsFillArrowRightSquareFill/>back to veterinarians</Link>
                    </Col>
                </Row>
                <Card.Body>
                    <Card.Title>Dr. {veterinarian.firstName} {veterinarian.lastName}</Card.Title>
                    <Card.Title>Specialization: {veterinarian.specialization}</Card.Title>
                    {veterinarian.averageRating > 0 && (
                        <Card.Text className='rating-stars'>
                            Ratings: (
                                {veterinarian.averageRating > 0 ? Number(veterinarian.averageRating.toFixed(1)) : "0.0"}
                            )stars
                            <RatingStars rating={veterinarian.averageRating}/> rated by (
                                {veterinarian.totalReviewers || 0}{" "}
                                {veterinarian.totalReviewers === 1 ? "person" : "people"}){" "} 
                        </Card.Text>
                    )}
                    <Link to={`/book-appointment/${veterinarian.id}/new-appointment`} className='link'>Book Appointment</Link>
                    <hr/>
                    <p className='about'>About Dr. {veterinarian.firstName} {veterinarian.lastName}{" "}</p>
                    <p>With 8 years of veterinary experience, he specializes in small animal surgery and emergency medicine.
                    He earned his Doctor of Veterinary Medicine degree from Texas A&M University and has since dedicated his
                    career to providing compassionate care for cats and dogs. Outside the clinic, he enjoys photography and 
                    spending time with his three cats.</p>
                    <hr/>
                    <Rating vetId={vetId} onReviewSubmit={null}/>
                    <h4 className='text-center mb-4'>Reviews</h4>
                    <hr/>
                    {/*Render paginated reviews*/}
                    {veterinarian && veterinarian.reviews.length > 0 ?(
                        veterinarian.reviews.map((review) => (
                            <Review
                                key={review.id}
                                review={review}
                                userType={veterinarian.userType}
                            />
                        ))
                    ):(
                        <p>No reviews available yet</p>
                    )}
                </Card.Body>
            </Card>
        )}
    </Container>
  )
}

export default Veterinarian
