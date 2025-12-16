import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import VetSpecializationSelector from '../veterinarian/VetSpecializationSelector';
import ProcessSpinner from '../common/ProcessSpinner';
import { getFacebookAccessToken } from '../auth/AuthService';

const FacebookRegistrationModal = ({show, onHide, facebookToken, facebookUserInfo, onSwitchAccount}) => {
    const[error, setError] = useState('');
    const[successMessage, setSuccessMessage] = useState('');
    const[isProcessing, setIsProcessing] = useState(false);
    const[imageError, setImageError] = useState(false);
    const[manualEmail, setManualEmail] = useState('');
    const[formData, setFormData] = useState({
        userType: '',
        gender: '',
        phoneNumber: '',
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
        if(imageError || !facebookUserInfo?.picture){
            const firstName = facebookUserInfo?.firstName || '';
            const lastName = facebookUserInfo?.lastName || '';
            const name = `${firstName} ${lastName}`.trim() || 'User';

            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=50&background=1877f2&color=fff&bold=true`;
        }
        return facebookUserInfo.picture;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev, 
            [name] : value, 
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
            setError('Veterinarian Specialization is required.');
            return;
        }

        if(formData.userType === 'VET' && !formData.vetLicence.trim()){
            setError('Veterinarian licence number is required.');
            return;
        }

        setIsProcessing(true);

        try{
            const registrationData ={
                provider: 'FACEBOOK',
                token: facebookToken,
                email: facebookUserInfo.email,
                firstName: facebookUserInfo.firstName,
                lastName: facebookUserInfo.lastName,
                userType: formData.userType,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                specialization: formData.userType === 'VET' ? formData.specialization : '',
                vetLicence: formData.userType === 'VET' ? formData.vetLicence : ''
            };

            console.log('Sending complete Facebook registration data: ', registrationData);
            const response = await getFacebookAccessToken(registrationData);
            console.log('Facebook registration response:', response);

            if(response.data?.data?.success && response.data?.data?.token){
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRoles");

                setSuccessMessage("Registration successful! Please login with your Facebook account to continue.");
                setError('');
                setFormData({
                    userType: '',
                    gender: '',
                    phoneNumber: '',
                    specialization: '',
                    vetLicence: ''
                });

                setTimeout(() => {
                    onHide();
                    window.location.href = '/login';
                }, 3000);
            }else if(response.data?.data?.success === false){
                setError(response.data.data.message || "Registration failed.");
            }else if(response.data?.message){
                setError(response.data.message);
            }else{
                setError("Unexpected response format from server.");
            }
        }catch (error) {
            console.error('Facebook registration error:', error);
            console.error('Error response:', error.response);

            let errorMessage = 'Registration failed. Please try again.';
            if(error.response?.data?.data?.message){
                errorMessage = error.response.data.data.message;
            }else if(error.response?.data?.message){
                errorMessage = error.response.data.message;
            }else if(error.response?.data?.error){
                errorMessage = error.response.data.error;
            }else if(error.response?.status === 404){
                errorMessage = 'Registration endpoint not found. Please contact support.';
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
    <Modal  show={show} onHide={handleClose} backdrop='static' centered size='lg'>
        <Modal.Header closeButton={!isProcessing}>
            <Modal.Title>Complete Your Facebook Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {successMessage && (
                <Alert variant='success' className='mb-2'>
                    <div className='d-flex align-items-center'>
                        <i className='bi bi-check-circle-fill fs-4 me-3 text-success'></i>
                        <div>
                            <strong>Success!</strong>
                            <div>{successMessage}</div>
                            <small className='text-muted'>Redirecting to login page...</small>
                        </div>
                    </div>
                </Alert>
            )}
            {!successMessage && show && facebookUserInfo && (
                <Alert variant='primary' className='mb-3'>
                    <div className='d-flex align-items-center gap-3'>
                        <div>
                            <img
                                src={getAvatarUrl()}
                                alt='Profile'
                                className='rounded-circle'
                                style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    setImageError(true);
                                }}
                            />
                        </div>
                        <div className='flex-grow-1'>
                            <div className='d-flex align-items-center mb-2'>
                                <i className='bi bi-facebook fs-4 me-2'></i>
                                <strong>Connected with Facebook</strong>
                            </div>
                            <div className='small'><strong>Email:</strong> {facebookUserInfo.email}</div>
                            <div className='small'><strong>Name:</strong> {facebookUserInfo.firstName} {facebookUserInfo.lastName}</div>
                        </div>
                        <div className='text-center mb-3'>
                            <Button
                                variant='link'
                                size='sm'
                                onClick={onSwitchAccount}
                            >
                                <i className='bi bi-arrow-left-right me-1'></i>
                                Login with a different<br/> Facebook account
                            </Button>
                        </div>
                    </div>
                </Alert>
            )}

            {!successMessage && (
                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/**Gender selector*/}
                        <Col>
                            <Form.Group className='mb-3'>
                                <Form.Label>Gender <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    as='select'
                                    name='gender'
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isProcessing}
                                >
                                    <option value=''>Select gender</option>
                                    <option value='MALE'>Male</option>
                                    <option value='FEMALE'>Female</option>
                                    <option value='OTHER'>Other</option>
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
                                />
                            </Form.Group>
                        </Col> 
                    </Row>

                    {/**Email*/}
                    {!facebookUserInfo?.email && (
                        <Form.Group className='mb-3'>
                            <Form.Label>EMail Address <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter your email address'
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                required
                            />
                            <Form.Text>
                                Facebook didnt provide your email. Please enter it manually.
                            </Form.Text>
                        </Form.Group>
                    )}

                    {/**Account type*/}
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
                            {/**Vet Specialization - only show for VET users*/}
                            <Form.Group className='mb-3'>
                                <Form.Label>Veterinarian Specialization <span className='text-danger'>*</span></Form.Label>
                                <VetSpecializationSelector
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    disabled={isProcessing}
                                />
                            </Form.Group>

                            {/**Vet License - only show for VET users*/}
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
                    
                    <div className='d-flex justify-content-end gap-2'>
                        <Button variant='secondary' onClick={handleClose} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            type='submit'
                            disabled={isProcessing}
                            style={{backgroundColor: '#1877F2', borderColor: '#187700'}}
                        >
                            {isProcessing ? (
                                <ProcessSpinner message='Completing registration...'/>
                            ):(
                                'Register'
                            )}
                        </Button>
                    </div>
                    {error && (
                        <Alert variant='danger' dismissible onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}
                </Form>
            )}
        </Modal.Body>
    </Modal>
  )
}

export default FacebookRegistrationModal;
