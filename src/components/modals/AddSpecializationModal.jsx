import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import UseMessageAlerts from '../hooks/UseMessageAlerts';

const AddSpecializationModal = ({show, onHide, onConfirm, vetId, existingSpecializations}) => {
    const[specializationName, setSpecializationName] = useState('');
    const[isAdding, setIsAdding] = useState(false);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const handleSubmit = async () => {
        setErrorMessage('');
        if(!specializationName.trim()){
            setErrorMessage('Please enter a specialization');
            setShowErrorAlert(true);
            return;
        }
        if(existingSpecializations.includes(specializationName.trim())){
            setErrorMessage('This specialization already exists');
            setShowErrorAlert(true);
            return;
        }
        setIsAdding(true);
        try {
            await onConfirm(vetId, specializationName.trim());
            handleClose();
        } catch (error) {
            setErrorMessage(error.message || "failed to add specialization");
        }finally{
            setIsAdding(false);
        }
    };

    const handleClose = () => {
        setSpecializationName('');
        setErrorMessage('');
        setIsAdding(false);
        onHide();
    };

  return (
    <Modal show={show} onHide={handleClose} centered>
        {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
        <Modal.Header closeButton>
            <Modal.Title>Add New Specialization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Specialization Name</Form.Label>
                    <Form.Control
                        type='text'
                        value={specializationName}
                        onChange={(e) => setSpecializationName(e.target.value)}
                        placeholder='enter specialization..'
                        disabled={isAdding}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    {errorMessage && (
                        <div className='text-danger mt-2'>
                            {errorMessage}
                        </div>
                    )}
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: '#64959c'}}>
            <Button
                variant='secondary'
                onClick={handleClose}
                disabled={isAdding}
            >
                Cancel
            </Button>
            <Button
                variant='primary'
                onClick={handleSubmit}
                disabled={isAdding || !specializationName.trim()}
            >
                {isAdding ? 'Adding..' : 'Add'}
            </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default AddSpecializationModal
