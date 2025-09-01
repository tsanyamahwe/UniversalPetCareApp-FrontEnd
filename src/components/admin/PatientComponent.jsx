import React, { useEffect, useMemo, useState } from 'react'
import { Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Link } from 'react-router-dom';
import { BsEyeFill } from 'react-icons/bs';
import AlertMessage from '../common/AlertMessage';
import { getPatients } from '../patient/PatientService';
import UserFilter from '../user/UserFilter';
import Paginator from '../common/Paginator';

const PatientComponent = () => {
    const[patients, setPatients] = useState([]);
    const[selectedEmail, setSelectedEmail] = useState("");
    const[currentPage, setCurrentPage] = useState(1);
    const[patientsPerPage, setPatientsPerPage] = useState(10);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const fetchPatients = async () => {
        try {
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorAlert(true);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [])

    const emails = useMemo(() => {
        const uniqueEmails = [...new Set(patients.map(patient => patient.email))];
        return uniqueEmails.filter(email => email);
    }, [patients]);

    const filteredPatients = useMemo(() => {
        if(!selectedEmail){
            return patients;
        }
        return patients.filter(patient => patient.email === selectedEmail);
    }, [patients, selectedEmail]);

    const handleClearFilters = () => {
        setSelectedEmail("");
    }

    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
    
  return (
    <main>
        <h3>List of Patients</h3>
        <Row>
            <Col></Col>
            <Col>
                {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}
                {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                {" "}
                <UserFilter
                values={emails} 
                selectedValue={selectedEmail}
                onSelectValue={setSelectedEmail}
                onClearFilters={handleClearFilters}
                label={"emails"}
            />
            </Col> 
        </Row>
        <Table bordered hover striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Gender</th>
                    <th>Registered on</th>
                    <th colSpan={2}>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentPatients.map((patient, index) => (
                    <tr key={index}>
                        <td>{patient.id}</td>
                        <td>{patient.firstName}</td>
                        <td>{patient.lastName}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phoneNumber}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.createdAt}</td>
                        <td>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip-view-${index}`}>View Patient Details</Tooltip>
                                }>
                                <Link to={`user-dashboard/${patient.id}/my-dashboard`} className='text-info'>
                                    <BsEyeFill/>
                                </Link>
                            </OverlayTrigger>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Paginator
            paginate={setCurrentPage}
            currentPage={currentPage}
            itemsPerPage={patientsPerPage}
            totalItems={filteredPatients.length}
        />
    </main>
  )
}

export default PatientComponent;
