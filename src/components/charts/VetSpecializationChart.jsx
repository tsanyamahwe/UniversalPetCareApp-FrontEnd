import React, { useEffect, useState } from 'react';
import { generateColor } from '../utils/Utilities';
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { aggregateVeterinariansBySpecialization } from '../user/UserService';
import NoDataAvailable from '../hooks/NoDataAvailable';

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
    <section>
        {vetSpecialization && vetSpecialization.length > 0 ? (
            <React.Fragment>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  width: '60%'}}>
                <h5 className='mt-4 chart-title' style={{ margin: '0 0 10px 0' }}>Veterinarian By Specializations</h5>
                    <ResponsiveContainer width={"140%"} height={380}>
                        <BarChart data={vetSpecialization} margin={{top: 5, right: 20, left: 30, bottom: 5}}>
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
            </React.Fragment>
        ):(
            <NoDataAvailable dataType = {"veterinarian specialization data"} message={errorMessage}/>
        )}
    </section>
  );
};

export default VetSpecializationChart;
