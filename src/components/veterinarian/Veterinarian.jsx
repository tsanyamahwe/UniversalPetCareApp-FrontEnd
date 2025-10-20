import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import {Alert, Card, Col, Container, Row } from 'react-bootstrap';
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
import { findEligibleAppointment } from '../review/ReviewService';

const Veterinarian = () => {
    const[veterinarian, setVeterinarian] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const[currentPage, setCurrentPage] = useState(1);
    const[reviewPerPage] = useState(4);
    const[eligibleAppointment, setEligibleAppointment] = useState(null);
    const[existingReview, setExistingReview] = useState(null);

    const userId = localStorage.getItem("userId");
    const{vetId} = useParams();
    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();
    
     useEffect(() => {
        getUser();
    }, [vetId, userId]);

    const getUser = async () => {
        setIsLoading(true);
        try {
            const result = await getUserById(vetId);
            setVeterinarian(result.data);
            if(userId){
                await checkEligibleAppointment();
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setErrorMessage(error.result?.data?.message || 'An error occurred');
            setShowErrorAlert(true);
            setIsLoading(false);
        }
    };

    const checkEligibleAppointment = async () => {
        try {
            const response = await findEligibleAppointment(userId, vetId);
            console.log("Eligible appointment response: ", response);
            if(response && response.data){
                console.log("Eligible appointment found: ", response.data);
                setEligibleAppointment(response.data);
            }else{
                console.log("No eligible appointment found");
                setEligibleAppointment(null);
            }
        } catch (error) {
            console.log("Error checking eligible appointment:", error);
            if(error.response && error.response.status === 404){
                console.error("No eligible appointment found");
                await checkExistingReview();
            }
            setEligibleAppointment(null);
        }  
    };

    const checkExistingReview = async () => {
        try{
            const userReview = veterinarian?.reviews?.find(review => review.patient?.id === parseInt(userId));
            if(userReview){
                console.log("Found existing review: ", userReview);
                setExistingReview(userReview);
            }else{
                setExistingReview(null);
            }
        }catch(error){
            console.log("Error checking existing review:", error);
            setExistingReview(null);
        }
    };

    const handleReviewSubmitted = () => {
        getUser();
    };

    if(isLoading){
        return(
            <div>
                <LoadSpinner/>
            </div>
        );
    };

    if(showErrorAlert) {
        return (
            <Container>
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            </Container>
        );
    };

    if(!veterinarian) {
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
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
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
                    <p className='justified-content'>
                        {veterinarian.bio || 'No biography available for this veterinarian.'}
                    </p>
                    <hr/>
                    {userId && eligibleAppointment ? (
                        <Rating 
                            veterinarianId={veterinarian.id} 
                            appointmentId={eligibleAppointment.id}
                            onReviewSubmit={handleReviewSubmitted}
                        />
                    ):userId && !eligibleAppointment ? (
                        <Alert variant='info' style={{ textAlign: 'justify' }}>
                            You can leave a review after completing an appointment with Dr. {veterinarian.firstName} {veterinarian.lastName},
                            or you may have already reviewed your completed appointment.
                        </Alert>
                    ):(
                        <Alert>
                            Please <Link to="/login">Log in</Link> to leave a review after your appointment.
                        </Alert>
                    )}
                    
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
                        <p className='text-center text-muted'>No reviews available yet. Be the first to leave a review!</p>
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
