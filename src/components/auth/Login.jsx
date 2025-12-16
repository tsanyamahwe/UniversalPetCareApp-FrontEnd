import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Card, Form, InputGroup, Button} from 'react-bootstrap';
import {BsLockFill, BsPersonFill} from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { getFacebookAccessToken, loginUser } from './AuthService';
import AlertMessage from '../common/AlertMessage';
import { useAuth } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import GoogleLogin from './GoogleLogin';
import FacebookLogin from './FacebookLogin';

const Login = () => {
    const[credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const{login, isAuthenticated} = useAuth();
    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        setCredentials((previousState) => ({
            ...previousState, [name]: value,
        }));
    };

    useEffect(() => {
        if(isAuthenticated){
            navigate(from, {replace : true});
        }
    }, [isAuthenticated, navigate, from]);

    //Method 1: Regular email/password login
    const handleLogin = async (e) => {
        e.preventDefault();
        if(!credentials.email || !credentials.password){
            setErrorMessage("Please enter a valid username and password.");
            setShowErrorAlert(true);
            return;
        }
        try {
            const data = await loginUser(credentials.email, credentials.password);
            const token = data.jwt || data.token;
            if(token){
                const success = login(token);
                if(success){
                    clearLoginForm();
                    navigate(from, {replace: true});
                }else{
                    setErrorMessage('Failed to process login token');
                    setShowErrorAlert(true);
                }
            }else{
                setErrorMessage("Invalid response from server");
                setShowErrorAlert(true);
            }
        } catch (error) {
            console.error("Login error: ", error);
            setErrorMessage(error.response?.data?.data || "Login failed. Please try again");
            setShowErrorAlert(true);
        }
    };

    const clearLoginForm = () => {
        setCredentials({email: "", password: ""});
        setShowErrorAlert(false);
    };

    //Method 2: Google login handler
    const handleGoogleLogin = async (result) => {
        try {
            
            let token = null;
            let user = null;

            if(result?.data?.data?.token){
                token = result.data.data.token;
                user = result.data.data.user;
            }else if(result?.data?.token){
                token = result.data.token;
                user = result.data.user;
            }else if(result?.data){
                token = result.token;
                user = result.user;
            }

            console.log("Extract token: ", token);
            console.log("Extracted user: ", user);
            
            if(!token){
                console.error("No token found in response structure");
                throw new Error("Invalid response from server - no authentication token received");
            }

            const success = login(token);
            if(success){
                const userName = user?.name || user?.firstName || 'User';
                setSuccessMessage(`Welcome back, ${userName}`);
                setShowSuccessAlert(true);

                setTimeout(() => {
                    navigate(from, {replace: true});
                }, 3000);
            }else{
                throw new Error("Failed to process login token");
            }
        } catch (error) {
            console.error("Google login error: ", error);
            setErrorMessage(error.message || "Google login failed. Please try again");
            setShowErrorAlert(true);
        }
    };

    //Method 3: Facebook login handler
    const handleFacebookLogin = async (data) => {
        try {
            console.log("Facebook login server response: ", data);
            const token = data.jwt || data.token;
            if(!token){
                throw new Error("Invalid response from server");
            }

            const success = login(token);
            if(success){
                const userName = data.user?.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User';
                setSuccessMessage(`Welcome back, ${userName}`);
                setShowSuccessAlert(true);

                setTimeout(() => {
                    navigate(from, {replace: true});
                }, 3000);
            }else{
                throw new Error('Failed to process login token');
            }
        } catch (error) {
            console.error("Facebook login error ", error);
            setErrorMessage(error.message || "Facebook login failed. Please try again");
            setShowErrorAlert(true);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col sm={4}>
                    <Card>
                        {showErrorAlert && <AlertMessage type={"danger"} message={errorMessage}/>}
                        {showSuccessAlert && <AlertMessage type={"success"} message={successMessage}/>}
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Login</Card.Title>
                            {/*Traditional email/password login form*/}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className='mb-3' controlId='username'>
                                    <Form.Label>Username(email)</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsPersonFill/>{/*User Icon*/}
                                        </InputGroup.Text>
                                        <Form.Control
                                            type='text'
                                            name='email'
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsLockFill/>{/*Lock Icon*/}
                                        </InputGroup.Text>  
                                        <Form.Control
                                            type='password'
                                            name='password'
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                        />                                   
                                    </InputGroup>
                                </Form.Group>
                                <Button
                                    variant='outline-primary'
                                    type='submit'
                                    className='w-100'>
                                    Login
                                </Button>
                            </Form>
                            {/*Divider*/}
                            <div>
                                <Row className='mt-2 justify-content-center text-center'>
                                    <p style={{textAlign: 'center', margin: '10px 0'}}><b>OR</b></p>
                                    {/*Google login*/}
                                    <Col xs={6} className='mb-2'>
                                        <GoogleLogin onGoogleLogin={handleGoogleLogin}/>
                                    </Col>
                                    {/*Facebook login*/}
                                    <Col xs={6}>
                                        <FacebookLogin onFacebookLogin={handleFacebookLogin}/>
                                    </Col>
                                </Row>
                            </div>
                            {/*Additional links*/}
                            <div className='text-center mt-3'>
                                Don't have an account yet? {""}
                                <Link to={"/register-user"} style={{textDecoration: "none"}}>
                                    Register here
                                </Link>{""}
                            </div>
                            <div className='mt-2 justify-content-center' >
                                <Link
                                    to={"/password-reset-request"}
                                    style={{textDecoration: "none"}}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </Card.Body>                    
                    </Card>
                </Col>
            </Row>      
        </Container>
    );
};

export default Login;
