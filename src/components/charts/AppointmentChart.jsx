import React, { useEffect, useState } from 'react'
import CustomPieChart from './CustomPieChart';
import { getAppointmentsSummary } from '../appointment/AppointmentService';
import NoDataAvailable from '../hooks/NoDataAvailable';

const AppointmentChart = () => {
    const[appointmentData, setAppointmentData] = useState([]);
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getAppointmentsInfo = async () => {
            try {
                const response = await getAppointmentsSummary();
                setAppointmentData(response.data);
            } catch (error) {
                setErrorMessage(error.errorMessage);
                console.error(errorMessage);
            }
        }
        getAppointmentsInfo();
    }, []);

  return (
    <section>
        {appointmentData && appointmentData.length > 0 ? (
            <React.Fragment>
                <h5 className='chart-title' style={{ margin: '0 0 10px 0' }}>Appointments</h5>
                <CustomPieChart data={appointmentData}/>
            </React.Fragment>
        ):(
            <NoDataAvailable dataType = {"appointment data"} message={errorMessage}/>
        )}
        
    </section>
  );
};

export default AppointmentChart;
