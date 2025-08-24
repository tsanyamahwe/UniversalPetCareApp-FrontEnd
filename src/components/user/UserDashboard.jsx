import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
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

const UserDashboard = () => {
    const[user, setUser] = useState(null);
    const[appointments, setAppointments] = useState([]);
    const[appointmentData, setAppointmentData] = useState();
    const userId = 17;
    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();
    const[activeKey, setActiveKey] = useState(() => {
        const storedActiveKey = localStorage.getItem("activeKey");
        return storedActiveKey ? storedActiveKey : "profile";
    });

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
            console.log("Here is the transform data: ", transformedData);
        }
    }, [user]);

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
        } catch (error) {
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
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
            <Tabs className='mb-1' justify activeKey={activeKey} onSelect={handleTabSelect}>
                <Tab eventKey='profile' title={<h5>Profile</h5>}>
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
                                                key={index} 
                                                review={review}
                                                userType={user.userType || UserType.PATIENT}
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
    </Container>
  )
}

export default UserDashboard;
