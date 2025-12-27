import React, { useEffect, useState } from 'react';
import { getPetTypes } from './PetService';
import { Button, Form } from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';

const AnimalTypeSelector = ({ value, onChange, disabled = false }) => {
    const[animalType, setAnimalType] = useState([]);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);
    const[showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchAnimalTypes();
    }, []);

    const fetchAnimalTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPetTypes();

            if(response && response.data){
                setAnimalType(response.data);
            }else{
                setAnimalType([]);
            }
        } catch (error) {
            console.error('Error fetching animal types:', error);
            setError('Failed to load animal types');
            setAnimalType([]);
        }finally{
            setLoading(false);
        }
    };

    const handleSelectChange =(e) => {
        const selectedValue = e.target.value;

        //Check if user selected "Add New Item"
        if(selectedValue === 'ADD_NEW_ITEM'){
            setShowAddModal(true);
        }else{
            onChange(e);
        }
    };

    const handleAddNewType = (newType) => {
        if(newType && newType.trim() !== ''){
            const trimmedType = newType.trim();

            //Check if it already exists
            if(!animalType.includes(trimmedType)){
                setAnimalType([...animalType, trimmedType]);
            }

            //Automatically select the newly added type
            const syntheticEvent = {
                target: {
                    name: 'animalType',
                    value: trimmedType
                }
            };
            onChange(syntheticEvent);
        }
        setShowAddModal(false);
    };

  return (
    <>
        <Form.Select
            name='animalType'
            value={value}
            onChange={handleSelectChange}
            disabled={disabled || loading}
            required
        >
            <option value="">
                {loading ? 'Loading animal types...' : 'Select animal type'}
            </option>
            {error && <option value="" disabled>{error}</option>}
            {animalType.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
            <option value="ADD_NEW_ITEM" style={{fontWeight: 'bold', color: '#0d6efd'}}>
                + Add New Item
            </option>
        </Form.Select>
            
       <AddItemModal
            show={showAddModal}
            handleClose={() => setShowAddModal(false)}
            handleSave={handleAddNewType}
            itemLabel="Animal Type"
       />
    </>
  );
};

export default AnimalTypeSelector;