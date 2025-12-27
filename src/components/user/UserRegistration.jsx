import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import ProcessSpinner from '../common/ProcessSpinner';
import AlertMessage from '../common/AlertMessage';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Link, useNavigate } from 'react-router-dom';
import VetSpecializationSelector from '../veterinarian/VetSpecializationSelector';
import { userRegistration } from './UserService';
import { validatePassword } from '../utils/Utilities';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import GoogleRegistrationModal from '../modals/GoogleRegistrationModal';
import FacebookRegistrationModal from '../modals/FacebookRegistrationModal';
import { useAuth } from '../auth/AuthContext';

const UserRegistration = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    //States for Social Login modals
    const[showGoogleModal, setShowGoogleModal] = useState(false);
    const[googleReady, setGoogleReady] = useState(false);
    const[googleButtonRendered, setGoogleButtonRendered] = useState(false);
    const[googlePromptRunning, setGooglePromptRunning] = useState(false);
    const[googleToken, setGoogleToken] = useState(null);
    const[showFacebookModal, setShowFacebookModal] = useState(false);
    const[facebookReady, setFacebookReady] = useState(false);
    const[facebookToken, setFacebookToken] = useState(null);
    const[socialUserInfo, setSocialUserInfo] = useState(null);
    const[facebookUserInfo, setFacebookUserInfo] = useState(null);

    //States for traditional registrations
    const[showPasswordStrength, setShowPasswordStrength] = useState(false);
    const[isProcessing, setIsProcessing] = useState(false);
    const[user, setUser] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        password: "",
        userType: "",
        specialization: "",
        vetLicence: "",
    });
    const[passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: [],
        requirements: {}
    });

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    //Initialize Google Sign-In
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if(window.google){
                try{
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        callback: handleGoogleCredentialResponse,
                        auto_select: false,
                        use_fedcm_for_prompt: true
                    });

                    const buttonContainer = document.getElementById('googleSignInDiv');
                    if(buttonContainer){
                        window.google.accounts.id.renderButton(
                            buttonContainer,
                            {
                                theme: 'outline',
                                size: 'large',
                                text: 'continue_with',
                                shape: 'rectangular',
                                width: 200
                            }
                        );
                        setGoogleButtonRendered(true);
                        setGoogleReady(true);
                    }
                } catch (error) {
                    console.error("Google Sign-In initialization error:", error);
                    setErrorMessage("Failed to initialize Google Sign-In");
                    setShowErrorAlert(true);
                }
            }
        };

        script.onerror = () => {
            console.error("Failed to load Google Sign-In script");
            setErrorMessage("Failed to load Google Sign-In");
            setShowErrorAlert(true);
        };
       
        return () => {
            if(document.body.contains(script)){
                document.body.removeChild(script);
            }
        };
    }, []);

    //Initialize Facebook SDK
    useEffect(() => {
        const existingScript = document.getElementById('facebook-jssdk');
        if(existingScript){
            existingScript.remove();
        }

        let initializationTimeout;

        window.fbAsyncInit = function() {
            try {
                window.FB.init({
                    appId: import.meta.env.VITE_FACEBOOK_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v24.0'
                });

                setTimeout(() =>{
                    window.FB.getLoginStatus(function(response) {
                        setFacebookReady(true);
                    });
                }, 500);
            } catch (error) {
                console.error('Facebook SDK initialization error:', error);
                setErrorMessage('Failed to initialize Facebook SDK');
                setShowErrorAlert(true);
            }  
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if(d.getElementById(id)){
                return;
            } 
            js = d.createElement(s); 
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            js.onload = () => {
                initializationTimeout = setTimeout(() => {
                    if(!facebookReady && window.FB){
                        window.fbAsyncInit();
                    }
                }, 3000);
            };
            js.onerror = () => {
                console.error('Failed to load Facebook SDK');
                setErrorMessage('Failed to load Facebook SDK. Please check your internet connection.');
                setShowErrorAlert(true);
            };
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        return () => {
            if(initializationTimeout){
                clearTimeout(initializationTimeout);
            }
        };
    }, []);

    const handleGoogleCredentialResponse = async (response) => {
        setGooglePromptRunning(false);
        try{
            setIsProcessing(true);
            const idToken = response.credential;

            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const userInfo = JSON.parse(jsonPayload);

            setGoogleToken(idToken);
            setSocialUserInfo({
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name
            });
            setShowGoogleModal(true);
        }catch(error) {
            console.error('Google login error:', error);
            setErrorMessage(error.message || 'Failed to authenticate with Google');
            setShowErrorAlert(true);
        }finally{
            setIsProcessing(false);
        }
    };

    const performFacebookLogin = () => {
        window.FB.login(function(response){
            if(response.status === 'connected' && response.authResponse){
                const accessToken = response.authResponse.accessToken;

                window.FB.api('/me', {fields: 'id,name,email,picture'}, function(userInfo){

                    if(userInfo.error){
                        console.error('Error fetching user info:', userInfo.error);
                        setErrorMessage(`Facebook API error: ${userInfo.error.message}`);
                        setShowErrorAlert(true);
                        setIsProcessing(false);
                        return;
                    }

                    setFacebookToken(accessToken);
                    setFacebookUserInfo({
                        email: userInfo.email || '',
                        name: userInfo.name,
                        picture: userInfo.picture?.data?.url,
                        firstName: userInfo.name?.split(' ')[0],
                        lastName: userInfo.name?.split(' ').slice(1).join(' ')
                    });
                    setShowFacebookModal(true);
                    setIsProcessing(false);
                });
            }else{
                setIsProcessing(false);
            }
        },{
            scope: 'public_profile,email',
            auth_type: 'reauthenticate',
            return_scopes: true
        });
    };

    const handleFacebookSignIn = async () => {
        if(!window.FB){
            setErrorMessage('Facebook SDK not loaded. Please refresh the page.');
            setShowErrorAlert(true);
            return;
        }

        if(!facebookReady){
            setErrorMessage('Facebook is still loading. Please wait a moment and try again');
            setShowErrorAlert(true);
            return;
        }

        setIsProcessing(true);

        try {
            setTimeout(() =>{
                window.FB.getLoginStatus(function(statusResponse) {
                    if(statusResponse.status === 'connected'){
                        window.FB.logout(function(logoutResponse){
                            setTimeout(() => {
                                performFacebookLogin();
                            }, 1000);
                        })
                    }else{
                        performFacebookLogin();
                    } 
                }, true);
            }, 500);
        } catch (error) {
            console.error('Error in handleFacebookSignIn:', error);
            console.error('Error details:', error.message, error.stack)
            setErrorMessage(`Failed to initiate Facebook login: ${error.message}`);
            setShowErrorAlert(true);
            setIsProcessing(false);
        }
    };

    const handleInputChange = (event) => {
        const{name, value} = event.target;
        setUser((previousState) => ({
            ...previousState, [name]: value,
        }));

        //validate password in real-time
        if(name === 'password'){
            const validation = validatePassword(value);
            setPasswordValidation(validation);
            setShowPasswordStrength(value.length > 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate password before submission
        const passwordCheck = validatePassword(user.password);
        if(!passwordCheck.isValid){
            setErrorMessage(`Password validation failed: ${passwordCheck.errors.join('; ')}`);
            setShowErrorAlert(true);
            return;
        }
        
        // Validate that veterinarians have selected a specialization
        if (user.userType === "VET" && !user.specialization) {
            setErrorMessage("Please select a veterinarian specialization.");
            setShowErrorAlert(true);
            return;
        }

        // validate that veterinarians have provided a veterinary lisence number
        if (user.userType === "VET" && !user.vetLicence) {
            setErrorMessage("Please provide your veterinarian number.");
            setShowErrorAlert(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await userRegistration(registrationData);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            setIsProcessing(false);
            handleReset();
        } catch (error) {
            console.error('Registration error:', error);
            let errorMsg = "Registration failed. Please try again.";
            if(error.response?.data){
                if(typeof error.response.data === 'string'){
                    errorMsg = error.response.data;
                }else if(error.response.data.message){
                    errorMsg = error.response.data.message;
                }else if(error.response.data.errors){
                    errorMsg = error.response.data.errors.join('; ')
                }
            }
            setErrorMessage(errorMsg);
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
            vetLicence: ""
        });
    };

    // Clear specialization when user type changes away from VET
    const handleUserTypeChange = (event) => {
        const newUserType = event.target.value;

        setUser((previousState) => ({
            ...previousState,
            userType: newUserType,
            //Clear vet-specific fields when switching away from VET
            specialization: newUserType === "VET" ? previousState.specialization : "",
            vetLicence: newUserType === "VET" ? previousState.vetLicence : ""
        }));
    };

    const handleSwitchFacebookAccount = () => {
        setShowFacebookModal(false);
        setFacebookToken(null);
        setFacebookUserInfo(null);

        if(!window.FB){
            setErrorMessage('Facebook SDK is not loaded. Please refresh the page.');
            setShowErrorAlert(true);
            return;
        }

        if(!facebookReady){
            console.error('Facebook SDK not ready');
            setErrorMessage('Facebook SDK is not ready. Please wait a moment and tray again.');
            setShowErrorAlert(true);
            return;
        }

        setIsProcessing(true);

        //Force logout
        window.FB.logout(() => {
            //Wait for Facebook caches to clear
            setTimeout(() => {
                //Force Fresh login
                window.FB.login((loginResponse) => {
                    if(loginResponse === 'connected'){
                        const accessToken = loginResponse.authResponse.accessToken;

                        window.FB.api('/me', {fields: 'name,email,picture' }, function(userInfo) {
                            setFacebookToken(accessToken);
                            setFacebookUserInfo({
                                email: userInfo.email || '',
                                name: userInfo.name,
                                picture: userInfo.picture?.data?.url,
                                firstName: userInfo.name.split(" ")[0],
                                lastName: userInfo.name.split(" ").slice(1).join(" ")
                            });
                            setShowFacebookModal(true);
                            setIsProcessing(false);
                        });
                    }else{
                        setIsProcessing(false);
                    }
                }, {
                    scope: "public_profile,email",
                    auth_type: "reauthenticate",
                    auth_nonce: Date.now().toString(),
                    return_scopes: true
                });
            }, 1000);
        });
    };

  return (
        <Container className='mt-5'>
            <Row className='justify-content-center'>
                <Col xs={12} md={9} lg={6}>
                    <Form onSubmit={handleSubmit}>
                        <Card className='shadow mb-5'>
                            <Card.Header className='text-center'>User Registration Form</Card.Header>
                            <div className='text-center mb-1 mt-1'>
                                <p><b>Or sign up using: </b></p>
                                <div className='d-flex justify-content-center gap-2 align-items-center flex-wrap'>
                                    {/*Google Sign-In Button Container*/}
                                    <div id='googleSignInDiv' style={{minHeight: '40px'}}></div>
                                    {/*Show loading text while Google button is loading*/}
                                    {!googleButtonRendered && (
                                        <div className='text-muted small'>Loading Google Sign-In..</div>
                                    )}
                                    <Button 
                                        variant='outline-primary' 
                                        size='sm' 
                                        onClick={handleFacebookSignIn}
                                        disabled={isProcessing || !facebookReady}
                                        style={{height: '40px'}}
                                    >
                                        <i className='bi bi-facebook me-2'></i>
                                        {facebookReady ? 'Continue with Facebook' : 'Loading Facebook...'}
                                    </Button>
                                </div>
                            </div>
                            <Card.Body>
                                <fieldset>
                                    <legend><h5>Full Name <span className='text-danger'>*</span></h5></legend>
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
                                        <Form.Label>Gender <span className='text-danger'>*</span></Form.Label>
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
                                
                                {/**Contact*/}
                                <fieldset>
                                    <legend><h5>Contact Information <span className='text-danger'>*</span></h5></legend>
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
                                        <Form.Label>Password <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                        type='password'
                                        name='password'
                                        required
                                        placeholder='create your password'
                                        value={user.password}
                                        onChange={handleInputChange}
                                        className={showPasswordStrength ? (passwordValidation.isValid ? 'is-valid' : 'is-invalid') : ''}
                                        />
                                        {/*Password Strength Indicator*/}
                                        <PasswordStrengthIndicator 
                                            password={user.password}
                                            showRequirements={showPasswordStrength}
                                        />
                                    </Col>
                                </Form.Group>
                                
                                {/*Account Type*/}
                                <Form.Group as={Row} controlId='user-type' className='mb-3'>
                                    <Col>
                                        <Form.Label>Account Type <span className='text-danger'>*</span></Form.Label>
                                        <Form.Control
                                            as='select'
                                            name='userType'
                                            required
                                            value={user.userType}
                                            onChange={handleUserTypeChange}>
                                                <option value=''>select account type</option>
                                                <option value='VET'>I am a Veterinarian</option>
                                                <option value='PATIENT'>I am a farmer/pet-owner</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>

                                {/**Display Account Type Details when selected*/}
                                {user.userType === 'PATIENT' && accountTypeDetails && (
                                    <Alert variant='info' className='mb-3'>
                                        <div className='d-flex justify-content-between align-items-start'>
                                            <div>
                                                <strong>Account Type:</strong>
                                                <div>{accountTypeDetails.displayText}</div>
                                            </div>
                                            <Button
                                                variant='link'
                                                size='sm'
                                                onClick={handleEditAccountType}
                                                disabled={isProcessing}
                                            >
                                                <i className='bi bi-pencil me-1'></i>
                                                Edit
                                            </Button>
                                        </div>
                                    </Alert>
                                )}
                                
                                {/*Vet Specialization - Only show for VET users*/}
                                {user.userType === "VET" && (
                                    <Form.Group as={Row} className='mb-3'>
                                        <Col>
                                            <Form.Label>Veterinarian Specialization <span className='text-danger'>*</span></Form.Label>
                                            <VetSpecializationSelector
                                                value={user.specialization}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Label>Veterinarian Licence Number <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='vetLicence'
                                                value={user.vetLicence}
                                                onChange={handleInputChange}
                                                placeholder='enter your veterinary service license'
                                                required
                                                disabled={isProcessing}
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
                                        disabled={isProcessing || (showPasswordStrength && !passwordValidation.isValid)}>
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
                                        disabled={isProcessing || (showPasswordStrength && !passwordValidation.isValid)}>
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
            {/**Google Registration Modal*/}
            <GoogleRegistrationModal
                show={showGoogleModal}
                onHide={() => setShowGoogleModal(false)}
                googleToken={googleToken}
                socialUserInfo={socialUserInfo}
            />  
            {/**Facebook Registration Modal*/}
            <FacebookRegistrationModal
                show={showFacebookModal}
                onHide={() => setShowFacebookModal(false)}
                facebookToken={facebookToken}
                facebookUserInfo={facebookUserInfo}
                onSwitchAccount={handleSwitchFacebookAccount}
            />
        </Container>
  );
};

export default UserRegistration;