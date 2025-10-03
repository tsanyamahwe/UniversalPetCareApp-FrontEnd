import React, { useState } from 'react';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import {Button, Card, Container, Form} from 'react-bootstrap';
import AlertMessage from '../common/AlertMessage';
import ProcessSpinner from '../common/ProcessSpinner';
import { requestPasswordReset } from './AuthService';

const PasswordResetRequest = () => {
    const[email, setEmail] = useState("");
    const[isProcessing, setIsProcessing] = useState(false);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setIsProcessing(true);
        try {
            const response = await requestPasswordReset(email);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            setEmail("");
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
        setIsProcessing(false);
    }
    
  return (
    <Container className='d-flex align-items-center justify-content-center mt-5' style={{marginTop:"100px"}}>
        <Card style={{maxWidth: "600px"}} className='w-100'>
            {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}
            {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
            <Card.Body>
                <Card.Title>Password Reset Request</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId="email">
                        <Form.Label>Enter your email address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='enter email..'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                //required
                            />
                            <Form.Text className='text-muted'>
                                We will send a password reset link to your email.
                            </Form.Text>
                    </Form.Group>
                    <Button variant='outline-info' type='submit'>
                        {isProcessing ? (
                            <ProcessSpinner message='sending verification link, please wait..'/>
                        ):(
                            "Send Link"
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default PasswordResetRequest;
