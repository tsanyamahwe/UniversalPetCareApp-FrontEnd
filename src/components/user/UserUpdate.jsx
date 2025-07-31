import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { getUserById,  updateUser } from './UserService';
import { Button, Card, Col, Container, Form } from 'react-bootstrap';
import VetSpecializationSelector from '../veterinarian/VetSpecializationSelector';
import ProcessSpinner from '../common/ProcessSpinner';
import AlertMessage from '../common/AlertMessage';

const UserUpdate = () => {
    const[userData, setUserData] = useState({
            firstName: "",
            lastName: "",
            gender: "",
            phoneNumber: "",
            email: "",
            password: "",
            userType: "",
            specialization: "",
    });

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();
    const[isProcessing, setIsProcessing] = useState(false);
    const{userId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await getUserById(userId);
                setUserData(data.data);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };
        getUserData();
    }, [userId]);

    const handleInputChange = (event) => {
        const{name, value} = event.target;
        setUserData((previousState) => ({
            ...previousState, [name]: value,
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const updatedUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            gender: userData.gender,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            userType: userData.userType,
            specialization: userData.specialization,
        };

        try {
            setIsProcessing(true);
            const response = await updateUser(updatedUserData, userId);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorAlert(true);
        }finally{
            setIsProcessing(false);
        }
    };

    const handleCancelEdit = () => {
        navigate(`/user-dashboard/${userId}/my-dashboard`);
    };

  return (
    <Container className='d-flex justify-content-center mt-5'>
        <Col md={6} >
            <Form onSubmit={handleUpdateSubmit}>
                <Card className='shadow mb-5'>
                    <Card.Header className='text-center mb-1'>Update User Information</Card.Header>
                    {showSuccessAlert && (
                        <AlertMessage type='success' message={successMessage}/>
                    )}
                    {showErrorAlert && (
                        <AlertMessage type='danger' message={errorMessage}/>
                    )}
                    <Card.Body>
                        <fieldset className='field-set'>
                            <legend><h5>Full Name</h5></legend>
                            <Form.Group as={Col} controlId='nameFields' className='mb-2 d-flex'>
                                <Form.Control
                                    type='text'
                                    name='firstName'
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    style={{ marginRight: "10px" }}
                                />
                                <Form.Control
                                    type='text'
                                    name='lastName'
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </fieldset>  
                        <Form.Group as={Col} controlId='gender' className='mb-2'>
                            <Form.Label className='legend'>Gender</Form.Label>
                            <Form.Control as='select' name='gender' value={userData.gender} onChange={handleInputChange}>
                                <option value=''>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Others'>Others</option>
                            </Form.Control>
                        </Form.Group>  
                        <Form.Group as={Col} controlId='gender' className='mb-2'>
                            <Form.Label className='legend'>User Type</Form.Label>
                            <Form.Control
                                type='text'
                                name='userType'
                                value={userData.userType}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Form.Group>
                        <fieldset className='field-set mb-2 mt-2'>
                            <legend><h5>Contact Information</h5></legend>
                            <Form.Group as={Col} controlId='emailPhoneFields' className='mb-2 d-flex'>
                                <Form.Control
                                    type='email'
                                    name='email'
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    style={{ marginRight: "10px"}}
                                    disabled
                                />
                                <Form.Control
                                    type='text'
                                    name='phoneNumber'
                                    placeholder='Mobile Contact'
                                    value={userData.phoneNumber}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </fieldset>  
                        {userData.userType === "VET" && (
                            <Form.Group controlId='specialization' className='mb-4'>
                                <Form.Label className='legend'>Specialization</Form.Label>
                                <VetSpecializationSelector
                                    onChange={handleInputChange}
                                    value={userData.specialization}
                                    userData={userData}
                                />
                            </Form.Group>
                        )}  
                        <div className='d-flex justify-content-center'>
                            <div className='mx-2'>
                            <Button
                                type='submit'
                                variant='outline-warning'
                                size='sm'
                                disabled={isProcessing}>
                                {isProcessing ? (
                                    <ProcessSpinner message='Processing update...'/>
                                ):(
                                    "Update"
                                )}
                            </Button>
                            </div>
                            <div className='mx-2'>
                                <Button
                                    variant='outline-info'
                                    size='sm'
                                    onClick={handleCancelEdit}>
                                    Back to profile
                                </Button>
                            </div>
                        </div>                
                    </Card.Body>                        
                </Card>
            </Form>
        </Col>      
    </Container>
  )
}

export default UserUpdate;
