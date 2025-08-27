// AdminOverview.js
import React, { useEffect, useState } from 'react';
import { countUsers, countVeterinarians, countPatients } from '../user/UserService';
import CardComponent from '../cards/CardComponent';
import { BsPeopleFill } from 'react-icons/bs';
import { countAppointments } from '../appointment/AppointmentService';
import RegistrationChart from '../charts/RegistrationChart';
import AppointmentChart from '../charts/AppointmentChart';
import {Col, Row} from 'react-bootstrap';
import AccountChart from '../charts/AccountChart';
import VetSpecializationChart from '../charts/VetSpecializationChart';

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(0);
  const [veterinarianCount, setVeterinarianCount] = useState(0);
  const [patientCount, setPatientsCount] = useState(0);
  const[appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
        try {
            const userCount = await countUsers();
            const vetCount = await countVeterinarians();
            const patCount = await countPatients();
            const appCount = await countAppointments();
            setUserCount(userCount);
            setVeterinarianCount(vetCount);
            setPatientsCount(patCount);
            setAppointmentCount(appCount);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };
    fetchCounts();
  }, []);

  return (
    <main>
        <h5 className='chart-title'>Activities Overview</h5>
        <div className='justify-content'>
            <div className='main-card'>
                <CardComponent
                    className='tab-card'
                    label={'USERS'}
                    count={userCount}
                    IconComponent={BsPeopleFill}
                    colorVariant='users'
                />

                <CardComponent
                    className='tab-card' 
                    label={'APPOINTMENTS'}
                    count={appointmentCount}
                    IconComponent={BsPeopleFill}
                    colorVariant='appointments'
                />

                <CardComponent
                    className='tab-card' 
                    label={'VETERINARIANS'}
                    count={veterinarianCount}
                    IconComponent={BsPeopleFill}
                    colorVariant='veterinarians'
                />

                <CardComponent
                    className='tab-card' 
                    label={'PATIENTS'}
                    count={patientCount}
                    IconComponent={BsPeopleFill}
                    colorVariant='patients'
                />
            </div>
        </div>
        <div className='charts'>
            <Col>
                <Row>
                    <Col>
                        <div className='chart-container'>
                            <RegistrationChart/>
                        </div>
                    </Col>
                    <Col>
                        <div className='chart-container'>
                            <AppointmentChart/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className='chart-container'>
                            <VetSpecializationChart/>
                        </div>
                    </Col>
                    <Col>
                        <div className='chart-container'>
                            <AccountChart/>
                        </div>
                    </Col>
                </Row>
            </Col>
        </div>
    </main>
  );
};

export default AdminOverview;