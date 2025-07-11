import React, { useEffect, useState } from 'react'
import { Container, Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import UserProfile from './UserProfile';
import { getUserById } from './UserService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { deleteUserPhoto } from '../photo/PhotoUploaderService';

const UserDashboard = () => {
    const[user, setUser] = useState(null);
    //const{userId} = useParams();
    const userId = 1;
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
            //console.error(error.message);
        }
    };

  return (
    <Container>
        <Tabs>
            <Tab eventKey='profile' title={<h5>Profile</h5>}>
                {user && (
                    <UserProfile
                        user={user}
                        handlePhotoRemoval={handlePhotoRemoval}
                    />
                )}
            </Tab>
            <Tab></Tab>
            <Tab></Tab>
            <Tab></Tab>
        </Tabs>      
    </Container>
  )
}

export default UserDashboard
