import React from 'react';
import { Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieChart } from 'recharts';
import useColorMapping from '../hooks/ColorMapping';

const CustomPieChart = ({data, dataKey="value", nameKey="name", width="110%", height=380}) => {
    const colors = useColorMapping();
    
  return (
    <section>
        <h4 className='text-center mt-4'>Appointments Overview</h4>
        <ResponsiveContainer width={width} height={height}>
            <PieChart>
                <Pie data={data} dataKey={dataKey} label={({[nameKey]: name}) => name}>
                    {data && 
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[entry[nameKey]]}/>
                    ))}
                </Pie>
                <Tooltip/>
                <Legend layout='vertical'/>
            </PieChart>
        </ResponsiveContainer>
    </section>
  );
}

export default CustomPieChart
