import React, { useState } from 'react';
import {Form} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';

const PetBreedSelector = ({value, onChange}) => {
    const[petBreeds, setPetBreeds] = useState([]);
    const[showModal, setShowModal] = useState(false);

    //1. handle pet change
    const handleBreedChange = (e) => {
        if(e.target.value === "add-new-item"){
            setShowModal(true);
        }else{
            onChange(e);
        }
    };
    //2. handle save new item
    const handleSaveNewItem = (newItem) => {
        if(newItem && !petBreeds.includes(newItem)){
            setPetBreeds([...petBreeds, newItem]);
            onChange({ target: {name: "petBreed", value: newItem}});
        }
    };

  return (
    <React.Fragment>
        <Form>
            <Form.Group>
                <Form.Control as="select" name="petBreed" value={value} required onChange={handleBreedChange}>
                    <option value=''>select breed</option>   
                    <option value='add-new-item'>Add New Item</option>
                    <option value='pitbull'>Pit Bull </option> 
                    <option value='hardmashona'>Hard Mashona</option>                 
                </Form.Control>                
            </Form.Group>
            <AddItemModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSaveNewItem} itemLabel={'Breed'}/>
        </Form>
    </React.Fragment>
  );
};

export default PetBreedSelector;
