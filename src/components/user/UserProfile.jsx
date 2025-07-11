import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import UserImage from '../common/UserImage';
import { Link } from 'react-router-dom';
import PhotoUploaderModal from '../modals/PhotoUploaderModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';

const UserProfile = ({user, handlePhotoRemoval}) => {
    const[showPhotoUploaderModal, setShowPhotoUploaderModal] = useState(false);
    const[showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const handleShowPhotoUploaderModal = () => { setShowPhotoUploaderModal(true); };
    const handleClosePhotoUploaderModal = () => { setShowPhotoUploaderModal(false); };
    const handleShowChangePasswordModal = () => { setShowChangePasswordModal(true); };
    const handleCloseChangePasswordModal = () => { setShowChangePasswordModal(false); }; 

  return (
    <React.Fragment>   
        <Row>
            <Col md={2}>
                <Card className='text-center mb-3 shadow'>
                    <Card.Body>
                        <UserImage userId={user.id} userPhoto={user.photo}/>
                    </Card.Body>
                    <div className='text-center'> 
                             <Link to={"#"} onClick={handleShowPhotoUploaderModal}>Update Photo</Link> 
                            <PhotoUploaderModal 
                                userId={user.id} 
                                show={showPhotoUploaderModal}
                                handleClose={handleClosePhotoUploaderModal}/><br/>
                            <Link to={"#"} onClick={handlePhotoRemoval}>Remove Photo</Link><br/>
                            <Link to={"#"} onClick={handleShowChangePasswordModal}>Change Password</Link>
                            <ChangePasswordModal 
                                userId={user.id} 
                                show={showChangePasswordModal} 
                                handleClose={handleCloseChangePasswordModal}/>
                    </div>
                </Card>
            </Col>   
            <Col md={10}>
                <Card className='mb-3 shadow'>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>First Name:</Col>
                        <Col md={4}>
                            <Card.Text>{user.firstName}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>Last Name:</Col>
                        <Col md={4}>
                            <Card.Text>{user.lastName}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>Gender:</Col>
                        <Col md={4}>
                            <Card.Text>{user.gender}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>Email:</Col>
                        <Col md={4}>
                            <Card.Text>{user.email}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>Mobile:</Col>
                        <Col md={4}>
                            <Card.Text>{user.phoneNumber}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>User Type:</Col>
                        <Col md={4}>
                            <Card.Text>{user.userType}</Card.Text>
                        </Col>
                    </Card.Body>
                    <Card.Body className='d-flex align-items-center'>
                        <Col md={4}>Account Status:</Col>
                        <Col md={4}>
                            <Card.Text>{user.isEnabled}</Card.Text>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </React.Fragment>
  )
}

export default UserProfile
