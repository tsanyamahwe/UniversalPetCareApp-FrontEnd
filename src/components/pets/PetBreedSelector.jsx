import React, { useEffect, useState } from 'react';
import {Form, Col} from 'react-bootstrap';
import AddItemModal from '../modals/AddItemModal';
import { getPetBreeds } from './PetService';

const PetBreedSelector = ({petType, value, onChange}) => {
    const[petBreeds, setPetBreeds] = useState([]);
    const[showModal, setShowModal] = useState(false);

    useEffect(() => {
        if(petType){
            const fetchPetBreeds = async () => {
                try{
                    const response = await getPetBreeds(petType);
                    console.log("The breeds :", response.data);
                    setPetBreeds(response.data);
                }catch(error){
                    console.error(error.response.data.message);
                }
            }
            fetchPetBreeds();
        } else {
            setPetBreeds([])
        }
    }, [petType]);
       

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
        <div>
            <Form.Group as={Col} controlId='petBreed'>
                <Form.Control as="select" name="petBreed" value={value} required onChange={handleBreedChange}>
                    <option value=''>select breed</option>   
                    <option value='add-new-item'>Add New Item</option>
                    {petBreeds.map((breed) => (
                        <option key={breed} value={breed}>{breed}</option>
                    ))}                
                </Form.Control>                
            </Form.Group>
            <AddItemModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSaveNewItem} itemLabel={'Breed'}/>
        </div>
    </React.Fragment>
  );
};

export default PetBreedSelector;
