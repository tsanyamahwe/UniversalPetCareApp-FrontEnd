import React, { useEffect, useState } from 'react'
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { deleteReview, getReviewByAppointmentId } from './ReviewService';
import { Alert, Spinner } from 'react-bootstrap';
import Rating from '../rating/Rating';
import Review from './Review';

const AppointmentReviewManager = ({appointmentId, veterinarianId, onReviewAction}) => {
    const[review, setReview] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const[mode, setMode] = useState('view');

    const{successMessage, errorMessage, setSuccessMessage, setErrorMessage, showSuccessAlert, showErrorAlert, setShowSuccessAlert, setShowErrorAlert} = UseMessageAlerts();

    const fetchReview = async () => {
        setIsLoading(true);
        try {
            const existingReview = await getReviewByAppointmentId(appointmentId);
            setReview(existingReview);
            setMode('view');
        } catch (error) {
            if(error.response?.status === 404){
                setReview(null);
                setMode('submit');
            }else{
                setErrorMessage(error.response?.data?.message || "Failed to fetch review status.");
                setShowErrorAlert(true);
            }
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [appointmentId]);

    const handleReviewSubmitted = () => {
        setSuccessMessage("Review operation successful!");
        setShowSuccessAlert(true);
        fetchReview();
        if(onReviewAction){
            onReviewAction();
        }
    };

    const handleEditClick = (reviewData) => {
        setReview(reviewData);
        setMode('edit');
    };

    const handleDeleteClick = async (reviewId) => {
        if(window.confirm("Are you sure you want to delete this review?")){
            try{
                const response = await deleteReview(reviewId);
                setSuccessMessage(response.message);
                setShowSuccessAlert(true);
                fetchReview();
                if(onReviewAction){
                    onReviewAction();
                }
            }catch(error){
                setErrorMessage(error.response?.data?.message || "Failed to delete the review");
                setShowErrorAlert(true);
            }
        }
    };

    if(isLoading){
        return <Spinner animation='border' size='sm'/>;
    }

    if(mode === 'submit' || mode === 'edit'){
        return(
            <Rating
                veterinarianId={veterinarianId}
                appointmentId={appointmentId}
                initialReviewData={review}
                onReviewSubmit={handleReviewSubmitted}
            />
        );
    };

    if(mode === 'view' && review){
        return(
            <div>
                {showErrorAlert && (<Alert variant='danger'>{errorMessage}</Alert>)}
                {showSuccessAlert && (<Alert variant='success'>{successMessage}</Alert>)}
                <Review
                    review={review}
                    userType={'PATIENT'}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            </div>
        );
    };

  return (
    <Alert variant='info'>This appointment is not eligible for a review at this time</Alert>
  );
};

export default AppointmentReviewManager;
