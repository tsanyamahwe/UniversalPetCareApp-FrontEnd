import React, {useState} from 'react';
import {Form} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';

const PetTypeSelector = ({value, onChange}) => {
    const[petTypes, setPetTypes] = useState([]);
    const[showModal, setShowModal] = useState(false);

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
        <Form>
            <Form.Group>
                <Form.Control as="select" name="petType" value={value} required onChange={handleTypeChange}>
                    <option value=''>select type</option>   
                    <option value='add-new-item'>Add New Item</option>
                    <option value='dog'>Dog</option> 
                    <option value='cat'>Cat</option>                 
                </Form.Control>                
            </Form.Group>
            <AddItemModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSaveNewItem} itemLabel={'Type'}/>
        </Form>
    </React.Fragment>
  );
};

export default PetTypeSelector;
