import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import PetColorSelector from '../pets/PetColorSelector';
import PetTypeSelector from '../pets/PetTypeSelector';
import PetBreedSelector from '../pets/PetBreedSelector';


const AddPetModal = ({ show, onHide, onAddPet, appointmentId, initialData = null, isEditing = false }) => {
    const[petData, setPetData] = useState({
        name: '',
        type: '',
        breed: '',
        color: '',
        age: ''
    });

    const[errors, setErrors] = useState({});
    const[isSubmitting, setIsSubmitting] = useState(false);

    //Load initial data when editing
    useEffect(() => {
        if(show && initialData){
            setPetData({
                name: initialData.name || '',
                type: initialData.type || '',
                breed: initialData.breed || '',
                color: initialData.color || '',
                age: initialData.age || ''
            });
        }else if(show && !initialData){
            setPetData({
                name: '',
                type: '',
                breed: '',
                color: '',
                age: ''
            });
        }
    }, [show, initialData])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Map the field names from the selectors to match petData structure
        let fieldName = name;
        if (name === 'petType') fieldName = 'type';
        if (name === 'petBreed') fieldName = 'breed';
        if (name === 'petColor') fieldName = 'color';
        
        setPetData(prev => ({
            ...prev,
            [fieldName]: value,
            // Clear breed when pet type changes
            ...(name === 'petType' && { breed: '' })
        }));
        
        // Clear error for this field when user starts typing
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!petData.name.trim()) {
            newErrors.name = 'Pet name is required';
        }
        
        if (!petData.type.trim()) {
            newErrors.type = 'Pet type is required';
        }
        
        if (!petData.breed.trim()) {
            newErrors.breed = 'Pet breed is required';
        }
        
        if (!petData.color.trim()) {
            newErrors.color = 'Pet color is required';
        }
        
        if (!petData.age.trim()) {
            newErrors.age = 'Pet age is required';
        } else if (isNaN(petData.age) || parseInt(petData.age) < 0) {
            newErrors.age = 'Age must be a valid positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await onAddPet(appointmentId, petData);
            setPetData({
                name: '',
                type: '',
                breed: '',
                color: '',
                age: ''
            });
            setErrors({});
            onHide();
            return response;
        } catch (error) {
            console.error('Error adding/updating pet:', error);
            throw error; 
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setPetData({
            name: '',
            type: '',
            breed: '',
            color: '',
            age: ''
        });
        setErrors({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Pet</Modal.Title>
            </Modal.Header>
            
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Pet Name <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={petData.name}
                            onChange={handleInputChange}
                            placeholder="Enter pet's name"
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Age <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={petData.age}
                            onChange={handleInputChange}
                            placeholder="Enter pet's age"
                            min="0"
                            isInvalid={!!errors.age}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.age}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Pet Color Selector */}
                    <Form.Group className="mb-3">
                        <Form.Label>Pet Color <span className='text-danger'>*</span></Form.Label>
                        <PetColorSelector
                            value={petData.color}
                            onChange={handleInputChange}
                        />
                        {errors.color && (
                            <div className="invalid-feedback d-block">
                                {errors.color}
                            </div>
                        )}
                    </Form.Group>

                    {/* Pet Type and Breed Section */}
                    <fieldset className="mb-3">
                        <legend style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            Pet Type and Breed
                        </legend>
                        <Form.Group as={Row} className="mb-2">
                            <Col md={6}>
                                <Form.Label>Pet Type <span className='text-danger'>*</span></Form.Label>
                                <PetTypeSelector
                                    value={petData.type}
                                    onChange={handleInputChange}
                                />
                                {errors.type && (
                                    <div className="invalid-feedback d-block">
                                        {errors.type}
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <Form.Label>Pet Breed <span className='text-danger'>*</span></Form.Label>
                                <PetBreedSelector
                                    petType={petData.type}
                                    value={petData.breed}
                                    onChange={handleInputChange}
                                />
                                {errors.breed && (
                                    <div className="invalid-feedback d-block">
                                        {errors.breed}
                                    </div>
                                )}
                            </Col>
                        </Form.Group>
                    </fieldset>
                </Modal.Body>
                
                <Modal.Footer style={{backgroundColor: '#64959c'}}>
                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Pet'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddPetModal;