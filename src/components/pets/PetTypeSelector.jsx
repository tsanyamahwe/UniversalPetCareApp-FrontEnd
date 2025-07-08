import React, {useEffect, useState} from 'react';
import {Form, Col} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';
import { getPetTypes } from './PetService';

const PetTypeSelector = ({value, onChange}) => {
    const[petTypes, setPetTypes] = useState([]);
    const[showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPetTypes = async () => {
            try{
                const response = await getPetTypes();
                setPetTypes(response.data);
            }catch(error){
                console.error(error.response.data.message);
            }
        }
        fetchPetTypes();
    }, [])

    //1. handle color change
    const handleTypeChange = (e) => {
        if(e.target.value === "add-new-item"){
            setShowModal(true);
        }else{
            onChange(e);
        }
    };
    //2. handle save new items
    const handleSaveNewItem = (newItem) => {
        if(newItem && !petTypes.includes(newItem)){
            setPetTypes([...petTypes, newItem]);
            onChange({ target: {name: "petType", value: newItem}});
        }
    };

  return (
    <React.Fragment>
        <div>
            <Form.Group as={Col} controlId='petType'>
                <Form.Control 
                    as="select" 
                    name="petType" 
                    value={value} 
                    required 
                    onChange={handleTypeChange}>
                    <option value=''>select type</option>   
                    <option value='add-new-item'>Add New Item</option>
                    {petTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}              
                </Form.Control>                
            </Form.Group>
            <AddItemModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                handleSave={handleSaveNewItem} 
                itemLabel={'Type'}/>
        </div>
    </React.Fragment>
  );
};

export default PetTypeSelector;
