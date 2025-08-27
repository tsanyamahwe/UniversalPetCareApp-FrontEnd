import React, { useEffect, useState } from 'react';
import { generateColor } from '../utils/Utilities';
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { aggregateVeterinariansBySpecialization } from '../user/UserService';

const VetSpecializationChart = () => {
    const[vetSpecialization, setVetSpecialization] = useState([]);
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchVeterinariansAndProcessData = async () => {
            try {
                const response = await aggregateVeterinariansBySpecialization();
                const veterinarians = response;

                const processedData = veterinarians.map((vet) => ({
                    ...vet,
                    color: generateColor(vet.specialization),
                }));
                setVetSpecialization(processedData);
            } catch (error) {
                setErrorMessage(error.errorMessage);
                console.error(errorMessage);
            }
        };
        fetchVeterinariansAndProcessData();
    }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  width: '60%'}}>
        <h5 className='mt-4 chart-title' style={{ margin: '0 0 10px 0' }}>Veterinarian By Specializations</h5>
        <ResponsiveContainer width={"100%"} height={380}>
            <BarChart data={vetSpecialization}>
                <XAxis
                    dataKey='specialization'
                    angle={-30}
                    textAnchor='end'
                    height={70}
                />
                <YAxis/>
                <Tooltip
                    content={(props) => {
                        const {payload} = props;
                        if(payload && payload.length){
                            return(
                                <div style={{backgroundColor: "#aab5b0"}} className='p-4'>
                                    <p className='text-primary'>
                                        {payload[0].payload.specialization}:{" "}
                                        {payload[0].payload.count}
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Legend/>
                <Bar dataKey='count' fill='8884d8'>
                    {vetSpecialization.map((entry, index) =>(
                        <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default VetSpecializationChart;
