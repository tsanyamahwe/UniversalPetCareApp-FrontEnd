import React, { useState } from 'react';
import { dateTimeFormatter } from '../utils/Utilities';
import { useParams } from 'react-router-dom';
import { Card, Col, Container, Row, Form, OverlayTrigger, Tooltip, Button, Alert} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PetEntry from '../pets/PetEntry';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { FaPlus } from 'react-icons/fa';
import { bookAppointment } from './AppointmentService';
import AlertMessage from '../common/AlertMessage';
import ProcessSpinner from '../common/ProcessSpinner';
import { savePets } from '../pets/PetService';
import OwnerTypeSelectionModal from '../modals/OwnerTypeSelectionModal';

const BookAppointment = () => {
    const[isProcessing, setIsProcessing] = useState(false);
    const[showOwnerTypeModal, setShowOwnerTypeModal] = useState(false);
    const[ownerTypeData, setOwnerTypeData] = useState(null);
    const[formData, setFormData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        // pets: [
        //     {
        //         petName: "",
        //         petAge: "",
        //         petColor: "",
        //         petType: "",
        //         petBreed: "",                
        //     },
        // ],
    });

    const{successMessage, setSuccessMessage, showSuccessAlert, setShowSuccessAlert, errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const{recipientId} = useParams();
    const senderId = localStorage.getItem("userId");

    const handleDateChange = (date) => {
        setFormData((previousState) => ({
            ...previousState,
            appointmentDate: date,
        }));
    };

    const handleTimeChange = (time) => {
        setFormData((previousState) => ({
            ...previousState,
            appointmentTime: time,
        }));
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(previousState => ({
            ...previousState,
            [name]: value
        }));
    };

    // const handlePetChange = (index, e) => {
    //     const{name, value} = e.target;
    //     setFormData((previousState) => ({
    //         ...previousState, 
    //         pets: previousState.pets.map((pet, idx) => 
    //             idx === index ? {...pet, [name]: value} : pet),
    //     }));
    // };

    // const addPet = () => {
    //     const newPet = {
    //         petName: "",
    //         petAge: "",
    //         petColor: "",
    //         petType: "",
    //         petBreed: "",
    //     }
    //     setFormData((previousState) => ({
    //         ...previousState, 
    //         pets: [...previousState.pets, newPet],
    //     }));
    // };

    // const removePet = (index, e) => {
    //     const filteredPets = formData.pets.filter((_, idx) => idx !== index);
    //     setFormData((previousState) => ({
    //         ...previousState, pets: filteredPets,
    //     }));
    // };

    const handleOwnerTypeComplete = (data) => {
        setOwnerTypeData(data);
        setShowOwnerTypeModal(false);
    };

    const handleEditOwnerType = () => {
        setShowOwnerTypeModal(true);
    };

    const getDisplayText = () => {
        if(!ownerTypeData) return '';

        if(ownerTypeData.ownerType ==='PET_OWNER'){
            const petCount = ownerTypeData.pets?.length || 0;
            return `Pet Owner - ${petCount} pet${petCount !== 1 ? 's' : ''}`;
        }else if(ownerTypeData.ownerType === 'FARMER'){
            const totalAnimals = (ownerTypeData.animalGroups || []).reduce(
                (sum, group) => sum + parseInt(group.animalCount || 0),
                0
            );
            const groupCount = ownerTypeData.animalGroups?.length || 0;
            return `Farmer - ${totalAnimals} animals in ${groupCount} group${groupCount !== 1 ? 's' : ''}`;
        }
        return '';
    }

const handleSubmit = async (e) => {
    e.preventDefault();

    if(!ownerTypeData){
        setErrorMessage('Please select your owner type and provide pet/animal information');
        setShowErrorAlert(true);
        return;
    }
    
    const {appointmentDate, appointmentTime} = formData;
    const {formattedDate, formattedTime} = dateTimeFormatter(appointmentDate, appointmentTime);
    // const pets = formData.pets.map((pet) =>({
    //     name: pet.petName,
    //     age: pet.petAge,
    //     color: pet.petColor,
    //     type: pet.petType,
    //     breed: pet.petBreed, 
    // }));
    let pets = [];

    if(ownerTypeData.ownerType === 'PET_OWNER'){
        //Individual pets
        pets = (ownerTypeData.pets || []).map((pet) => ({
            name: pet.petName,
            age: parseInt(pet.petAge),
            color: pet.petColor,
            type: pet.petType,
            breed: pet.petBreed,
            isAnimalGroup: false,
            animalCount: null,
            ownerType: 'PET_OWNER'
        }));
    }else if(ownerTypeData.ownerType === 'FARMER'){
        //Animal groups
        pets = (ownerTypeData.animalGroups || []).map((group) => ({
            name: `${group.animalType} Group`,
            age: 0, //Not applicable for groups
            color: 'N/A', //Not applicable for groups
            type: group.animalType,
            breed: 'Mixed', //Not applicable for groups
            isAnimalGroup: true,
            animalCount: parseInt(group.animalCount),
            ownerType: 'FARMER'
        }))
    }

    const appointmentRequest = {
        appointment: {
            appointmentDate: formattedDate,
            appointmentTime: formattedTime,
            reason: formData.reason,
        },
        pets: pets,
    };

    setIsProcessing(true);

    try {
        const appointmentResponse = await bookAppointment(senderId, recipientId, appointmentRequest);
        const appointmentId = appointmentResponse.appointment_id;
        const petsWithAppointmentId = pets.map(pet => ({
            ...pet,
            appointment_id: appointmentId,
        }));

        const petResponse = await savePets(petsWithAppointmentId);
        const combinedResponse = `${appointmentResponse.message} ${petResponse.message}`;
        setSuccessMessage(combinedResponse);
        handleReset();
        setShowSuccessAlert(true);
    } catch (error) {
        console.error('Booking error:', error);
        let errorMessage = "An error occurred while booking the appointment";
        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = "Please log in to make a booking";
            } else if (error.response.status === 403) {
                errorMessage = "You do not have permission to make this booking";
            } else {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            }
        } else if (error.request) {
            errorMessage = "Please log in to make a booking";
        } else if (error.message) {
            errorMessage = error.message;
        }
        setErrorMessage(errorMessage);
        setShowErrorAlert(true);
    } finally {
        setTimeout(() => {
            setIsProcessing(false);
        }, 3000);  
    }
};

    const handleReset = () => {
        setFormData({
            appointmentDate: "",
            appointmentTime: "",
            reason: "",
            // pets: [
            //     {
            //         petName: "",
            //         petAge: "",
            //         petColor: "",
            //         petType: "",
            //         petBreed: "",
            //     },
            // ],
        });
        setOwnerTypeData(null);
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
    };

  return (
    <>
        <OwnerTypeSelectionModal
            show={showOwnerTypeModal}
            onHide={() => setShowOwnerTypeModal(false)}
            onComplete={handleOwnerTypeComplete}
            initialData={ownerTypeData}
        />

        <Container className='mt-5'>
            <Row className='justify-content-center'>
                <Col lg={6} md={9} sm={12}>
                    <Form onSubmit={handleSubmit}>
                        <Card className='shadow mb-4'>
                            <Card.Header as='h5'  className='text-center'>Appointment Booking Form</Card.Header> 
                            <Card.Body>
                                <fieldset className='field-set mb-3'>
                                    <legend className='text-center'><h6>Appointment Date and Time</h6></legend> 
                                    <Form.Group as={Row} className='mb-2'>
                                        <Col md={6}>
                                            <DatePicker
                                                selected={formData.appointmentDate}
                                                onChange={handleDateChange}
                                                dateFormat='yyyy-MM-dd'
                                                className='form-control'
                                                minDate={new Date()}
                                                placeholderText='Choose a date'
                                                required
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <DatePicker
                                                selected={formData.appointmentTime}
                                                onChange={handleTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={30}
                                                dateFormat='HH:mm'
                                                className='form-control'
                                                placeholderText='Select time'
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                </fieldset>
                                <Form.Group className='mb-4'>
                                    <Form.Label><b>Reason for appointment</b></Form.Label>
                                    <Form.Control
                                        as='textarea' 
                                        rows={3}
                                        name='reason'
                                        onChange={handleInputChange}
                                        value={formData.reason}
                                        required
                                        />
                                </Form.Group>

                                <div className='mb-3'>
                                    <h6 className='text-center mb-3'>Owner Type and Animal Information</h6>
                                    {!ownerTypeData ? (
                                        <center>
                                            <div>
                                                <center>
                                                    <Button
                                                        variant='outline-primary'
                                                        onClick={() => setShowOwnerTypeModal(true)}
                                                    >
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Add Owner Type & Animals
                                                    </Button>
                                                </center>
                                                <div className='text-muted small mt-2'>
                                                    Click to specify if you are a pet owner or farmer
                                                </div>
                                            </div>
                                        </center>
                                    ) : (
                                        <Alert variant='info'>
                                            <div className='d-flex justify-content-between align-items-start'>
                                                <div>
                                                    <strong>Owner Type:</strong>
                                                    <div>{getDisplayText()}</div>
                                                </div>
                                                <Button
                                                    variant='link'
                                                    size='sm'
                                                    onClick={handleEditOwnerType}
                                                    disabled={isProcessing}
                                                >
                                                    <i className='bi bi-pencil me-1'></i>
                                                    Edit
                                                </Button>
                                            </div>
                                        </Alert>
                                    )}
                                </div>
                                {/* <h6 className='text-center'>Appointment Pet Information</h6>
                                {formData.pets.map((pet, index) => (
                                    <PetEntry
                                        key={index}
                                        pet={pet}
                                        index={index}
                                        handleInputChange={(e) => handlePetChange(index, e)}
                                        removePet={removePet}
                                        canRemove={formData.pets.length > 1}
                                    />
                                ))} */}
                                {showErrorAlert && (
                                    <AlertMessage type={"danger"} message={errorMessage}/>
                                )}

                                {showSuccessAlert &&(
                                    <AlertMessage type={"success"} message={successMessage}/>
                                )}

                                <div className='d-flex justify-content-center mb-3'>
                                    {/* <OverlayTrigger overlay={<Tooltip>Add pets</Tooltip>}>
                                        <Button size='sm' onClick={addPet} className='me-2'>
                                            <FaPlus/>
                                        </Button>
                                    </OverlayTrigger> */}
                                    <Button 
                                        type='submit' 
                                        variant='outline-primary' 
                                        size='sm' 
                                        className='me-2' 
                                        disabled={isProcessing}
                                    >
                                        {isProcessing? (
                                            <ProcessSpinner message="Booking appointment, please wait!"/>
                                        ):(
                                            "Book Appointment"
                                        )}
                                    </Button>
                                    <Button 
                                        variant='outline-info' 
                                        size='sm' 
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>      
        </Container>
    </>
  );
};

export default BookAppointment;
