import React, { useEffect, useState } from 'react';
import {Form, Col} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';
import { getPetColors } from './PetService';

const PetColorSelector = ({ value, onChange }) => {
    const[petColors, setPetColors] = useState([]);
    const[showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPetColors = async () => {
            try{
                const response = await getPetColors();
                setPetColors(response.data);
            }catch(error){
                console.error(error.response.data.message);
            }
        }
        fetchPetColors();
    }, [])

    //1. handle color change
    const handleColorChange = (e) => {
        if(e.target.value === "add-new-item"){
            setShowModal(true);
        }else{
            onChange(e);
        }
    };

    //2. handle save new items
    const handleSaveNewItem = (newItem) => {
        if(newItem && !petColors.includes(newItem)){
            setPetColors([...petColors, newItem]);
            onChange({ target: {name: "Color", value: newItem}});
            setShowModal(false);
        }
    };

  return (
    <React.Fragment>
        <div>
            <Form.Group as={Col} controlId='petColor'>
                <Form.Control
                    as="select" 
                    name="petColor" 
                    value={value} 
                    required 
                    onChange={handleColorChange}>
                    <option value=''>select color</option>   
                    <option value='add-new-item'>Add New Item</option>
                    {petColors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                    ))}                 
                </Form.Control>                
            </Form.Group>
            <AddItemModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                handleSave={handleSaveNewItem} 
                itemLabel={'Color'}/>
        </div>
    </React.Fragment>
  );
};

export default PetColorSelector;
