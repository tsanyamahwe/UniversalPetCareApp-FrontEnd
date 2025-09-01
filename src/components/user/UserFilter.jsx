import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap'

const UserFilter = ({label, values = [], selectedValue, onSelectValue, onClearFilters}) => {
  return (
    <InputGroup className='mb-2'> 
        <InputGroup.Text>Filter by {label}</InputGroup.Text>
        <Form.Select
            className='form-control'
            value={selectedValue}
            onChange={(e) => onSelectValue(e.target.value)}>
            <option value=''>Select {label.toLowerCase()}</option>
            {values.map((value, index) => (
                <option key={index} value={value}>
                    {value}
                </option>
            ))}
        </Form.Select>
        <Button variant='secondary' onClick={onClearFilters}>
            Clear Filter
        </Button>
    </InputGroup>
  );
};

export default UserFilter;
