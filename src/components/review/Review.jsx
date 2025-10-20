import React from 'react';
import { UserType } from '../utils/Utilities';
import UserImage from '../common/UserImage';
import RatingStars from '../rating/RatingStars';
import { Button } from 'react-bootstrap';

const Review = ({review, userType, onEdit, onDelete}) => {
    const displayName = 
        userType === UserType.PATIENT 
            ? `You rated Dr. ${review.veterinarianName}`
            : `Reviewed by: ${review.patientName}`;
    return (
        <div className='mb-4'>
            <div className='d-flex align-item-center me-5'>
                {userType === UserType.PATIENT ? (
                    <UserImage 
                        userId={review.veterinarianId} 
                        userPhoto={review.veterinarianPhoto}
                    />
                ):(
                    <UserImage 
                        userId={review.patientId} 
                        userPhoto={review.patientPhoto}
                    />
                )}
                <div className='ms-4'>
                    <div>
                        <h5 className='title ms-3'>
                            <RatingStars rating={review.stars}/>
                        </h5>
                    </div>
                    <div className='mt-4'>
                        <p className='review-text ms-4'>{review.feedback}</p>
                    </div>
                    <div>
                        <p className='ms-4'>{displayName}</p>
                    </div>
                </div>  
            </div> 
            {userType === UserType.PATIENT && (
                <div>
                    <Button
                        variant='warning'
                        size='sm'
                        className='me-2'
                        onClick={() => onEdit(review)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant='danger'
                        size='sm'
                        onClick={() => onDelete(review.id)}
                    >
                        Delete
                    </Button>
                </div>
            )}
            <hr/>   
        </div>
    );
};

export default Review;
