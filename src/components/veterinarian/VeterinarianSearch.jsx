import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import { Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import AlertMessage from '../common/AlertMessage';
import { findAvailableVeterinarians, getVeterinarians, getVetSpecializations } from './VeterinarianService';
import { dateTimeFormatter } from '../utils/Utilities';

const VeterinarianSearch = ({onSearchResult = () => {}}) => {
    const[specializations, setSpecializations] = useState([]);
    const[showDateTime, setShowDateTime] = useState(false);
    const[searchQuery, setSearchQuery] = useState({
        date: null, 
        time: null, 
        specialization: ""
    });

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

     useEffect(() => {
        fetchSpecializations();
        fetchAllVeterinarians();
    }, []);

    const fetchSpecializations = async () => {
        try {
            const response = await getVetSpecializations(); 
            if(response && response.message){
                setSuccessMessage(response.message);
            }
            if (Array.isArray(response)) {
                setSpecializations(response);
            } else if (response.data && Array.isArray(response.data)) {
                setSpecializations(response.data);
            } else if (response.specializations && Array.isArray(response.specializations)) {
                setSpecializations(response.specializations);
            }
        } catch (error) {
            setSpecializations(['Surgeon', 'Urologist', 'Other']);
        }
    };

    const fetchAllVeterinarians = async () => {
        try {
            const response = await getVeterinarians();
            onSearchResult(response.data);
            setShowErrorAlert(false);
        } catch (error) {
            console.log("Error fetching all veterinarians:", error);
            onSearchResult(null);       
            setShowErrorAlert(true);     
        }
    };

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        const updatedQuery = {...searchQuery, [name]: value};
        setSearchQuery(updatedQuery);
        if (name === 'specialization') {
            if (value === '') {
                fetchAllVeterinarians();
                refreshSpecializations();
            }
        }
    };

     const handleDateChange = (date) => {
        setSearchQuery((previousState) => ({
            ...previousState, date: date,
        }));
    };

    const handleTimeChange = (time) => {
        setSearchQuery((previousState) => ({
            ...previousState, time: time,
        }));
    };

    const handleDateTimeToggle = (e) => {
        const isChecked = e.target.checked
        setShowDateTime(isChecked)
        if(!isChecked){
            setSearchQuery({...searchQuery, date: null, time: null});
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if(!searchQuery.specialization && !searchQuery.date && !searchQuery.time){
            await fetchAllVeterinarians();
            return;
        }

        if(!searchQuery.specialization){
            setErrorMessage('Specialization is a required field.');
            setShowErrorAlert(true);
            return;
        }
        
        const{date, time} = searchQuery;
        const{formattedDate, formattedTime} = dateTimeFormatter(date, time);

        let searchParams = {specialization : searchQuery.specialization};
        
        if(searchQuery.date){
            searchParams.date = formattedDate
        }
        if(searchQuery.time){
            searchParams.time = formattedTime
        }
        try {
            const response = await findAvailableVeterinarians(searchParams)
            onSearchResult(response.data)
            setShowErrorAlert(false)
        } catch (error) {
            setErrorMessage(error.response.data.message)       
            setShowErrorAlert(true)     
        }
    };

    const handleClearSearch = () => {
        setSearchQuery({date: null, time: null, specialization: ""});
        setShowDateTime(false);
        fetchAllVeterinarians();
    };

    const refreshSpecializations = () => {
        fetchSpecializations();
    };

  return (
    <section className='stickyFormContainer'>
        <h3>Find a Veterinarian</h3>
        <Form onSubmit={handleSearch}>
            <Form.Group>
                <Form.Label><b>Specialization</b></Form.Label>
                <Form.Control as="select" name="specialization" value={searchQuery.specialization} onChange={handleInputChange}>
                    <option value="">Select Specialization</option>
                    {specializations && Array.isArray(specializations) && specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <fieldset>
                <Row className='mb-3'>
                    <Col>
                        <Form.Group className='mb-3 mt-3'>
                            <Form.Check 
                                type='checkbox'
                                label='Include Date and Time Availability'
                                checked={showDateTime}
                                onChange={handleDateTimeToggle}
                            />
                        </Form.Group>
                        {showDateTime && (
                            <React.Fragment>
                                <legend><h5>Date and Time</h5></legend>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='searchText'>Date</Form.Label>
                                    <DatePicker
                                        selected={searchQuery.date}
                                        onChange={handleDateChange}
                                        dateFormat='yyyy-MM-dd'
                                        minDate={new Date()}
                                        className='from-control'
                                        placeholderText='Select Date'
                                    />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='searchText'>Time</Form.Label>
                                    <DatePicker
                                        selected={searchQuery.time}
                                        onChange={handleTimeChange}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        dateFormat='HH:mm'
                                        className='form-control'
                                        placeholderText='Select Time'
                                        required
                                    />
                                </Form.Group>
                            </React.Fragment>
                        )}
                    </Col>
                </Row>
            </fieldset>
            <div className='d-flex justify-content-center mb-4'>
                <Button type='submit' variant='outline-primary'>Search</Button>
                <div className='mx-2'>
                    <Button type='button' variant='outline-info' onClick={handleClearSearch}>
                        Clear Search
                    </Button>
                </div>
            </div>
        </Form>
        <div>
            {showErrorAlert && (
                <AlertMessage type={"danger"} message={errorMessage}/>
            )}
        </div>      
    </section>
  );
}

export default VeterinarianSearch;