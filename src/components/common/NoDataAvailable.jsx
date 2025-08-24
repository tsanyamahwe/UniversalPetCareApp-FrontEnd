import React from 'react'

const NoDataAvailable = ({dataType, errorMessage}) => {
  return (
    <div className='text-center mt-5'>
        <p><h5>No {dataType} available at the moment.</h5></p>
        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
    </div>
  );
};

export default NoDataAvailable;
