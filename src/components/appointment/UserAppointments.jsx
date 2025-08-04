import React, { useState } from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import PetsTable from '../pets/PetsTable';
import { formatAppointmentStatus, UserType } from '../utils/Utilities';
import useColorMapping from '../hooks/ColorMapping';
import PatientActions from '../actions/PatientActions';
import VeterinarianActions from '../actions/VeterinarianActions';
import { updateAppointment } from './AppointmentService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';

const UserAppointments = ({user, appointments:initialAppointments}) => {
    const[appointments, setAppointments] = useState(initialAppointments);
    const handlePetsUpdate = () => {};
    const colors = useColorMapping();

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    //For Veterinarians:
    //1. Approve Appointment
    const handleApproveAppointment = () => {}
    //2. Decline Appointment
    const handleDeclineAppointment = () => {}

    //For Patients
    //1. Update Appointment
    const handleUpdateAppointment = async (updatedAppointment) => {
        try {
            const result = await updateAppointment(updatedAppointment.id, updatedAppointment);
            setAppointments(appointments.map((appointment) => appointment.id === updatedAppointment.id ? updatedAppointment : appointment));
            console.log("The result from update:", result);
            setSuccessMessage(result.data.message);
            setShowSuccessAlert(true);
        } catch (error) {
            console.error(error);
        }
    }
    //2. Cancel Appointment
    const handleCancelAppointment = () => {}

  return (
    <Container className='p-5'>
        <Accordion className='mt-1 mb-3'>
            {appointments.map((appointment, index) =>{
                const formattedStatus = formatAppointmentStatus(appointment.status);
                const statusColor = colors[formattedStatus] || colors["default"];
                const isWaitingForApproval = formattedStatus === "waiting-for-approval";
                return(
                    <Accordion.Item eventKey={index} key={index} className='mb-2'>
                        <Accordion.Header>
                            <div>
                                <div className='mb-3'>Date: {appointment.appointmentDate}</div>
                                <div style={{color: statusColor}}>Status: {formattedStatus}</div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col md={4} className='mt-2'>
                                    <p>Appointment Number: {""}<span className='text-info'>{appointment.appointmentNo}</span>{""}</p>
                                    <ReactDatePicker
                                        selected={new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)}
                                        showTimeSelect
                                        timeFormat='HH:mm'
                                        timeIntervals={30}
                                        timeCaption='time'
                                        dateFormat='MMMM d, yyyy h:mm aa'
                                        inline
                                    />
                                    <p>Time:<span className='text-info'>{""}{appointment.appointmentTime}</span>{""}</p>
                                    <p>Reason: {appointment.reason}</p>
                                </Col>
                                <Col md={8} className='mt-2'>
                                <h5>Pets:</h5>
                                <PetsTable
                                    pets={appointment.pets}
                                    appointmentId={appointment.id}
                                    onPetsUpdate={handlePetsUpdate}
                                    isEditable={isWaitingForApproval}
                                    isPatient={user.userType === UserType.PATIENT}
                                />
                                </Col>
                            </Row>
                            {user && user.userType === UserType.PATIENT && (
                                <div>
                                    <PatientActions
                                        onCancel={handleCancelAppointment}
                                        onUpdate={handleUpdateAppointment}
                                        isDisabled={!isWaitingForApproval}
                                    />
                                </div>
                            )}
                            {user && user.userType === UserType.VET && (
                                <div>
                                    <VeterinarianActions
                                        onDecline={handleDeclineAppointment}
                                        onApprove={handleApproveAppointment}
                                        isDisabled={!isWaitingForApproval}
                                    />
                               </div>
                            )}
                            
                        </Accordion.Body>
                    </Accordion.Item>
                );
            })}
        </Accordion>      
    </Container>
  )
}

export default UserAppointments;
