import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { deleteUserAccount, getUserById } from './UserService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { deleteUserPhoto } from '../photo/PhotoUploaderService';
import AlertMessage from '../common/AlertMessage';
import Review from '../review/Review';
import UserAppointments from '../appointment/UserAppointments';

const UserDashboard = () => {
    const[user, setUser] = useState(null);
    const[appointments, setAppointments] = useState([]);
    const userId = 14;
    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await getUserById(userId);
                setUser(result.data);
                setAppointments(result.data.appointments);
            } catch (error) {
                setErrorMessage(error.response.data.message);
                setShowErrorAlert(true);
                console.error(error.message);
            }
        };
        getUser();
    }, [userId]);

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
            console.log("The response from the delete account: ", response);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
        } catch (error) {
            console.log("The response from the delete account: ", error);
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    }

  return (
    <Container className='mt-2 user-dashboard'>
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
            <Tabs className='mb-2' justify>
                <Tab eventKey='profile' title={<h5>Profile</h5>}>
                    {user && (
                        <UserProfile
                            user={user}
                            handlePhotoRemoval={handlePhotoRemoval}
                            handleDeleteAccount={handleDeleteAccount}
                        />
                    )}
                </Tab>
                <Tab eventKey='status' title={<h5>Appointments</h5>}>

                </Tab>
                <Tab eventKey='appointments' title={<h5>Appointment Details</h5>}>
                    <Row>
                        <Col>
                            {user && (
                            <React.Fragment>
                                {appointments && appointments.length > 0 ? (
                                    <UserAppointments user={user} appointments={appointments}/>
                                ):(
                                    <p>No data</p>
                                )}
                            </React.Fragment>
                            )}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey='reviews' title={<h5>Reviews</h5>}>
                    <Container  className='d-flex justify-content-center align-items-center'>
                        <Card className='mt-1 mb-1 review-card'>
                            <h5 className='text-center mb-2'>Your Reviews</h5>
                            <hr/>
                            <Row>
                                <Col>
                                    {user && user.reviews && user.reviews.length > 0 ? (
                                        user.reviews.map((review, index) => (
                                            <Review key={index} review={review}/>
                                        ))
                                    ):(<p>No reviews found</p>)}
                                </Col>
                            </Row>
                        </Card>
                    </Container>
                </Tab>
            </Tabs>    
    </Container>
  )
}

export default UserDashboard;
