import React, { useState } from 'react'
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import {Button, Form} from 'react-bootstrap';
import {FaStar} from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';
import { addReview } from '../review/ReviewService';

const Rating = ({veterinarianId, onReviewSubmit}) => {
    const[hover, setHover] = useState(null);
    const[rating, setRating] = useState(null);
    const[feedback, setFeedback] = useState("");

    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();

    const reviewerId = 4;

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        const reviewInfo = {
            stars: rating,
            feedback: feedback,
        };

        try {
            const response = await addReview(veterinarianId, reviewerId, reviewInfo);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            if(onReviewSubmit){
                onReviewSubmit();
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    }

  return (
    <React.Fragment>
        {showErrorAlert && (
            <AlertMessage type={"danger"} message={errorMessage}/>
        )}
        {showSuccessAlert && (
            <AlertMessage type={"sucess"} message={successMessage}/>
        )}
        <Form onSubmit={handleReviewSubmit}>
            <h5>Rate this doctor:</h5>
            <div className='mb-2'>
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return(
                        <Form.Label key={index} className='me-2 review rating-stars'>
                            <Form.Check
                                type='radio'
                                name='rating'
                                value={ratingValue}
                                onChange={() => handleRatingChange(ratingValue)}
                                checked={rating === ratingValue}
                                inline
                            />
                            <FaStar
                                size={18}
                                className='star'
                                color={
                                    ratingValue <= (hover || rating) ? "#f59e0b" : "#e4e5e7"
                                }
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
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
                <Button type='submit' variant='outline-primary'>Submit Review</Button>
            </div>
            <p>You have rated this doctor with {" "} <span style={{color: "orange"}}>{rating} stars</span></p>
        </Form>      
    </React.Fragment>
  )
};

export default Rating;
