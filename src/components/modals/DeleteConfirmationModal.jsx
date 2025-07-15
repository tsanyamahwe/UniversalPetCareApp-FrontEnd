import React from 'react';
import { Button, Modal } from 'react-bootstrap'

const DeleteConfirmationModal = ({show, onHide, onConfirm, itemToDelete, loading}) => {
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header> 
        <Modal.Body>Are you sure you want to delete {itemToDelete}? This action cannot be reversed.</Modal.Body>  
        <Modal.Footer>
            <Button variant='secondary' onClick={onHide}>Cancel</Button>{""} 
            <Button variant='danger' onClick={onConfirm}>Delete</Button>
        </Modal.Footer>  
    </Modal>
  )
}

export default DeleteConfirmationModal;
