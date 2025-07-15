import React, { useEffect, useState } from 'react'
import { Col, Container, Tab, Tabs } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { deleteUserAccount, getUserById } from './UserService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { deleteUserPhoto } from '../photo/PhotoUploaderService';
import AlertMessage from '../common/AlertMessage';

const UserDashboard = () => {
    const[user, setUser] = useState(null);
    const userId = 6;
    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await getUserById(userId);
                setUser(result.data);
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
    <Container>
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
        <Col md={12}>
            <Tabs>
                <Tab eventKey='profile' title={<h5>Profile</h5>}>
                    {user && (
                        <UserProfile
                            user={user}
                            handlePhotoRemoval={handlePhotoRemoval}
                            handleDeleteAccount={handleDeleteAccount}
                        />
                    )}
                </Tab>
                <Tab></Tab>
                <Tab></Tab>
                <Tab></Tab>
            </Tabs>    
        </Col>  
    </Container>
  )
}

export default UserDashboard;
