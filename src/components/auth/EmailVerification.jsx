import React, { useEffect, useState } from 'react';
import { verifyEmail, resendVerificationToken } from './AuthService';
import ProcessSpinner from '../common/ProcessSpinner';
import { Button } from 'react-bootstrap';

const EmailVerification = () => {
    const[verificationMessage, setVerificationMessage] = useState("verifying your email...");
    const[alertType, setAlertType] = useState("alert-info");
    const[isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");
        if(token){
            verifyingEmailToken(token);
        }else if(!token){
            setVerificationMessage("No token provided.");
            setAlertType("alert-danger");
        }
    }, []);

    const verifyingEmailToken = async(token) =>{
        setIsProcessing(true);
        try {
            const response = await verifyEmail(token);
            switch(response.message){
                case "VALID": setVerificationMessage("Your email has been successfully verified, you can proceed to login.");
                setAlertType("alert-success");
                break;
                case "VERIFIED": setVerificationMessage("The email has been successfully verified, please proceed to login.");
                setAlertType("alert-info");
                break;
                default: setVerificationMessage("An unexpected error occured.");
                setAlertType("alert-danger");
            }
        } catch (error) {
            if(error.response){
                const {message} = error.response.data;
                if(message && message === "INVALID"){
                    setVerificationMessage("This verification link is invalid");
                    setAlertType("alert-danger");
                }else{
                    setVerificationMessage("This verification lin has expired, please try again");
                    setAlertType("alert-warning");
                }
            }else{
                setVerificationMessage("Failed to connect to the server.");
                setAlertType("alert-danger");
            }
        }finally{
            setIsProcessing(false); //stop loading regardless of the outcome
        }
    };

    const handleResendToken = async () => {
        setIsProcessing(true);
        const queryParams = new URLSearchParams(location.search);
        const oldToken =queryParams.get("token");
        try {
            if(!oldToken){
                return;
            }
            const response = await resendVerificationToken(oldToken);
            setVerificationMessage(response.message);
            setAlertType("alert-success");
        } catch (error) {
            let message = "Failed to resend verification token";
            if(error.response && error.response.data && error.response.data.message){
                message = error.response.data.message;
            }else if(error.message){
                message = error.message;
            }
            setVerificationMessage(message);
            setAlertType("alert-danger");
        }finally{
            setIsProcessing(false); //stop loading regardless of the outcome
        }
    };

    return (
        <div className='d-flex justify-content-center mt-lg-5'>
            {isProcessing ? (
                <ProcessSpinner message="Processing, please wait..."/>
            ):(
                <div className='col-12 col-md-6'>
                    <div className={`alert ${alertType}`} role='alert'>
                        {verificationMessage}
                        {alertType === "alert-warning" && (
                            <Button onClick={handleResendToken} className='btn btn-link'>
                                Resend Verification Link
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailVerification;
