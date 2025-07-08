import React, { useState } from 'react';
import { dateTimeFormatter } from '../utils/Utilities';
import { useParams } from 'react-router-dom';
import { Card, Col, Container, Row, Form, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import PetEntry from '../pets/PetEntry';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { FaPlus } from 'react-icons/fa';
import { bookAppointment } from './AppointmentService';
import AlertMessage from '../common/AlertMessage';
import ProcessSpinner from '../common/ProcessSpinner';
import { savePets } from '../pets/PetService';

const BookAppointment = () => {
    const[isProcessing, setIsProcessing] = useState(false);
    const[formData, setFormData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        pets: [
            {
                petName: "",
                petAge: "",
                petColor: "",
                petType: "",
                petBreed: "",                
            },
        ],
    });

    const{successMessage, setSuccessMessage, showSuccessAlert, setShowSuccessAlert, errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const{recipientId} = useParams();
    const senderId = 4;

    const handleDateChange = (date) => {
        setFormData((previousState) => ({
            ...previousState, appointmentDate: date,
        }));
    };

    const handleTimeChange = (time) => {
        setFormData((previousState) => ({
            ...previousState, appointmentTime: time,
        }));
    };

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        setFormData((previousState) => ({
            ...previousState, [name]: value,
        }));
    };

    const handlePetChange = (index, e) => {
        const{name, value} = e.target;
        setFormData((previousState) => ({
            ...previousState, 
            pets: previousState.pets.map((pet, idx) => 
                idx === index ? {...pet, [name]: value} : pet),
        }));
    };

    const addPet = () => {
        const newPet = {
            petName: "",
            petAge: "",
            petColor: "",
            petType: "",
            petBreed: "",
        }
        setFormData((previousState) => ({
            ...previousState, 
            pets: [...previousState.pets, newPet],
        }));
    };

    const removePet = (index, e) => {
        const filteredPets = formData.pets.filter((_, idx) => idx !== index);
        setFormData((previousState) => ({
            ...previousState, pets: filteredPets,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Extract appointmentDate and appointmentTime from formData
        const {appointmentDate, appointmentTime} = formData;
        //Use dateTimerFormatter to format the date and time
        const {formattedDate, formattedTime} = dateTimeFormatter(appointmentDate, appointmentTime);

        //Constructing an array of pet objects from formData.pets
        const pets = formData.pets.map((pet) =>({
            name: pet.petName,
            age: pet.petAge,
            color: pet.petColor,
            type: pet.petType,
            breed: pet.petBreed,
             
        }))

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
            console.log("The appointment request :", appointmentRequest);
            console.log("The pets to save :", pets);

            const appointmentResponse = await bookAppointment(senderId, recipientId, appointmentRequest);
            console.log("The appointment response :", appointmentResponse);

            const appointmentId = appointmentResponse.appointment_id;
            const petsWithAppointmentId = pets.map(pet => ({
                ...pet, appointment_id: appointmentId,
            }))

            const petResponse = await savePets(petsWithAppointmentId);
            console.log("The pet save response :", petResponse);

            const combinedMessage = `${appointmentResponse.message} ${petResponse.message}`;
            setSuccessMessage(combinedMessage);
            
            handleReset();
            setShowSuccessAlert(true);
        } catch (error) {
            console.log("The error :", error);
            setErrorMessage(error.response?.data?.message || 'An error occured');
            setShowErrorAlert(true);
        }finally{
            setTimeout(() => {
                setIsProcessing(false);
            }, 3000)  
        }
    };

    const handleReset = () => {
        setFormData({
            appointmentDate: "",
            appointmentTime: "",
            reason: "",
            pets: [
                {
                    petName: "",
                    petAge: "",
                    petColor: "",
                    petType: "",
                    petBreed: "",
                },
            ],
        });
        setShowSuccessAlert(false);
        setShowErrorAlert(false);
    };

  return (
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
                            <h6 className='text-center'>Appointment Pet Information</h6>
                            {formData.pets.map((pet, index) => (
                                <PetEntry
                                    key={index}
                                    pet={pet}
                                    index={index}
                                    handleInputChange={(e) => handlePetChange(index, e)}
                                    removePet={removePet}
                                    canRemove={formData.pets.length > 1}
                                />
                            ))}
                            {showErrorAlert && (
                                <AlertMessage type={"danger"} message={errorMessage}/>
                            )}

                            {showSuccessAlert &&(
                                <AlertMessage type={"success"} message={successMessage}/>
                            )}

                            <div className='d-flex justify-content-center mb-3'>
                                <OverlayTrigger overlay={<Tooltip>Add pets</Tooltip>}>
                                    <Button size='sm' onClick={addPet} className='me-2'>
                                        <FaPlus/>
                                    </Button>
                                </OverlayTrigger>
                                <Button 
                                    type='submit' 
                                    variant='outline-primary' 
                                    size='sm' className='me-2' 
                                    disabled={isProcessing}>
                                    {isProcessing? (<ProcessSpinner message="Booking appointment, please wait!"/>):("Book Appointment")}
                                </Button>
                                <Button variant='outline-info' size='sm' onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                 </Form>
            </Col>
        </Row>      
    </Container>
  );
};

export default BookAppointment;
