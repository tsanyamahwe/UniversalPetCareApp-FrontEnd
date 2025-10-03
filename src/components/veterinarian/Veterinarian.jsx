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
import AlertMessage from '../common/AlertMessage';
import Paginator from '../common/Paginator';
import LoadSpinner from '../common/LoadSpinner';

const Veterinarian = () => {
    const[veterinarian, setVeterinarian] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const{vetId} = useParams();
    const[currentPage, setCurrentPage] = useState(1);
    const[reviewPerPage] = useState(4);
    
    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();
    
    const getUser = async () => {
        setIsLoading(true);
        try {
            const result = await getUserById(vetId);
            setVeterinarian(result.data);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setErrorMessage(error.result.data.message);
            setShowErrorAlert(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, [vetId]);

    if(isLoading){
        return(
            <div>
                <LoadSpinner/>
            </div>
        );
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
    
    const indexOfLastReview = currentPage * reviewPerPage; 
    const indexOfFirstReview = indexOfLastReview - reviewPerPage;
    const currentReviews = veterinarian.reviews.slice(indexOfFirstReview, indexOfLastReview) || [];

  return (
    <Container className='d-flex justify-content-center align-items-center mt-4'>  
        {showErrorAlert && (
            <AlertMessage type={"danger"} message={errorMessage}/>
        )}
        {veterinarian && (
            <Card className='review-card mt-2'>
                <Row>
                    <Col>
                        <UserImage
                            userId={veterinarian.id}
                            userPhoto={veterinarian.photo}
                            altText={`${veterinarian.firstName}'s photo`}
                        />
                    </Col>
                    <Col>
                        <Link to={"/doctors"}><BsFillArrowRightSquareFill/> "Back to Veterinarians"</Link>
                    </Col>
                </Row>
                <Card.Body>
                    <Card.Title>Dr. {veterinarian.firstName} {veterinarian.lastName}</Card.Title>
                    <Card.Text>Specialization: {veterinarian.specialization}</Card.Text>
                    {veterinarian.averageRating > 0 && (
                        <Card.Text className='rating-stars'>
                            Ratings: (
                                {veterinarian.averageRating > 0 ? Number(veterinarian.averageRating.toFixed(1)) : "0.0"}
                            )stars
                            <RatingStars rating={veterinarian.averageRating}/> rated by (
                                {veterinarian.totalReviewer || 0}{" "}
                                {veterinarian.totalReviewer === 1 ? "person" : "people"}){" "} 
                        </Card.Text>
                    )}
                    <Link to={`/book-appointment/${veterinarian.id}/new-appointment`} className='link'>Book Appointment</Link>
                    <hr/>
                    <p className='about'>About Dr. {veterinarian.firstName} {veterinarian.lastName}{" "}</p>
                    <p className='justified-content'>With 8 years of veterinary experience, he specializes in small animal surgery and emergency medicine.
                    He earned his Doctor of Veterinary Medicine degree from Texas A&M University and has since dedicated his
                    career to providing compassionate care for cats and dogs. Outside the clinic, he enjoys photography and 
                    spending time with his three cats.</p>
                    <hr/>
                    <Rating veterinarianId={veterinarian.id} onReviewSubmit={null}/>
                    <h4 className='text-center mb-4'>Reviews</h4>
                    <hr/>
                    {/*Render paginated reviews*/}
                    {currentReviews && currentReviews.length > 0 ?(
                        currentReviews.map((review) => (
                            <Review
                                key={review.id}
                                review={review}
                                userType={veterinarian.userType}
                            />
                        ))
                    ):(
                        <p>No reviews available yet</p>
                    )}
                    <Paginator
                        itemsPerPage={reviewPerPage}
                        totalItems={veterinarian.reviews.length}
                        paginate={setCurrentPage}
                        currentPage={currentPage}
                    >
                    </Paginator>
                </Card.Body>
            </Card>
        )}
    </Container>
  );
};

export default Veterinarian;
