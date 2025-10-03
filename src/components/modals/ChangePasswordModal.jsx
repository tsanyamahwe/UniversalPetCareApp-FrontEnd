import React, { useEffect, useState } from 'react';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Alert, Button, InputGroup, Modal } from 'react-bootstrap';
import { changeUserPassword } from '../user/UserService';
import AlertMessage from '../common/AlertMessage';
import { Form } from 'react-bootstrap';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { getPasswordChangeInfo } from '../auth/AuthService';
import { validatePassword } from '../utils/Utilities';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import ProcessSpinner from '../common/ProcessSpinner';

const ChangePasswordModal = ({userId, show, handleClose}) => {
    const[showPassword, setShowPassword] = useState(false);
    const[showPasswordStrength, setShowPasswordStrength] = useState(false);
    const[canChangePassword, setCanChangePassword] = useState(null);
    const[daysRemaining, setDaysRemaining] = useState(0);
    const[isProcessing, setIsProcessing] = useState(false);
    const[passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
   const[passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: [],
        requirements: {}
   })
    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    useEffect(() => {
        if(show && userId){
            handleReset(false);
            setShowErrorAlert(false);
            setErrorMessage("");
            getPasswordChangeInfo(userId)
                .then(response => {
                    setCanChangePassword(response.canChange);
                    const days = response.daysRemaining || 0;
                    setDaysRemaining(days);
                    if(!response.canChange && days > 0){
                        setErrorMessage(`Password was recently changed or user was restricted. Please wait ${daysRemaining} more days before resetting password.`);
                        setShowErrorAlert(true);
                    }else{
                        setShowErrorAlert(false);
                    }
                })
                .catch(error => {
                    setErrorMessage("Failed to check password change policy.");
                    setShowErrorAlert(true);
                    setCanChangePassword(false);
                })
        }else{
            setErrorMessage("No password provided");
            setShowErrorAlert(true);
        }
    }, [show, userId]);

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        setPasswords((previousState) => {
            const newState = {...previousState, [name]: value};
            if(name === 'newPassword'){
                const validation = validatePassword(value);
                setPasswordValidation(validation);
                setShowPasswordStrength(value.length > 0);
            }
            return newState;
        })
        setShowErrorAlert(false);
        setShowSuccessAlert(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const{currentPassword, newPassword, confirmNewPassword} = passwords;
        //Check restriction
        if(canChangePassword === false){
            setErrorMessage(`Password change is restricted. Please wait ${daysRemaining} more days before resetting password.`)
            setShowErrorAlert(true);
            return;
        }
        //Client-side validation for New Password strengh
        const passwordCheck = validatePassword(newPassword);
        if(!passwordCheck.isValid){
            setErrorMessage(`New password validation failed: ${passwordCheck.errors.join('; ')}`);
            setShowErrorAlert(true);
            return;
        }
        //Client-side validation for password match
        if(newPassword !== confirmNewPassword){
            setErrorMessage("New Password and Confirm New Password do not match.");
            setShowErrorAlert(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await changeUserPassword(userId, passwords.currentPassword, passwords.newPassword, passwords.confirmNewPassword);
            setSuccessMessage(response.message || "Password sucessfully chnaged.");
            handleReset();
            setShowSuccessAlert(true);
        } catch (error) {
            let errorMsg = error.response?.data?.message || error.response?.data || error.message || "An unexpected error occurred during password change.";
            setErrorMessage(errorMsg);
            setShowErrorAlert(true);
            console.error(error.message);
        }finally{
            setIsProcessing(false);
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleReset = (keepAlerts = false) => {
        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
        setShowPassword(false);
        setPasswordValidation({isValid: false, errors: [], requirements: {}});
        if(!keepAlerts){
            setShowErrorAlert(false);
            setShowSuccessAlert(false);
            setDaysRemaining(0);
            setCanChangePassword(null);
        }
    };

    const handleModalClose = () => {
        handleReset();
        handleClose();
    };

    const isSubmitDisabled = isProcessing || passwords.currentPassword === "" || (showPasswordStrength && !passwordValidation.isValid) || canChangePassword === false;

  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
              <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
            {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
            {/*Restriction Warning */}
            {canChangePassword === false && (
                <Alert variant="warning" className='mb-3'>
                    <Alert.Heading>Password Change Restricted</Alert.Heading>
                    <p>Your password was recently changed or you recently registered. You must wait **{daysRemaining}** more days before resetting it again.</p>
                </Alert>
            )}
            {(canChangePassword !== false) && (
                <Form onSubmit={handleSubmit}>
                    {/*Current Password*/}
                    <Form.Group controlId='currentPassword'>
                        <Form.Label>Current Password:</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name='currentPassword'
                                value={passwords.currentPassword}
                                onChange={handleInputChange}
                            />
                            <InputGroup.Text onClick={handleShowPassword} style={{cursor: 'pointer'}}>
                                {!showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    {/*New Password*/}
                    <Form.Group controlId='newPassword' className='mb-2'>
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            name='newPassword'
                            value={passwords.newPassword}
                            onChange={handleInputChange}
                            className={showPasswordStrength ? (passwordValidation.isValid ? 'is-valid' : 'is-invalid') : ''}
                            required
                        />
                        {/*Password Strength Indicator*/}
                            <PasswordStrengthIndicator
                                password={passwords.newPassword}
                                showRequirements={showPasswordStrength}
                            />
                    </Form.Group>

                    {/*Confirm New Password*/}
                    <Form.Group controlId='confirmNewPassword' className='mb-2'>
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            name='confirmNewPassword'
                            value={passwords.confirmNewPassword}
                            onChange={handleInputChange}
                            required
                        />
                        {passwords.newPassword && passwords.confirmNewPassword && passwords.newPassword !== passwords.confirmNewPassword &&(
                            <Form.Text className='text-danger'>
                                Password do not match.
                            </Form.Text>
                        )}
                    </Form.Group>

                    {/*Buttons*/}
                    <div className='d-flex justify-content-center mt-4'>
                        <div className='mx-2'>
                            <Button 
                                variant='secondary' 
                                size='sm' 
                                type='submit' 
                                disabled={isSubmitDisabled}
                            >
                            {isProcessing ? (
                                <ProcessSpinner message='changing password..'/>
                            ): (
                                    "Change Password"
                            )}
                            </Button>
                        </div>
                        <div className='mx-2 mb-4'>
                            <Button variant='danger' size='sm' onClick={() => handleReset(false)}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Modal.Body>      
    </Modal>
  );
};

export default ChangePasswordModal;
