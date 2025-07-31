import React, { useState } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import UserImage from '../common/UserImage';
import { Link } from 'react-router-dom';
import PhotoUploaderModal from '../modals/PhotoUploaderModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const UserProfile = ({user, handlePhotoRemoval, handleDeleteAccount}) => {
    const[showPhotoUploaderModal, setShowPhotoUploaderModal] = useState(false);
    const[showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[userToDelete, setUserToDelete] = useState(null);

    const handleShowPhotoUploaderModal = () => { setShowPhotoUploaderModal(true); };
    const handleClosePhotoUploaderModal = () => { setShowPhotoUploaderModal(false); };
    const handleShowChangePasswordModal = () => { setShowChangePasswordModal(true); };
    const handleCloseChangePasswordModal = () => { setShowChangePasswordModal(false); }; 

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleShowDeleteModal = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const handleDeleteAndCloseModal = async () =>{
        try {
            await handleDeleteAccount();
            setShowDeleteModal(false);
        } catch (error) {
            console.error(error.message);
        }
    };

  return (
    <Container className='shadow'>
        <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={handleCloseDeleteModal}
            onConfirm={handleDeleteAndCloseModal}
            itemToDelete={"user account"}
        />
        <React.Fragment>   
            <Row>
                <Col md={3}>
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
                <Col md={9}>
                    <Card className='mb-3 shadow'>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>First Name:</Col>
                            <Col md={4}>
                                <Card.Text>{user.firstName}</Card.Text>
                            </Col>
                        </Card.Body>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>Last Name:</Col>
                            <Col md={4}>
                                <Card.Text>{user.lastName}</Card.Text>
                            </Col>
                        </Card.Body>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>Gender:</Col>
                            <Col md={4}>
                                <Card.Text>{user.gender}</Card.Text>
                            </Col>
                        </Card.Body>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>Email:</Col>
                            <Col md={4}>
                                <Card.Text>{user.email}</Card.Text>
                            </Col>
                        </Card.Body>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>Mobile:</Col>
                            <Col md={4}>
                                <Card.Text>{user.phoneNumber}</Card.Text>
                            </Col>
                        </Card.Body>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>User Type:</Col>
                            <Col md={4}>
                                <Card.Text>{user.userType}</Card.Text>
                            </Col>
                        </Card.Body>
                        {user.userType === "VET" && (
                            <Card.Body className='d-flex align-items-center'>
                                <Col md={5}>Specialization:</Col>
                                <Col md={4}>
                                    <Card.Text>{user.specialization}</Card.Text>
                                </Col>
                            </Card.Body>
                        )}
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={5}>Account Status:</Col>
                            <Col md={4}>
                                <Card.Text className={user.enabled ? "active" : "inactive"}>
                                    <b>{user.enabled ? "Active" : "Inactive"}</b>
                                </Card.Text>
                            </Col>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3 shadow'>
                        <Card.Body className='d-flex align-items-center'>
                            <Col md={2}>Role(s):</Col>
                            <Col md={4}>
                                <ListGroup variant='flush'>
                                    {user.roles && user.roles.map((role, index) => (
                                        <ListGroup.Item key={index} className='text-success'>
                                            {role ? role.replace("ROLE_", "") : ""}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                        </Card.Body>
                    </Card>
                    <Card.Body>
                        <div className='d-flex justify-content-center mb-4'>
                            <div className='mx-2'>
                                <Link to={`/update-user/${user.id}/update`} className='btn btn-warning btn-sm'>
                                    Edit Profile
                                </Link>
                            </div>
                            <div className='mx-2'>
                                <Button variant='danger' size='sm' onClick={handleShowDeleteModal}>
                                    Close account
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Col>
            </Row>
        </React.Fragment>
    </Container>
  )
}

export default UserProfile;
