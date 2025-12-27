import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import VetSpecializationSelector from '../veterinarian/VetSpecializationSelector';
import ProcessSpinner from '../common/ProcessSpinner';
import { getGoogleIdToken } from '../auth/AuthService';

const GoogleRegistrationModal = ({show, onHide, googleToken, socialUserInfo}) => {
    const[error, setError] = useState('');
    const[successMessage, setSuccessMessage] = useState('');
    const[isProcessing, setIsProcessing] = useState(false);
    const[imageError, setImageError] = useState(false);
    const[formData, setFormData] = useState({
        userType: '', 
        phoneNumber: '',
        gender: '', 
        specialization: '', 
        vetLicence: ''
    });

    useEffect(() => {
        if(show){
            setError('');
            setSuccessMessage('');
            setImageError(false);
        }
    }, [show]);


    const getAvatarUrl = () => {
        if(imageError || !socialUserInfo?.picture){
            const firstName = socialUserInfo?.firstName || '';
            const lastName = socialUserInfo?.lastName || '';
            const name = `${firstName} ${lastName}`.trim() || 'User';

            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=50&background=4285f4&color=fff&bold=true`;
        }
        return socialUserInfo.picture;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData(prev => ({
            ...prev, 
            [name] : value, 
            //Clear vet-specific fields when switching away form VET
            ...(name === 'userType' && value !== 'VET' 
                ? {specialization: '', vetLicence: ''} 
                : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if(formData.userType === 'VET' && !formData.specialization){
            setError('Veterinarian specialization required.');
            return;
        }

        if(formData.userType === 'VET' && !formData.vetLicence.trim()){
            setError('Veterinarian licence number required.');
            return;
        }

        setIsProcessing(true);

        try{
            const registrationData = {
                provider: "GOOGLE",
                token: googleToken,
                email: socialUserInfo.email,
                firstName: socialUserInfo.firstName,
                lastName: socialUserInfo.lastName,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                userType: formData.userType,
                specialization: formData.userType === 'VET' ? formData.specialization : '',
                vetLicence: formData.userType === 'VET' ? formData.vetLicence : ''
            };
            
            const response = await getGoogleIdToken(registrationData);
           
            if(response.data?.data?.success && response.data?.data?.token){
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRoles");
                setSuccessMessage("Registration successful. You can now login with your Google account.")
                setError('');
                setFormData({
                    userType: '',
                    phoneNumber: '',
                    gender: '',
                    specialization: '',
                    vetLicence: ''
                });

                setTimeout(() => {
                    onHide();
                    window.location.href='/login';
                }, 3000);
            }else if(response.data?.data?.success === false){
                setError(response.data.data.message || "Registration failed.");
            }else if(response.data?.message){
                setError(response.data.message);
            }else{
                setError("Unexpected response format from server.");
            }
        }catch(error){
            console.error('Google registration error:', error);
            console.error('Error response: ', error.response);

            let errorMessage = 'Registration failed. Please try again.';
            if(error.response?.data?.data?.message){
                errorMessage = error.response.data.data.message;
            }else if(error.response?.data?.message){
                errorMessage = error.response.data.message;
            }else if(error.response?.data?.error){
                errorMessage = error.response.data.error;
            }else if(error.response?.status === 404){
                errorMessage = 'Registration endppoint not found. Please contact support.'
            }else if(error.response?.status === 409){
                errorMessage = 'An account with this email already exists.';
            }else if(error.message){
                errorMessage = error.message;
            }
            setError(errorMessage);
        }finally{
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if(!isProcessing){
            setFormData({userType: '', gender: '', phoneNumber: '', specialization: '', vetLicence: ''});
            setError('');
            setSuccessMessage('');
            onHide();
        }
    };

  return (
        <Modal show={show} onHide={handleClose} backdrop='static' centered size='lg'>
            <Modal.Header closeButton={!isProcessing}>
                <Modal.Title>Complete Your Registration</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successMessage && (
                    <Alert variant='success' className='mb-2'>
                        <div className='d-flex align-items-center'>
                            <i className='bi bi-check-circle-fill fs-4 me-3 text-success'></i>
                            <div>
                                <strong>Success!</strong>
                                <div>{successMessage}</div>
                                <small className='text-muted'>Redirecting to login page..</small>
                            </div>
                        </div>
                    </Alert>
                )}
                {!successMessage && socialUserInfo && (
                    <Alert variant='primary' className='mb-3'>
                        <div className='d-flex align-items-center gap-3'>
                            <div>
                                <img
                                    src={getAvatarUrl()}
                                    alt='Profile'
                                    className='rounded-circle'
                                    style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        setImageError(true);
                                    }}
                                />
                            </div>
                            <div className='flex-grow-1'>
                                <div className='d-flex align-items-center mb-1'>
                                    <i className='bi bi-google fs-5 me-2'></i>
                                    <strong>Connected with Google</strong>
                                </div>
                                <div className='small'><strong>Email:</strong> {socialUserInfo.email}</div>
                                <div className='small'><strong>Name:</strong> {socialUserInfo.firstName} {socialUserInfo.lastName}</div>
                            </div>
                        </div>
                    </Alert>
                )}

                {!successMessage && (
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/**Gender Selector*/}
                            <Col>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Gender<span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name='gender'
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isProcessing}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            
                            {/**Phone Number*/}
                            <Col>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Phone Number<span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='phoneNumber'
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isProcessing}
                                    >
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    
                        {/**Account Type*/}
                        <Form.Group className='mb-3'>
                            <Form.Label>Account Type<span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                as='select'
                                name='userType'
                                value={formData.userType}
                                onChange={handleInputChange}
                                required
                                disabled={isProcessing}
                            >
                                <option value=''>Select account type</option>
                                <option value='VET'>I am a veterinarian</option>
                                <option value='PATIENT'>I am a farmer/pet-owner</option>
                            </Form.Control>
                        </Form.Group>
                    
                        {formData.userType === 'VET' && (
                            <>
                                {/**Vet Specialization - Only show for VET users*/}
                                <Form.Group className='mb-3'>
                                    <Form.Label>Veterinarian Specialization <span className='text-danger'>*</span></Form.Label>
                                    <VetSpecializationSelector
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        disabled={isProcessing}
                                    />
                                </Form.Group>

                                {/**Vet Licence Number - Only show for VET users*/}
                                <Form.Group>
                                    <Form.Label>Veterinarian Licence Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='vetLicence'
                                        value={formData.vetLicence}
                                        onChange={handleInputChange}
                                        placeholder='Enter your veterinary license number'
                                        required
                                        disabled={isProcessing}
                                    />
                                </Form.Group>
                            </>
                        )}
                    
                        <div className='d-flex justify-content-center gap-2 mt-3'>
                            <Button variant='secondary' onClick={handleClose} disabled={isProcessing}>
                                Cancel
                            </Button>
                            <Button variant='primary' type='submit' disabled={isProcessing} style={{backgroundColor: '#1877f2', borderColor: '#187700'}}>
                                {isProcessing ? (
                                    <ProcessSpinner message='Completing registration...'/>
                                ):(
                                    'Register'
                                )}
                            </Button>
                        </div>
                        {error && (
                            <Alert variant='danger' dismissible onClose={() => setError('')} className='mt-2'>
                                {error}
                            </Alert>
                        )}
                    </Form>
                )}
            </Modal.Body>
        </Modal>
  )
}

export default GoogleRegistrationModal;
