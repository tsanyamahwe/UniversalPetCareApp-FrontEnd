import React, { useEffect, useState, useCallback } from 'react';
import { getVetSpecializations } from './VeterinarianService';
import AddItemModal from '../modals/AddItemModal';
import { Form, Col } from 'react-bootstrap';

const VetSpecializationSelector = ({ value, onChange, className = '', disabled = false }) => {
    const [specializations, setSpecializations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch vet types with proper error handling
    useEffect(() => {
        const fetchAllSpecializations = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getVetSpecializations();
                setSpecializations(response.data || []);
            } catch (error) {
                console.error('Failed to fetch vet specializations:', error);
                setError('Failed to load veterinarian types. Please try again.');
                setSpecializations([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllSpecializations();
    }, []);

    // Handle selection change
    const handleSpecializationChange = useCallback((e) => {
        if (e.target.value === "add-new") {
            setShowModal(true);
        } else {
            onChange?.(e);
        }
    }, [onChange]);

    // Handle saving new items with validation
    const handleSaveNewItem = (newItem) => {
        if(newItem && !specializations.includes(newItem)){
            setSpecializations([...specializations, newItem]);
            onChange({ target: {name: "specialization", value: newItem}});
        }
    };

    // Close modal handler
    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <Form.Group as={Col} controlId='specialization' className={`mb-4 ${className}`}>
                <Form.Control as="select" disabled>
                    <option>Loading veterinarian types...</option>
                </Form.Control>
            </Form.Group>
        );
    }

    // Render error state
    if (error) {
        return (
            <Form.Group as={Col} controlId='specialization' className={`mb-4 ${className}`}>
                <Form.Control as="select" disabled>
                    <option>Error loading types</option>
                </Form.Control>
                <Form.Text className="text-danger">{error}</Form.Text>
            </Form.Group>
        );
    }

    return (
        <React.Fragment>
            <Form.Group as={Col} controlId='specialization' className={`mb-4 ${className}`}>
                <Form.Control
                    as="select"
                    name="specialization"
                    value={value || ''}
                    required
                    disabled={disabled}
                    onChange={handleSpecializationChange}>
                    <option value=''>Select specialization</option>
                    {specializations.map((specialization) => (
                        <option key={specialization} value={specialization}>
                            {specialization}
                        </option>
                    ))}
                    <option value='add-new'>Add New</option>
                </Form.Control>
            </Form.Group>
            
            <AddItemModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleSaveNewItem}
                itemLabel="Veterinarian Type"
            />
        </React.Fragment>
    );
};

export default VetSpecializationSelector;