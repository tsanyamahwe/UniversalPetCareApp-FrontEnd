import React, { useState } from 'react';
import { Card, Container, Form, Row, Col, Button } from 'react-bootstrap';
import ProcessSpinner from '../common/ProcessSpinner';
import AlertMessage from '../common/AlertMessage';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Link } from 'react-router-dom';
import VetSpecializationSelector from '../veterinarian/VetSpecializationSelector';
import { userRegistration } from './UserService';

const UserRegistration = () => {
    const[user, setUser] = useState({
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

    const handleInputChange = (event) => {
        const{name, value} = event.target;
        setUser((previousState) => ({
            ...previousState, [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that veterinarians have selected a specialization
        if (user.userType === "VET" && !user.specialization) {
            setErrorMessage("Please select a veterinarian specialization.");
            setShowErrorAlert(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await userRegistration(user);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            setIsProcessing(false);
            handleReset();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
            setShowErrorAlert(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setUser({
            firstName: "",
            lastName: "",
            gender: "",
            phoneNumber: "",
            email: "",
            password: "",
            userType: "",
            specialization: "",
        });
    };

    // Clear specialization when user type changes away from VET
    const handleUserTypeChange = (event) => {
        const newUserType = event.target.value;
        setUser((previousState) => ({
            ...previousState,
            userType: newUserType,
            specialization: newUserType === "VET" ? previousState.specialization : "",
        }));
    };

    console.log('Current user state:', user); // Debug log

  return (
    <Container className='mt-5'>
        <Row className='justify-content-center'>
            <Col xs={12} md={9} lg={6}>
                <Form onSubmit={handleSubmit}>
                    <Card className='shadow mb-5'>
                        <Card.Header className='text-center'>User Registration Form</Card.Header>
                        <Card.Body>
                            <fieldset>
                                <legend><h5>Full Name</h5></legend>
                                <Row>
                                    <Col xs={6} className='mb-2 mb-sm-0'>
                                        <Form.Control
                                            type='text'
                                            name='firstName'
                                            placeholder='First Name'
                                            value={user.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                    <Col xs={6} className='mb-2 mb-sm-0'>
                                        <Form.Control
                                            type='text'
                                            name='lastName'
                                            placeholder='Last Name'
                                            value={user.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </fieldset>
                            
                            {/*Gender Selector*/}
                            <Form.Group as={Row} controlId='gender' className='mb-3'>
                                <Col>
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control
                                         as='select'
                                         name='gender'
                                         required
                                         value={user.gender}
                                         onChange={handleInputChange}>
                                        <option value=''>select gender</option>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                        <option value='Others'>Others</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            
                            <fieldset>
                                <legend><h5>Contact Information</h5></legend>
                                <Row>
                                    <Col sm={6} className='mb-2 mb-sm-0'>
                                        <Form.Control
                                            type='email'
                                            name='email'
                                            placeholder='email address'
                                            value={user.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                    <Col sm={6} className='mb-2 mb-sm-0'>
                                        <Form.Control
                                            type='text'
                                            name='phoneNumber'
                                            placeholder='mobile phone number'
                                            value={user.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Row>
                            </fieldset>
                            
                            {/*Password*/}
                            <Form.Group as={Row} controlId='password' className='mb-3'>
                                <Col>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                       type='password'
                                       name='password'
                                       required
                                       placeholder='set your password'
                                       value={user.password}
                                       onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                            
                            {/*Account Type*/}
                            <Form.Group as={Row} controlId='user-type' className='mb-3'>
                                <Col>
                                    <Form.Label>Account Type</Form.Label>
                                    <Form.Control
                                        as='select'
                                        name='userType'
                                        required
                                        value={user.userType}
                                        onChange={handleUserTypeChange}>
                                            <option value=''>select account type</option>
                                            <option value='VET'>I am a Veterinarian</option>
                                            <option value='PATIENT'>I am a pet owner</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            
                            {/*Vet Specialization - Only show for VET users*/}
                            {user.userType === "VET" && (
                                <Form.Group as={Row} className='mb-3'>
                                    <Col>
                                        <Form.Label>Veterinarian Specialization</Form.Label>
                                        <VetSpecializationSelector
                                            value={user.specialization}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>
                            )}
                            
                            {/*Action Buttons*/}
                            <div className='d-flex justify-content-center mb-3'>
                                <Button
                                    type='submit'
                                    variant='outline-primary'
                                    size='sm'
                                    className='me-2'
                                    disabled={isProcessing}>
                                    {isProcessing? (
                                        <ProcessSpinner message='Processing registration...'/>
                                    ):(
                                        "Register"
                                    )}
                                </Button>
                                <Button
                                    variant='outline-info'
                                    size='sm'
                                    onClick={handleReset}
                                    disabled={isProcessing}>
                                    Reset
                                </Button>
                            </div>
                            
                            {/*Error and Success Messages*/}
                            {showErrorAlert && (
                                <AlertMessage type='danger' message={errorMessage}/>
                            )}
                            {showSuccessAlert && (
                                <AlertMessage type='success' message={successMessage}/>
                            )}
                            
                            <div className='text-center'>
                                Registered already? {""}
                                <Link to={"/login"} style={{textDecoration: "none"}}>
                                    Login here
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Form>
            </Col>
        </Row>      
    </Container>
  );
};

export default UserRegistration;