import React from 'react';
import { Button, Modal } from 'react-bootstrap'

const DeleteConfirmationModal = ({show, onHide, onConfirm, itemToDelete}) => {
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header> 
        <Modal.Body>Are you sure you want to delete this {itemToDelete}? This cannot be reversed.</Modal.Body>  
        <Modal.Footer style={{backgroundColor: '#64959c'}}>
            <Button variant='secondary' onClick={onHide}>Cancel</Button>{""} 
            <Button variant='danger' onClick={onConfirm}>Delete</Button>
        </Modal.Footer>  
    </Modal>
  )
}

export default DeleteConfirmationModal;
