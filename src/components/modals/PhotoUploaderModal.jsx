import React, { useEffect, useState } from 'react'
import { getUserById } from '../user/UserService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Modal, Form, InputGroup, Button } from 'react-bootstrap';
import AlertMessage from '../common/AlertMessage';
import { updateUserPhoto, uploadUserPhoto } from '../photo/PhotoUploaderService';

const PhotoUploaderModal = ({userId, show, handleClose}) => {
    const[file, setFile] = useState(null);
    const[user, setUser] = useState(null);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    //1. get the user
    const getUser = async () => {
        try {
            const response = await getUserById(userId);
            setUser(response.data);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setShowErrorAlert(true);
            console.error(error.message);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

    const handlePhotoUpload = async (e) => {
        e.preventDefault();

        if(!file){
            setErrorMessage("Please select a file to upload");
            setShowErrorAlert(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            //2. check if the user already has a photo
            if(user && user.photoId){
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async (e) => {  //3. if yes, update existing photo, else
                    const fileBytes = new Uint8Array(e.target.result);
                    const response = await updateUserPhoto(user.photoId, fileBytes);
                    setSuccessMessage(response.data);
                    window.location.reload();
                    setShowSuccessAlert(true);
                };
            }else{ //4. create a new photo
                const response = await uploadUserPhoto(userId, file);
                setSuccessMessage(response.data || "Photo uploaded successfully");
                setShowSuccessAlert(true);

                setTimeout(() => {
                    handleClose();
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
            setShowErrorAlert(true);
            console.error(error.message);
        }
    };
    
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
              <Modal.Title>Upload a Photo</Modal.Title>
        </Modal.Header>  
        <Modal.Body>
            {showErrorAlert && (
                <AlertMessage type={"danger"} message={errorMessage}/>
            )}
            {showSuccessAlert && (
                <AlertMessage type={"success"} message={successMessage}/>
            )}
            <Form>
                <h5>Select profile photo</h5>
                <InputGroup>
                      <Form.Control type='file' onChange={handleFileChange}/>
                      <Button variant='secondary' onClick={handlePhotoUpload}>Upload</Button>
                </InputGroup>
            </Form>
        </Modal.Body>   
    </Modal>
  );
};

export default PhotoUploaderModal;
