import React, { useEffect, useState } from 'react'
import CustomPieChart from './CustomPieChart';
import { getAppointmentsSummary } from '../appointment/AppointmentService';

const AppointmentChart = () => {
    const[appointmentData, setAppointmentData] = useState([]);
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getAppointmentsInfo = async () => {
            try {
                const response = await getAppointmentsSummary();
                setAppointmentData(response.data);
                console.log("Logging yeeer: ", response.data);
            } catch (error) {
                setErrorMessage(error.errorMessage);
                console.error(errorMessage);
            }
        }
        getAppointmentsInfo();
    }, []);

  return (
    <div>
        <h5 className='chart-title' style={{ margin: '0 0 10px 0' }}>Appointments</h5>
        <CustomPieChart data={appointmentData}/>
    </div>
  )
}

export default AppointmentChart;
