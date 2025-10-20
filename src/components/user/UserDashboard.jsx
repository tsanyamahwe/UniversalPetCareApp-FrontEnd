import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { deleteUserAccount, getUserById } from './UserService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { deleteUserPhoto } from '../photo/PhotoUploaderService';
import AlertMessage from '../common/AlertMessage';
import Review from '../review/Review';
import UserAppointments from '../appointment/UserAppointments';
import { formatAppointmentStatus, UserType } from '../utils/Utilities';
import CustomPieChart from '../charts/CustomPieChart';
import NoDataAvailable from '../common/NoDataAvailable';
import { useParams } from 'react-router-dom';
import { logoutUser } from '../auth/AuthService';
import { deleteReview, getPatientAppointments } from '../review/ReviewService';
import Rating from '../rating/Rating';
import { useAuth } from '../auth/AuthContext';

const UserDashboard = () => {
    const[user, setUser] = useState(null);
    const[appointments, setAppointments] = useState([]);
    const[appointmentData, setAppointmentData] = useState();
    const[showEditModal, setShowEditModal] = useState(false);
    const[editingReview, setEditingReview] = useState(null);
    const[refreshKey, setRefreshKey] = useState(0);
    const[loading, setLoading] = useState(true);
    const[activeKey, setActiveKey] = useState(() => {
        const storedActiveKey = localStorage.getItem("activeKey");
        return storedActiveKey ? storedActiveKey : "profile";
    });

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();
    const{userId} = useParams();
    const {user: authUser, refreshUser} = useAuth();
    const currentUserId = localStorage.getItem("userId");
    const isCurrentUser = userId === currentUserId;

    const fetchAppointment = async (id) => {
        try {
            const result = await getPatientAppointments(id);
            setAppointmentData(result.data);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        }
    };

    const getUserAndAppointments = async () => {
        try {
            const result = await getUserById(userId);
            setUser(result.data);
            await fetchAppointment(userId);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
            console.error(error.message);
        }
    };

    useEffect(() => {
        getUserAndAppointments();
    }, [userId]);

    useEffect(() => {
        if(user && user.appointments){
            const statusCounts = user.appointments.reduce((acc, appoointment) => {
                const formattedStatus = formatAppointmentStatus(appoointment.status);
                if(!acc[formattedStatus]){
                    acc[formattedStatus] = {
                        name: formattedStatus,
                        value: 1,
                    };
                }else{
                    acc[formattedStatus].value += 1;
                }
                return acc;
            }, {});

            const transformedData = Object.values(statusCounts);
            setAppointmentData(transformedData);
            setAppointments(user.appointments);
        }
    }, [user]);

    const handleEditReview = (review) => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);

        setEditingReview(review);
        setShowEditModal(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if(window.confirm("Are you sure you want to delete this review?")){
            try {
                setShowSuccessAlert(false);
                setShowErrorAlert(false);

                const response = await deleteReview(reviewId);
                await getUserAndAppointments();

                setRefreshKey(prev => prev + 1);
                setSuccessMessage(response.message);
                setShowSuccessAlert(true);
            } catch (error) {
                setShowSuccessAlert(false);
                setErrorMessage(error.response?.data?.message || "Failed to delete the review");
                setShowErrorAlert(true);
            }
        }
    };

    const handleReviewUpdated = async () => {
        setShowSuccessAlert(false);
        setShowErrorAlert(false);

        setShowEditModal(false);
        setEditingReview(null);

        await getUserAndAppointments();

        setRefreshKey(prev => prev + 1);
        setSuccessMessage("Review updated successfully!");
        setShowSuccessAlert(true);   
    };

    const handlePhotoRemoval = async () => {
        try {
            const result = await deleteUserPhoto(user.photoId, user.id);
            setSuccessMessage(result.message);
            setShowSuccessAlert(true);
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorAlert(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await deleteUserAccount(userId);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            setTimeout(()=> {
                logoutUser();
            },5000);
        } catch (error) {
            console.error("Delete account error: ", error);
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    };

    const handleTabSelect = (key) => {
        setActiveKey(key);
        localStorage.setItem("activeKey", key);
    }

  return (
    <Container className='mt-2 user-dashboard' >
            <Tabs className='mb-1' justify activeKey={activeKey} onSelect={handleTabSelect}>
                <Tab eventKey='profile' title={<h5>Profile</h5>}>
                    {showErrorAlert && <AlertMessage type={"danger"} message={errorMessage}/>}
                    {showErrorAlert && <AlertMessage type={"success"} message={successMessage}/>}
                    {user && (
                        <UserProfile
                            user={user}
                            handlePhotoRemoval={handlePhotoRemoval}
                            handleDeleteAccount={handleDeleteAccount}
                        />
                    )}
                </Tab>
                <Tab eventKey='status' title={<h5>Appointments Overview</h5>}>
                    <Row>
                        <Col>
                            {appointmentData && appointmentData.length > 0 ? (
                                <CustomPieChart data={appointmentData}/>
                            ):(
                                <NoDataAvailable dataType={"Appointment Overview Data"}/>
                            )}
                            
                        </Col>
                    </Row>
                </Tab>
                {isCurrentUser && (
                    <Tab eventKey='appointments' title={<h5>Appointment Details</h5>}>
                        <Row>
                            <Col>
                                {user && (
                                <React.Fragment>
                                    {appointments && appointments.length > 0 ? (
                                        <UserAppointments user={user} appointments={appointments}/>
                                    ):(
                                        <NoDataAvailable dataType={"Appointment Data"}/>
                                    )}
                                </React.Fragment>
                                )}
                            </Col>
                        </Row>
                    </Tab>
                )}
                <Tab eventKey='reviews' title={<h5>Reviews</h5>}>
                    <Container  className='d-flex justify-content-center align-items-center'>
                        <Card className='mt-1 mb-1 review-card'>
                            <h5 className='text-center mb-2'>Your Reviews</h5>
                            <hr/>
                            <Row>
                                <Col>
                                    {user && user.reviews && user.reviews.length > 0 ? (
                                        user.reviews.map((review, index) => (
                                            <Review 
                                                key={`${review.id || index}-${refreshKey}`} 
                                                review={review}
                                                userType={user.userType || UserType.PATIENT}
                                                onEdit={handleEditReview}
                                                onDelete={handleDeleteReview}
                                            />
                                        ))
                                    ):(
                                        <NoDataAvailable dataType={"Review Data"}/>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    </Container>
                </Tab>
            </Tabs>  
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingReview && (
                        <Rating
                            veterinarianId={editingReview.veterinarianId}
                            appointmentId={editingReview.appointmentId}
                            initialReviewData={editingReview}
                            onReviewSubmit={handleReviewUpdated}
                        />
                    )}
                </Modal.Body>
            </Modal>  
    </Container>
  )
}

export default UserDashboard;
