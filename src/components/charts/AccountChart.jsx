import React, { useEffect, useState } from 'react'
import { getAggregatedUsersAccountsByActiveStatus } from '../user/UserService';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import NoDataAvailable from '../hooks/NoDataAvailable';

const AccountChart = () => {
    const[accountData, setAccountData] = useState([]);
    const[errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const getAccountActivity = async () => {
            try {
                const response = await await getAggregatedUsersAccountsByActiveStatus();
                const accountActivity = response.data;
                //Tranforming the back-end data into the desired format
                const transformedData = Object.entries(accountActivity).flatMap(
                    ([status, counts]) => [
                        {
                            name: "Active Patients",
                            value: status === "Enabled" ? counts.PATIENT : 0,
                            color: "#d26161",
                        },
                        {
                            name: "Non-Active Patients",
                            value: status === "Enabled" ? 0 : counts.PATIENT,
                            color: "#926262",
                        },
                        {
                            name: "Active Veterinarians",
                            value: status === "Enabled" ? counts.VET : 0,
                            color: "#2f6a32",
                        },
                        {
                            name: "Non-Active Veterinarians",
                            value: status === "Enabled" ? 0 : counts.VET,
                            color: "#557a56",
                        }
                    ]
                );
                setAccountData(transformedData);
            } catch (error) {
                setErrorMessage(error.errorMessage);
                console.error(errorMessage);
            }
        };
        getAccountActivity();
    }, []);

  return (
    <section>
        {accountData && accountData.length > 0 ? (
            <React.Fragment>
                <div>
                <h5 className='mt-4 chart-title' style={{ margin: '0 0 10px 0' }}>Account Activity</h5>
                    <ResponsiveContainer width={"80%"} height={415}>
                        <PieChart>
                            <Pie
                                data={accountData}
                                dataKey='value'
                                nameKey='name'
                                outerRadius={120}
                                fill='#8884d8'
                                label>
                                {accountData.map((entry, index) =>(
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </React.Fragment>
        ):(
            <NoDataAvailable dataType = {"account data"} message={errorMessage}/>
        )}
    </section>
  );
};

export default AccountChart;
