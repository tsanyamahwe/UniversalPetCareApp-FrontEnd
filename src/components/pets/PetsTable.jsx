import React, { useState } from 'react'
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import AddPetModal from '../modals/AddPetModal';
import AlertMessage from '../common/AlertMessage';
import { Button, Table } from 'react-bootstrap';
import EditablePetRow from './EditablePetRow';
import { BsPencilFill, BsTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { updatePet, deletePet, addPet } from './PetService';

const PetsTable = ({pets, appointmentId, onPetsUpdate, isEditable, isPatient}) => {
    const[editModeId, setEditModeId] = useState(null);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[showAddModal, setShowAddModal] = useState(false);
    const[petToDelete, setPetToDelete] = useState(null);
    const[localPets, setLocalPets] = useState(pets);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();
    
    React.useEffect(() => {
        setLocalPets(pets);
    }, [pets]);

    const handleEditClick = (petId) =>{
        setEditModeId(petId);
    };

    const handleEditCancel = () =>{
        setEditModeId(null);
    };

    const handleShowDeleteModal = (petId) =>{
        // Check if this is the only pet before showing delete modal
        if (localPets.length <= 1) {
            setErrorMessage("Cannot delete pet. An appointment must have at least one pet associated with it.");
            setShowErrorAlert(true);
            return;
        }
        setPetToDelete(petId);
        setShowDeleteModal(true);
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const handleDeletePet = async () => {
        if(petToDelete){
            try {
                setLocalPets(prevPets => prevPets.filter(pet => pet.id !== petToDelete));
                const response = await deletePet(petToDelete);
                await onPetsUpdate(appointmentId);
                setSuccessMessage(response.message);
                setShowDeleteModal(false);
                setShowSuccessAlert(true);
                setPetToDelete(null);
            } catch (error) {
                setLocalPets(pets);
                setErrorMessage(error.message || error.response?.data?.message || 'Failed to delete pet');
                setShowErrorAlert(true);
                setShowDeleteModal(false);
                setPetToDelete(null);
            }
        }
    };

    const handleAddPet = async (appointmentId, petData) => {
    try {
        const response = await addPet(appointmentId, petData);
        const newPet = response.pet || { 
            ...petData, 
            id: response.id || Date.now(),
            appointmentId 
        };
        
        setLocalPets(prevPets => [...prevPets, newPet]);
        await onPetsUpdate(appointmentId);
        setSuccessMessage(response.message || 'Pet added successfully!');
        setShowSuccessAlert(true);
    } catch (error) {
        setLocalPets(pets);
        setErrorMessage(error.message || 'Failed to add pet. Please try again.');
        setShowErrorAlert(true);
        throw error; 
    }
};

    const handlePetSaveUpdate = async (petId, updatedPet) => {
        try {
            setLocalPets(prevPets => prevPets.map(pet => pet.id === petId ? {...pet, ...updatedPet} : pet));
            const response = await updatePet(petId, updatedPet);
            await onPetsUpdate(appointmentId);
            setSuccessMessage(response.message);
            setEditModeId(null);
            setShowSuccessAlert(true);
        } catch (error) {
            setLocalPets(pets);
            setErrorMessage(error.message);
            setShowErrorAlert(true);
        }
    };

    const displayPets = localPets || [];
    
    const isDeletionDisabled = displayPets.length <= 1;

  return (
    <section>
        <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => {setShowDeleteModal(false); setPetToDelete(null);}}
            onConfirm={() => {handleDeletePet()}}
            itemToDelete='pet'
        />
        
        <AddPetModal
            show={showAddModal}
            onHide={() => setShowAddModal(false)}
            onAddPet={handleAddPet}
            appointmentId={appointmentId}
        />
        
        {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}   
        {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
        
        {/* Add Pet Button - Show only for patients and when editable */}
        {isPatient && isEditable && (
            <div className="mb-3 d-flex justify-content-end">
                <Button
                    variant="success"
                    size="sm"
                    onClick={handleShowAddModal}
                    className="d-flex align-items-center gap-2"
                >
                    <BsPlusCircleFill />
                    Add New Pet
                </Button>
            </div>
        )}
        
        <Table striped bordered hover size='sm'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Breed</th>
                    <th>Color</th>
                    <th>Age</th>
                    {isPatient && <th colSpan={3}>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {Array.isArray(displayPets) && displayPets.length > 0 ? (
                    displayPets.map((pet, index) => editModeId === pet.id ? (
                        <EditablePetRow
                            key={`edit-${pet.id}`}
                            pet={pet}
                            index={index}
                            onSave={handlePetSaveUpdate}
                            onCancel={handleEditCancel}
                        />
                    ):(
                        <tr key={`view-${pet.id}`}>
                            <td>{pet.name}</td>
                            <td>{pet.type}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.color}</td>
                            <td>{pet.age}</td>
                            {isPatient && (
                                <React.Fragment>
                                    <td>
                                        <Button
                                            className='btn btn-sm btn-warning'
                                            disabled={!isEditable}
                                            onClick={() => handleEditClick(pet.id)}>
                                            <BsPencilFill/>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            className='btn btn-sm btn-danger'
                                            disabled={!isEditable || isDeletionDisabled}
                                            onClick={() => handleShowDeleteModal(pet.id)}
                                            title={isDeletionDisabled ? "Cannot delete the only pet in appointment" : "Delete pet"}>
                                            <BsTrashFill/>
                                        </Button>
                                    </td>
                                </React.Fragment>
                            )}
                        </tr>
                    ))
                ):(
                    <tr>
                        <td colSpan={7} className='text-center'>
                            No pets found <span className='text-primary'><b>for this</b></span> appointment
                            {isPatient && isEditable && (
                                <div className="mt-2">
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={handleShowAddModal}
                                        className="d-flex align-items-center gap-2 mx-auto"
                                        style={{width: 'fit-content'}}
                                    >
                                        <BsPlusCircleFill />
                                        Add Your First Pet
                                    </Button>
                                </div>
                            )}
                        </td>
                    </tr>
                )}
                
            </tbody>
        </Table>
    </section>
  )
}

export default PetsTable;