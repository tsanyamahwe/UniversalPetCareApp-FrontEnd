import React, { useState } from 'react';
import {Modal, Form} from 'react-bootstrap';

const AddItemModal = ({show, handleClose, handleSave, itemLabel}) => {
    const[itemValue, setItemValue] = useState("");

    const handleSaveItem = () => {
        handleSave(itemValue);
        setItemValue("");
        handleClose();
    };

    const handleInputChange = (e) => {
        setItemValue(e.target.value)
    };

  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add New {itemLabel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>{itemLabel} Name </Form.Label>
                    <Form.Control type="text" placeholder={`Enter ${itemLabel.toLowerCase()} name`} value={itemValue} onChange={handleInputChange}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={handleSaveItem}> Add </Button>
            <Button variant='danger' onClick={handleClose}> Close </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default AddItemModal;
