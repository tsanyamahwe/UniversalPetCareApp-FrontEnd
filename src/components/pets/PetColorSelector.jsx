import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';

const PetColorSelector = ({ value, onChange }) => {
    const[petColors, setPetColors] = useState([]);
    const[showModal, setShowModal] = useState(false);

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
            onChange({ target: {name: "petColor", value: newItem}});
        }
    };

  return (
    <React.Fragment>
        <Form>
            <Form.Group>
                <Form.Control as="select" name="petColor" value={value} required onChange={handleColorChange}>
                    <option value=''>select color</option>   
                    <option value='add-new-item'>Add New Item</option>
                    <option value='white'>White</option> 
                    <option value='brown'>Brown</option>                 
                </Form.Control>                
            </Form.Group>
            <AddItemModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSaveNewItem} itemLabel={'Color'}/>
        </Form>
    </React.Fragment>
  );
};

export default PetColorSelector;
