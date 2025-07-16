import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsCheck, BsX } from 'react-icons/bs';

const EditablePetRow = ({pet, index, onSave, onCancel}) => {
    const[editPet, setEditPet] = useState(pet);

    const handlePetChange = (e) => {
        const{name, value} = e.target;
        setEditPet((previousState)=>({
            ...previousState, [name]: value
        }));
    };

  return (
    <tr>
        <td>
            <Form.Control
                type='text'
                name='name'
                value={editPet.name}
                onChange={handlePetChange}
            />
        </td>   
         <td>
            <Form.Control
                type='text'
                name='type'
                value={editPet.type}
                onChange={handlePetChange}
            />
        </td>
         <td>
            <Form.Control
                type='text'
                name='breed'
                value={editPet.breed}
                onChange={handlePetChange}
            />
        </td>   
         <td>
            <Form.Control
                type='text'
                name='color'
                value={editPet.color}
                onChange={handlePetChange}
            />
        </td> 
         <td>
            <Form.Control
                type='number'
                name='age'
                value={editPet.age}
                onChange={handlePetChange}
            />
        </td>  
        <td>
            {""}
            <Button
                variant='success'
                size='sm'
                onClick={()=> onSave(pet.id, editPet)}
                className='me-2'>
                <BsCheck/>
            </Button>
        </td> 
        <td colSpan={2}>
            <Button variant='secondary' size='sm' onClick={onCancel}>
                <BsX/>
            </Button>
        </td>
    </tr>
  )
}

export default EditablePetRow;
