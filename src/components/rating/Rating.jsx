import React, { useState } from 'react'
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import {Button, Form} from 'react-bootstrap';
import {FaStar} from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';
import { addReview, updateReview } from '../review/ReviewService';

const Rating = ({veterinarianId, appointmentId, initialReviewData, onReviewSubmit}) => {
    const[hover, setHover] = useState(null);
    const[rating, setRating] = useState(initialReviewData?.stars || null);
    const[feedback, setFeedback] = useState(initialReviewData?.feedback || "");
    const isEditMode = !!initialReviewData;
    const reviewId = initialReviewData?.id;

    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if(!rating){
            setErrorMessage("Please select a star rating.");
            setShowErrorAlert(true);
            return;
        }
      
        if(!isEditMode){
            const patientId = localStorage.getItem("userId");
            console.log("patientId from localStorage: ", patientId);
            console.log("typeof patientId: ", typeof patientId);
            console.log("veterinarianId: ", veterinarianId);
            console.log("appointmentId: ", appointmentId);

            if(!patientId){
                setErrorMessage("Please log in to submit a review");
                setShowErrorAlert(true);
                return;
            }
        }

        const reviewInfo = {
            stars: rating,
            feedback: feedback,
        };

        try {
            let response; 
            if(isEditMode){
                response = await updateReview(reviewId, reviewInfo);
            }else{
                const patientId = localStorage.getItem("userId");
                if(!patientId) throw {response: {data: {message: "Please log in to submit a review."}}};

                console.log("About to call addReview with:");
                console.log("- veterinarianId: ", veterinarianId);
                console.log("- patientId: ", patientId);
                console.log("- appointmentId: ", appointmentId);
                console.log("- reviewInfo: ", reviewInfo);
                
                 response = await addReview(veterinarianId, patientId, appointmentId, reviewInfo);
            }
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);

            if(!isEditMode){
                setRating(null);
                setFeedback("");
            }
            
            if(onReviewSubmit){
                onReviewSubmit();
            }
        } catch (error) {
            const errorData = error.response?.data;
            if(errorData?.status === 401){
                setErrorMessage("Please login to submit a review");
            }else{
                setErrorMessage(errorData?.message || "An unknown error occured");
            }
            setShowErrorAlert(true);
        }
    }

  return (
    <React.Fragment>
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
        <Form onSubmit={handleReviewSubmit}>
            <h5>{isEditMode ? 'Edit Your Review' : 'Rate this doctor:'}</h5>
            <div className='mb-2'>
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return(
                        <Form.Label 
                            key={index} 
                            className='me-2 review rating-stars'
                            onClick={() => handleRatingChange(ratingValue)}
                        >
                            <Form.Check
                                type='radio'
                                name='rating'
                                value={ratingValue}
                                checked={rating === ratingValue}
                                readOnly
                                inline
                                className='visually-hidden-radio'
                            />
                            <FaStar
                                size={18}
                                className='star'
                                color={
                                    ratingValue <= (hover || rating) ? "#f59e0b" : "#e4e5e7"
                                }
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                                style={{cursor: "pointer"}}
                            />
                        </Form.Label>
                    ) 
                })}
            </div>
            <div>
                <Form.Control 
                    as="textarea"
                    rows={2}
                    value={feedback || ''}
                    required
                    onChange={handleFeedbackChange}
                    placeholder='Leave a feedback messsage'
                />
            </div>
            <div className='mt-2'>
                <Button type='submit' variant='outline-primary'>
                    {isEditMode ? 'Update Review' : 'Submit Review'}
                </Button>
            </div>
            <p>You have rated this doctor with {" "} <span style={{color: "orange", fontWeight: "bold"}}>{rating || 0} stars</span></p>
        </Form>      
    </React.Fragment>
  )
};

export default Rating;
