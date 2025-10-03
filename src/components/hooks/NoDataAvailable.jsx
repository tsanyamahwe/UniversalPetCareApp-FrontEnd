import React from 'react'

const NoDataAvailable = ({dataType, message}) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
      {message ? (
        <p>Error: {message}</p>
      ) : (
        <p><h6>No {dataType} is available at the moment.</h6></p>
      )}
    </div>
  );
};

export default NoDataAvailable;
