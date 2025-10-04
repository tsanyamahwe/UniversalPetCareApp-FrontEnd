import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Card, Form, InputGroup, Button} from 'react-bootstrap';
import {BsLockFill, BsPersonFill} from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { loginUser } from './AuthService';
import AlertMessage from '../common/AlertMessage';
import { useAuth } from './AuthContext';

const Login = () => {
    const[credentials, setCredentials] = useState({
        email: "",
        password: "",
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

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!credentials.email || !credentials.password){
            setErrorMessage("Please enter a valid username and password.");
            setShowErrorAlert(true);
            return;
        }
        try {
            const data = await loginUser(credentials.email, credentials.password);
            login(data.token);
            clearLoginForm();
            navigate(from, {replace : true});
        } catch (error) {
            setErrorMessage(error.response.data.data);
            setShowErrorAlert(true);
        }
    };

    const clearLoginForm = () => {
        setCredentials({email: " ", password: " "});
        setShowErrorAlert(false);
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col sm={4}>
                    <Card>
                        {showErrorAlert && <AlertMessage type={"danger"} message={errorMessage}/>}
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Login</Card.Title>
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
                            <div className='text-center mt-2'>
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
