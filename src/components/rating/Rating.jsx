import React, { useState } from 'react'
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import {Button, Form} from 'react-bootstrap';
import {FaStar} from 'react-icons/fa';
import AlertMessage from '../common/AlertMessage';

const Rating = ({veterinarianId, onReviewSubmit}) => {
    const[hover, setHover] = useState(null);
    const[rating, setRating] = useState(null);
    const[feedback, setFeedback] = useState(null);

    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();

    /*const handleInputChange = (e) => {
        const{name, value} = e.target;
        setReviewInfo((previousState) => ({
            ...previousState, [name]: value,
        }));
    };*/

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewInfo = {
            rating: rating,
            feedback: feedback,
        };

        try {
            const response = await addReview(veterinarianId, reviewerId, reviewInfo)
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
        <Form>
            <h5>Rate this doctor:</h5>
            <div className='mb-2'>
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return(
                        <Form.Label key={index} className='me-1'>
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
                                    ratingValue <= (hover || rating) ? "#ff01c7" : "#e4e5e7"
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
                    rows={4}
                    value={feedback || ''}
                    required
                    onChange={handleFeedbackChange}
                    placeholder='Leave a feedback messsage'
                />
            </div>
            <div className='mt-2'>
                <Button variant='outline-primary'>Submit Review</Button>
            </div>
            <p>You have rated this doctor with <span style={{color: "orange"}}>{rating} stars</span></p>
        </Form>      
    </React.Fragment>
  )
}

export default Rating
