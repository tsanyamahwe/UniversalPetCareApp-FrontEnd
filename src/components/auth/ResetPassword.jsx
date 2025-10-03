import React, { useEffect, useState } from 'react'
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import AlertMessage from '../common/AlertMessage';
import ProcessSpinner from '../common/ProcessSpinner';
import { validateToken, resetPassword } from './AuthService';
import { validatePassword } from '../utils/Utilities';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';

const ResetPassword = () => {
    const[newPassword, setNewPassword] = useState("");
    const[isProcessing, setIsProcessing] = useState(false);
    const[tokenStatus, setTokenStatus] = useState("PENDING");
    const[isPasswordReset, setIsPasswordReset] = useState(false);
    const[passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: [],
        requirements: {}
    });
    const[showPasswordStrength, setShowPasswordStrength] = useState(false);
    const[canReset, setCanReset] = useState(null);
    const[daysRemaining, setDaysRemaining] = useState(0);

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    useEffect(() => {
        if(token){
            validateToken(token)
            .then((response) => {
                setTokenStatus("VALID");
                if(response.canReset !== undefined){
                    setCanReset(response.canReset);
                    if(!response.canReset){
                        setDaysRemaining(response.daysRemaining || 0);
                        setErrorMessage(`Password was recently changed. Please wait ${response.daysRemaining} more days before resetting again.`);
                        setShowErrorAlert(true);
                    }
                }else{
                    setCanReset(true);
                }
            })
            .catch((error) => {
                //Handle different error scenarios
                if(error.response?.status === 425 || (error.response?.data && error.response.data.canReset === false)){
                    //This is reset restriction, not an invalid token
                    setTokenStatus("VALID");
                    setCanReset(false);
                    const days = error.response?.data?.daysRemaining || 0;
                    setDaysRemaining(days);
                    setErrorMessage(`Password was recently changed. Please wait ${days} more days before resetting again.`);
                    setShowErrorAlert(true);
                }else{
                    //This is actually an invalid token
                    setTokenStatus("INVALID");
                    setErrorMessage(error.response?.data?.message || error.response?.data?.error ||error.message || "Token validation failed");
                    setShowErrorAlert(true);
                }
            });
        }else{
            setTokenStatus("INVALID");
            setErrorMessage("No token provided");
            setShowErrorAlert(true);
        }
    }, [token, setErrorMessage, setShowErrorAlert]);

    const handlePasswordChange = (event) =>{
        const value = event.target.value;
        setNewPassword(value);
        //validate password in real-time
        const validation = validatePassword(value);
        setPasswordValidation(validation);
        setShowPasswordStrength(value.length > 0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //check if password reset is allowed
        if(canReset === false){
            setErrorMessage(`Password cannot be reset. Please wait ${daysRemaining} more days before resetting again`);
            setShowErrorAlert(true);
            return;
        }
        //validate password before submission
        const passwordCheck = validatePassword(newPassword);
        if(!passwordCheck.isValid){
            setErrorMessage(`Password validation failed: ${passwordCheck.errors.join('; ')}`);
            setShowErrorAlert(true);
            return;
        }
        setIsProcessing(true);
        try {
            const response = await resetPassword(token, newPassword);
            setSuccessMessage(response.message || "Password reset successful");
            setShowSuccessAlert(true);
            setNewPassword("");
            setIsPasswordReset(true);
            setShowPasswordStrength(false);
        } catch (error) {
            let errorMsg = "An unexpected error occurred";
            if(error.response?.status === 425){
                errorMsg = error.response.data?.message || error.response.data || "Password was recently changed. Please wait before resetting again.";
            }else if(error.response?.status === 400){
                errorMsg = error.response.data?.message || error.response.data || "Invalid or expired token";
            }else if(error.response?.data?.message){
                errorMsg = error.response.data.message;
            }
            else if(error.message){
                errorMsg = error.message;
            }
            setErrorMessage(errorMsg);
            setShowErrorAlert(true);
        }finally{
            setIsProcessing(false);
        }
    };

  return (
    <Container className='d-flex align-items-center justify-content-center mt-5' style={{marginTop:"100px"}}>
        <Card style={{maxWidth: "600px"}} className='w-100'>
            {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}
            {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
            {tokenStatus === "VALID" ? (
                <Card.Body>
                    <Card.Title>Reset Your Password</Card.Title>

                    {/*Show restrictions warning if password cannot be reset*/}
                    {canReset === false && (
                        <Alert variant="warning" className="mb-3">
                            <Alert.Heading>Password Reset Restricted</Alert.Heading>
                            <p>Your password was recently changed. For security reasons, you must wait {daysRemaining} more days before requesting another password reset</p>
                        </Alert>
                    )}

                    {/*Show success message if password was successfuly reset*/}
                    {isPasswordReset && (
                        <Alert variant = "success" className='mb-3'>
                            <Alert.Heading>Password Reset Complete</Alert.Heading>
                            <p>Your password has been successfully reset. You can now login with your new password</p>
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3' controlId="passwordInput">
                            <Form.Label>Set a new password</Form.Label>
                            <Form.Control
                                type='password'
                                name='newPassword'
                                required
                                placeholder='enter a new password'
                                value={newPassword || ""}
                                onChange={handlePasswordChange}
                                className={showPasswordStrength ? (passwordValidation.isValid ? 'is-valid' : 'is-invalid') : ''}
                                disabled={canReset === false || isPasswordReset}
                            />
                            {/*Password Strength Indicator*/}
                            <PasswordStrengthIndicator
                                password={newPassword}
                                showRequirements={showPasswordStrength}
                            />
                        </Form.Group>
                        <Button 
                            variant='outline-info' 
                            type='submit'
                            disabled={isProcessing || (showPasswordStrength && !passwordValidation.isValid)}
                            >
                            {isProcessing ? (
                                <ProcessSpinner message='resetting your password, please wait..'/>
                            ):(
                                "Reset Password"
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            ): tokenStatus === "PENDING" ? (
                <Card.Body>
                    <ProcessSpinner message='validating token, please wait..'/>
                </Card.Body>
            ):(
                <Card.Body>
                    <AlertMessage type={"danger"} message={"Invalid or expired link, process aborted. Please try again"}/>
                </Card.Body>
            )} 
        </Card>
    </Container>

  );
};

export default ResetPassword;
