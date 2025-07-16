import React from 'react';
import { Accordion, Button, Col, Container, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import PetsTable from '../pets/PetsTable';

const UserAppointments = ({appointments}) => {
    const handlePetsUpdate = () => {

    }
  return (
    <Container className='p-5'>
        <Accordion className='mt-1 mb-3'>
            {appointments.map((appointment, index) =>{
                return(
                    <Accordion.Item eventKey={index} key={index} className='mb-2'>
                        <Accordion.Header>
                            <div>
                                <div className='mb-3'>Date: {appointment.appointmentDate}</div>
                                <div>Status: {appointment.status}</div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col md={4} className='mt-2'>
                                    <p>
                                        Appointment Number: {""}<span className='text-info'>{appointment.appointmentNo}</span>{""}
                                    </p>
                                    <ReactDatePicker
                                        selected={
                                            new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
                                        }
                                        showTimeSelect
                                        timeFormat='HH:mm'
                                        timeIntervals={30}
                                        timeCaption='time'
                                        dateFormat='MMMM d, yyyy h:mm aa'
                                        inline
                                    />
                                    <p>
                                        Time:
                                        <span className='text-info'>
                                            {""}
                                            {appointment.appointmentTime}
                                        </span>{""}
                                    </p>
                                    <p>Reason: {appointment.reason}</p>
                                </Col>
                                <Col md={8} className='mt-2'>
                                <h5>Pets:</h5>
                                <PetsTable
                                    pets={appointment.pets}
                                    appointmentId={appointment.id}
                                    onPetsUpdate={handlePetsUpdate}
                                    isEditable={""}
                                />
                                </Col>
                            </Row>
                            <div>
                                <Button variant='warning' size='sm'>Update Appointment</Button>
                                <Button variant='danger' size='sm' className='ms-2'>Cancel Appointment</Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                );
            })}
        </Accordion>      
    </Container>
  )
}

export default UserAppointments;
