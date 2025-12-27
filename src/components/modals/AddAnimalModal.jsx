import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import AnimalTypeSelector from '../pets/AnimalTypeSelector';

const AddAnimalModal = ({show, onHide, onAddAnimal, initialData = null, isEditing = false}) => {
    const[errors, setErrors] = useState({});
    const[isSubmitting, setIsSubmitting] = useState(false);
    const[animalData, setAnimalData] = useState({
        animalType: '',
        animalCount: ''
    });

    //Load initial data when editing
    useEffect(() => {
        if(show && initialData){
            setAnimalData({
                animalType: initialData.animalType || '',
                animalCount: initialData.animalCount || ''
            });
        }else if(show && !initialData){
            //Reset form when opening in add mode
            setAnimalData({
                animalType: '',
                animalCount: ''
            });
        }
    }, [show, initialData]);

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        setAnimalData(previous => ({
            ...previous,
            [name]: value
        }));

        //Clear error for this field when user starts typing
        if(errors[name]){
            setErrors(previous => ({
                ...previous,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if(!animalData.animalType || animalData.animalType.trim() === ''){
            newErrors.animalType = 'Animal type is required';
        }

        if(!animalData.animalCount || animalData.animalCount.toString().trim() === ''){
            newErrors.animalCount = 'Number of animals is required';
        }else if(isNaN(animalData.animalCount) || parseInt(animalData.animalCount) <= 0){
            newErrors.animalCount = 'Number must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }

        setIsSubmitting(true);

        try {
            await onAddAnimal(animalData);
            setAnimalData({
                animalType: '',
                animalCount: ''
            });
            setErrors({});
            onHide();
        } catch (error) {
            console.error('Error adding/updating animal group:', error);
            setErrors({
                submit: 'Failed to save animal group. Please try again.'
            });
        }finally{
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        //Reset form when closing
        setAnimalData({
            animalType: '',
            animalCount: ''
        });
        setErrors({});
        onHide();
    };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
            <Modal.Title>
                {isEditing ? 'Edit Animal Group' : 'Add Animal Group'}
            </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                <Form.Group className='mb-3'>
                    <Form.Label>Animal Type <span className='text-danger'>*</span></Form.Label>
                    <AnimalTypeSelector
                        value={animalData.animalType}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                    />
                    {errors.animalType && (
                        <div className='invalid-feedback d-block'>
                            {errors.animalType}
                        </div>
                    )}
                    <Form.Text className='text-muted'>
                        Select the type of animals in this group (e.g., Cattle, Sheep, Poutry)
                    </Form.Text>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Number of Animals <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                        type='number'
                        name='animalCount'
                        value={animalData.animalCount}
                        onChange={handleInputChange}
                        placeholder='Enter number of animals'
                        min="1"
                        isInvalid={!!errors.animalCount}
                        disabled={isSubmitting}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors.animalCount}
                    </Form.Control.Feedback>
                    <Form.Text className='text-muted'>
                        How many {animalData.animalType || 'animals'} are in this group?
                    </Form.Text>
                </Form.Group>
                {errors.submit && (
                    <div className='alert alert-danger' role='alert'>
                        {errors.submit}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#64959c'}}>
                <Button
                    variant='secondary'
                    onClick={handleClose}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    variant='success'
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Group' : 'Add Group')}
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
};

export default AddAnimalModal