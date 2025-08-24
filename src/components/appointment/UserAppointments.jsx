import React, { useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import PetsTable from '../pets/PetsTable';
import { formatAppointmentStatus, UserType } from '../utils/Utilities';
import useColorMapping from '../hooks/ColorMapping';
import PatientActions from '../actions/PatientActions';
import VeterinarianActions from '../actions/VeterinarianActions';
import { updateAppointment, cancelAppointment, approveAppointment, declineAppointment, getAppointmentById } from './AppointmentService';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import AlertMessage from '../common/AlertMessage';
import UserInformation from '../common/UserInformation';
import { Link, useParams } from 'react-router-dom';
import AppointmentFilter from './AppointmentFilter';
import Paginator from '../common/Paginator';

const UserAppointments = ({user, appointments:initialAppointments}) => {
    const[appointments, setAppointments] = useState(initialAppointments);
    const colors = useColorMapping();
    const{recipientId} = useParams();
    const[selectedStatus, setSelectedStatus] = useState("all");
    const[filteredAppointments, setFilteredAppointments] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);
    const[appointmentsPerPage] = useState(4);
    const[refreshKey, setRefreshKey] = useState(0);
    const[statuses, setStatuses] = useState([]); // Add statuses state

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const fetchAppointment = async(appointmentId) => {
        try {
            const response = await getAppointmentById(appointmentId);
            const updatedAppointment = response.data;
            setAppointments(prevAppointments => {
                const newAppointments = prevAppointments.map((appointment) => {
                    if (appointment.id === updatedAppointment.id) {
                        // Create a deep copy of the updated appointment
                        return {
                            ...updatedAppointment,
                            pets: [...updatedAppointment.pets] // Ensure pets array is a new reference
                        };
                    }
                    return appointment;
                });
                return newAppointments;
            });
            setRefreshKey(previous => previous + 1);
        } catch (error) {
            console.error(error);
        }
    };

    // Update appointments when initialAppointments changes
    useEffect(() => {
        setAppointments(initialAppointments);
    }, [initialAppointments]);

    const handlePetsUpdate = async(updatedAppointmentId) => {
        try {
            await fetchAppointment(updatedAppointmentId);
        } catch (error) {
            console.error(error);
        }
    };

    //For Veterinarians:
    //1. Approve Appointment
    const handleApproveAppointment = async (appointmentId) => {
          try {
            const response = await approveAppointment(appointmentId);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            await fetchAppointment(appointmentId);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    };

    //2. Decline Appointment
     const handleDeclineAppointment = async (appointmentId) => {
        try {
            const response = await declineAppointment(appointmentId);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            await fetchAppointment(appointmentId);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    };

    //For Patients
    //1. Update Appointment
    const handleUpdateAppointment = async (updatedAppointment) => {
        try {
            const result = await updateAppointment(updatedAppointment.id, updatedAppointment);
            setAppointments(prevAppointments => 
                prevAppointments.map((appointment) => {
                    if (appointment.id === updatedAppointment.id) {
                        return {
                            ...updatedAppointment,
                            pets: [...updatedAppointment.pets]
                        };
                    }
                    return appointment;
                })
            );
            setSuccessMessage(result.data.message);
            setShowSuccessAlert(true);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error(error);
        }
    };

    //2. Cancel Appointment
    const handleCancelAppointment = async (appointmentId) => {
        try {
            const response = await cancelAppointment(appointmentId);
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            await fetchAppointment(appointmentId);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowErrorAlert(true);
        }
    };

    const onSelectStatus = (status) => {
        setSelectedStatus(status);
    };

    const handleClearFilter = () => {
        setSelectedStatus("all");
        setCurrentPage(1);
    };

    // Calculate statuses when user or appointments change
    useEffect(() => {
        const userAppointments = appointments.filter(appointment =>{
            //For patients, filter by patient ID
            if (user.userType === UserType.PATIENT) {
                return appointment.patient && appointment.patient.id === user.id;
            }
            // For veterinarians, filter by veterinarian ID
            if (user.userType === UserType.VET) {
                return appointment.veterinarian && appointment.veterinarian.id === user.id;
            }
            return true; // fallback
        });

        const uniqueStatuses = Array.from(new Set(userAppointments.map((appointment) => appointment.status)));
        setStatuses(uniqueStatuses);
    }, [appointments, user.id, user.userType]);

    // Filter appointments based on user and selected status
    useEffect(()=>{
        // First, filter appointments for the current user
        const userAppointments = appointments.filter(appointment =>{
            //For patients, filter by patient ID
            if (user.userType === UserType.PATIENT) {
                return appointment.patient && appointment.patient.id === user.id;
            }
            // For veterinarians, filter by veterinarian ID
            if (user.userType === UserType.VET) {
                return appointment.veterinarian && appointment.veterinarian.id === user.id;
            }
            return true; // fallback
        });

        // Then, filter by selected status
        let filter = userAppointments;
        if(selectedStatus && selectedStatus !== "all"){
            filter = userAppointments.filter((appointment) => appointment.status === selectedStatus);
        }
        setFilteredAppointments(filter);
    }, [selectedStatus, appointments, refreshKey, user.id, user.userType]);

    const indexOfLastVet = currentPage * appointmentsPerPage;
    const indexOfFirstVet = indexOfLastVet - appointmentsPerPage;

    const currentAppointments = filteredAppointments.slice(indexOfFirstVet, indexOfLastVet);

  return (
    <Container className='p-0'>
        {showErrorAlert && (<AlertMessage type={"danger"} message={errorMessage}/>)}
        {showSuccessAlert && (<AlertMessage type={"success"} message={successMessage}/>)}
        <AppointmentFilter
            onClearFilters={handleClearFilter}
            statuses={statuses}
            onSelectStatus={onSelectStatus}
            selectedStatus={selectedStatus}
        />
        <Accordion className='mt-1 mb-3'>
            {currentAppointments.map((appointment, index) =>{
                const formattedStatus = formatAppointmentStatus(appointment.status);
                const statusColor = colors[formattedStatus] || colors["default"];
                const isWaitingForApproval = formattedStatus === "waiting-for-approval";
                const isApproved = formattedStatus === "approved";                
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
                                {isApproved && (
                                    <UserInformation
                                        userType={user.userType}
                                        appointment={appointment}
                                    />
                                )}
                            </Row>
                            {user && user.userType === UserType.PATIENT &&(
                                <Link to={`/book-appointment/${recipientId}/new-appointment`}>Book New Appointment</Link>
                            )}
                            
                            {user && user.userType === UserType.PATIENT && (
                                <div>
                                    <PatientActions
                                        appointment={appointment}
                                        onCancel={handleCancelAppointment}
                                        onUpdate={handleUpdateAppointment}
                                        isDisabled={!isWaitingForApproval}
                                    />
                                </div>
                            )}
                            {user && user.userType === UserType.VET && (
                                <div>
                                    <VeterinarianActions
                                        appointment={appointment}
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
        <Paginator 
            itemsPerPage={appointmentsPerPage} 
            totalItems={filteredAppointments.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
        />  
    </Container>
  );
};

export default UserAppointments;