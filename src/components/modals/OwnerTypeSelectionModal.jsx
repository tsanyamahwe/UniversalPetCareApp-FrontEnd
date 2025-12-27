import React, { useEffect, useState } from 'react';
import { Button, Modal, Card, Col, Form, Row, Badge } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTimes } from 'react-icons/fa'
import { getPetColors, getPetTypes } from '../pets/PetService';
import AddPetModal from './AddPetModal';
import AddAnimalModal from './AddAnimalModal';

const OwnerTypeSelectionModal = ({show, onHide, onComplete, initialData=null}) => {
    const[ownerType, setOwnerType] = useState();
    const[petType, setPetType] = useState([]);
    const[petColor, setPetColor] = useState([]);
    const[allBreeds, setAllBreeds] = useState({});

    //Pet Owner states
    const[pets, setPets] = useState([]);
    const[showAddPetModal, setShowAddPetModal] = useState(false);
    const[editingPetIndex, setEditingPetIndex] = useState(null);

    //Farmer states
    const[animalGroup, setAnimalGroup] = useState([]);
    const[showAddAnimalModal, setShowAddAnimalModal] = useState(false);
    const[editingAnimalIndex, setEditingAnimalIndex] = useState(null);

    useEffect(() => {
        if(show){
            loadPetMetadata();
            if(initialData){
                setOwnerType(initialData.ownerType);
                if(initialData.ownerType === 'PET_OWNER'){
                    setPets(initialData.pets || []);
                }else if(initialData.ownerType === 'FARMER'){
                    setAnimalGroup(initialData.animalGroup || [{
                        animalType: "",
                        animalCount: ""
                    }]);
                }
            }
        }
    }, [show, initialData]);

    const loadPetMetadata = async() => {
        try {
            const typesResponse = await getPetTypes();
            const colorsResponse = await getPetColors();

            setPetType(typesResponse.data || []);
            setPetColor(colorsResponse.data || []);

            //Pre-load breeds for all pet types
            const breedsMap = {};
            if(typesResponse.data){
                for(const type of typesResponse.data){
                    try {
                        const breedsResponse = await getPetBreeds(type);
                        breedsMap[type] = breedsResponse.data || [];
                    } catch (error) {
                        console.error(`Error loading breeds for ${type}:`, error);
                        breedsMap[type] = [];
                    }
                }
            }
            setAllBreeds(breedsMap)
        } catch (error) {
            console.error('Error loading pet metadata:', error);
        }
    };

    const handleOwnerTypeSelect = (type) => {
        setOwnerType(type);

        //If Pet Owner is selected, open AddPetModal immediately 
        if(type === 'PET_OWNER'){
            setShowAddPetModal(true);
        }

        //If Farmer is selected, open AddAnimalModal immediately
        if(type === 'FARMER'){
            setShowAddAnimalModal(true);
        }
    };

    //Pet Owner handlers using AddPetModal
    const handleAddPetFromModal = async (appointmentId, petData) => {
        //Transform petData from AddPetModal format to our format
        const newPet = {
            petName: petData.name,
            petAge: petData.age,
            petColor: petData.color,
            petType: petData.type,
            petBreed: petData.breed
        };

        if(editingPetIndex !== null){
            //Update existing pet
            const updatedPet = [...pets];
            updatedPet[editingPetIndex] = newPet;
            setPets(updatedPet);
            setEditingPetIndex(null);
        }else{
            //Add new pet
            setPets([...pets, newPet])
        }

        setShowAddPetModal(false);
        return Promise.resolve({sucess: true});
    };

    const handleEditPet = (index) => {
        setEditingPetIndex(index);
        setShowAddPetModal(true);
    }

    const removePet = (index) => {
        setPets(pets.filter((_, i) => i !== index));
    };

    const handleAddAnotherPet = () => {
        setEditingPetIndex(null);
        setShowAddPetModal(true);
    };

    const handleCloseAddPetModal = () => {
        setShowAddPetModal(false);
        setEditingPetIndex(null);
    };

    //Get pet data for editing
    const getPetDataForEditing = () => {
        if(editingPetIndex !== null && pets[editingPetIndex]){
            const pet = pets[editingPetIndex];
            return{
                name: pet.petName,
                age: pet.petAge,
                color: pet.petColor,
                type: pet.petType,
                breed: pet.petBreed
            };
        }
        return null;
    };

    //Farmers handlers using AddAnimalModal
    const handleAddAnimalFromModal = async (animalData) => {
        if(editingAnimalIndex !== null){
            //Update existing animal group
            const updateGroup = [...animalGroup];
            updateGroup[editingAnimalIndex] = animalData;
            setAnimalGroup(updateGroup);
            setEditingAnimalIndex(null);
        }else{
            //Add new animal group
            setAnimalGroup([...animalGroup, animalData]);
        }
        setShowAddAnimalModal(false);
    };

    const handleEditAnimal = (index) => {
        setEditingAnimalIndex(index);
        setShowAddAnimalModal(true);
    };

    const removeAnimalGroup = (index) => {
        setAnimalGroup(animalGroup.filter((_, i) => i !== index));
    };

    const handleAddAnotherAnimal = () => {
        setEditingAnimalIndex(null);
        setShowAddAnimalModal(true);
    };

    const handleCloseAddAnimalModal = () => {
        setShowAddAnimalModal(false);
        setEditingAnimalIndex(null);
    };

    //Get animal data for editing
    const getAnimalDataForEditing = () => {
        if(editingAnimalIndex !== null && animalGroup[editingAnimalIndex]){
            return animalGroup[editingAnimalIndex];
        }
        return null;
    };

    const handleComplete = () => {
        if(!ownerType){
            alert('Please select and owner type');
            return;
        }

        if(ownerType === 'PET_OWNER'){
            //Validate pets
            if(pets.length === 0){
                alert('Please select an owner type');
                return;
            }

            for(const pet of pets){
                if(!pet.petName || !pet.petType || !pet.petBreed || !pet.petColor || !pet.petAge){
                    alert('Please fill all pet information');
                    return;
                }
            }
            onComplete({
                ownerType: 'PET_OWNER',
                pets: pets
            });
        }else if(ownerType === 'FARMER'){
            //Validate animal group
            if(animalGroup.length === 0){
                alert('Please add at least one animal group');
                return;
            }

            for(const animalgroup of animalGroup){
                if(!animalgroup.animalType || !animalgroup.animalCount || animalgroup.animalCount <= 0){
                    alert('Please fill in all animal group information');
                    return;
                }
            }
            onComplete({
                ownerType: 'FARMER',
                animalGroups: animalGroup
            });
        }
        handleModalClose();
    }

    const handleModalClose = () => {
        setOwnerType('');
        setPets([]);
        setAnimalGroup([]);
        setEditingPetIndex(null);
        setEditingAnimalIndex(null);
        onHide();
    };

  return (
    <>
        {/**Add Pet Modal for Pet Owner*/}
        <AddPetModal
            show={showAddPetModal}
            onHide={handleCloseAddPetModal}
            onAddPet={handleAddPetFromModal}
            appointmentId={null} //Not needed for this case
            initialData={getPetDataForEditing()}
            isEditing={editingPetIndex !== null}
        />

        {/**Add Animal Modal for Farmer*/}
        <AddAnimalModal
            show={showAddAnimalModal}
            onHide={handleCloseAddAnimalModal}
            onAddAnimal={handleAddAnimalFromModal}
            initialData={getAnimalDataForEditing()}
            isEditing={editingAnimalIndex !== null}
        />

        {/**Main Owner Type Selection Modal*/}
        <Modal show={show} onHide={handleModalClose} size="lg" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Select Owner Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!ownerType ? (
                    <div className='text-center'>
                        <h6 className='mb-4'>Are you a Pet Owner or a Farmer?</h6>
                        <Row className='justify-content-center'>
                            <Col md={5} className='mb-3'>
                                <Card
                                    className='h-100 shadow-sm cursor-pointer hover-card'
                                    onClick={() => handleOwnerTypeSelect('PET_OWNER')}
                                    style={{cursor: 'pointer'}}
                                >
                                    <Card.Body className='text-center'>
                                        <i className='bi bi-house-heart' style={{fontSize: '3rem', color: '#0d6efd'}}></i>
                                        <h6 className='mt-3'>Pet Owner</h6>
                                        <p className='text-muted'>I have individual pets (dogs, cats, etc.,)</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={5} className='mb-3'>
                                <Card
                                    className='h-100 shadow-sm cursor-pointer hover-card'
                                    onClick={() => handleOwnerTypeSelect('FARMER')}
                                    style={{cursor: 'pointer'}}
                                >
                                    <Card.Body className='text-center'>
                                        <i className='bi bi-bank' style={{fontSize: '3rem', color: '#198754'}}></i>
                                        <h6 className='mt-3'>Farmer</h6>
                                        <p className='text-muted'>I have groups of animals (livestock, poultry, etc.,)</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : ownerType === 'PET_OWNER' ? (
                    <div>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h6>Pet Information</h6>
                            <Button
                                variant='link'
                                size='sm'
                                onClick={() => setOwnerType('')}
                            >
                                <i className='bi bi-arrow-left me-1'></i>
                                Change Owner Type
                            </Button>
                        </div>
                        {pets.length === 0 ? (
                            <div className='text-center py-4'>
                                <p className='text-muted mb-3'>No pets added yet</p>
                                <Button
                                    variant='primary'
                                    onClick={handleAddAnotherPet}
                                >
                                    <FaPlus className='me-2'/>
                                    Add Your First Pet
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/**Display added pets*/}
                                {pets.map((pet, index) => (
                                    <Card key={index} className='mb-3 shadow-sm'>
                                        <Card.Body>
                                            <div className='d-flex justify-content-between align-items-start'>
                                                <div className='flex-grow-1'>
                                                    <h6 className='mb-2'>
                                                        <Badge bg='primary' className='me-2'>
                                                            Pet {index + 1}
                                                        </Badge>
                                                        {pet.petName}
                                                    </h6>
                                                    <Row className='small text-muted'>
                                                        <Col md={6}>
                                                            <div><strong>Type:</strong>{pet.petType}</div>
                                                            <div><strong>Breed:</strong>{pet.petBreed}</div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div><strong>Color:</strong>{pet.petColor}</div>
                                                            <div><strong>Age:</strong>{pet.petAge}</div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div className='d-flex gap-2'>
                                                    <Button
                                                        variant='outline-primary'
                                                        size='sm'
                                                        onClick={() => handleEditPet(index)}
                                                        title='Edit Pet'
                                                    >
                                                        <FaEdit/>
                                                    </Button>
                                                    <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        onClick={() => removePet(index)}
                                                        title='Remove Pet'
                                                    >
                                                        <FaTimes/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                                <Button
                                    variant='outline-primary'
                                    size='sm'
                                    onClick={handleAddAnotherPet}
                                    className='mb-3 w-100'
                                >
                                    <FaPlus className='me-2'/>
                                    Add Another Pet
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h6>Animal Group Information</h6>
                            <Button
                                variant='link'
                                size='sm'
                                onClick={() => setOwnerType('')}
                            >
                                <i className='bi bi-arrow-left me-1'></i>
                                Change Owner Type
                            </Button>
                        </div>
                        {animalGroup.length === 0 ? (
                            <div className='text-center py-4'>
                                <p className='text-muted mb-3'>No animal groups added yet</p>
                                <Button
                                    variant='success'
                                    onClick={handleAddAnotherAnimal}
                                >
                                    <FaPlus className='me-2'/>
                                    Add your first animal group
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/**Display added animal group*/}
                                {animalGroup.map((group, index) => (
                                    <Card key={index} className='mb-3 shadow-sm'>
                                        <Card.Body>
                                            <div className='d-flex justify-content--between align-items-start'>
                                                <div className='flex-grow-1'>
                                                    <h6 className='mb-2'>
                                                        <Badge bg='success' className='me-2'>
                                                            Group {index + 1}
                                                        </Badge>
                                                        {group.animalType}
                                                    </h6>
                                                    <div className='text-muted'>
                                                        <strong>Count:</strong> {group.animalCount} animals
                                                    </div>
                                                </div>
                                                <div className='d-flex gap-2'>
                                                    <Button
                                                        variant='outline-success'
                                                        size='sm'
                                                        onClick={() => handleEditAnimal(index)}
                                                        title='Edit animal group'
                                                    >
                                                        <FaEdit/>
                                                    </Button>
                                                    <Button
                                                        variant='outline-danger'
                                                        size='sm'
                                                        onClick={() => removeAnimalGroup(index)}
                                                        title='Remove animal group'
                                                    >
                                                        <FaTimes/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                                <Button
                                    variant='outline-success'
                                    size='sm'
                                    onClick={handleAddAnotherAnimal}
                                    className='mb-3 w-100'
                                >
                                    <FaPlus className='me-2'/>
                                    Add Another Animal Group
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#f8f9fa'}}>
                <Button variant='secondary' onClick={handleModalClose}>
                    Cancel
                </Button>
                {ownerType && (
                    <Button 
                        variant='primary' 
                        onClick={handleComplete}
                        disabled={
                            (ownerType === 'PET_OWNER' && pets.length === 0) || 
                            (ownerType === 'FARMER' && animalGroup.length === 0)
                        }
                    >
                        Complete
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    </>
  );
};

export default OwnerTypeSelectionModal;