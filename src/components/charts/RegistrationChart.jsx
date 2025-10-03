import React, { useEffect, useState } from 'react'
import { getAggregateUsersByMonthAndType } from '../user/UserService';
import {Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import NoDataAvailable from '../hooks/NoDataAvailable';

const RegistrationChart = () => {
    const[userData, setUserData] = useState([]);
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await getAggregateUsersByMonthAndType();
                const userData = response.data;
                //Transform the backend data into the desired format
                const transformedData = Object.entries(userData).map(
                    ([month, counts]) => {
                        return{
                            name: month,
                            Veterinarians: counts.VET || 0,
                            Patients: counts.PATIENT || 0,
                        };
                    }
                );
                setUserData(transformedData);
            } catch (error) {
                setErrorMessage(error.errorMessage);
                console.error(errorMessage);
            }
        };
        getUsers();
    }, []);

  return (
    <section>
        {userData && userData.length > 0 ? (
            <React.Fragment>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  width: '60%'}}>
                <h5 className='chart-title' style={{ margin: '0 0 10px 0' }}>Users Registrations</h5>
                    <ResponsiveContainer width={"140%"} height={425}>
                        <BarChart data={userData} margin={{top: 5, right: 20, left: 20, bottom: 5}}>
                            <XAxis dataKey='name' angle={-50} textAnchor='end' height={70}/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey={"Veterinarians"} fill='#2f6a32'/>
                            <Bar dataKey={"Patients"} fill='#d26161'/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </React.Fragment>
        ):(
            <NoDataAvailable dataType = {"user registration data"} message={errorMessage}/>
        )}
    </section>
  );
};

export default RegistrationChart;
