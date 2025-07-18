import React, { useState } from 'react';
import ActionButtons from './ActionButtons';

const VeterinarianActions = ({onApprove, onDecline, isDisabled}) => {
 const[isProcessing, setIsProcessing] = useState(false);

    const handleActionClick = (actionType) => {
        setIsProcessing(true);
        if(actionType === "Approve"){
            onApprove()
            .then(() => {
                setIsProcessing(false);
            })
            .catch(() => {
                setIsProcessing(false);
            });
        }else{
            onDecline()
            .then(() => {
                setIsProcessing(false);
            })
            .catch(() => {
                setIsProcessing(false);
            });
        }
    };

  return (
    <section className='d-flex justify-content-end gap-2 mt-2 mb-2'>
        <ActionButtons
            title={"Approve Appointment"}
            variant={"success"}
            onClick={() => handleActionClick("Approve")}
            disabled={isDisabled}
            isProcessing={isProcessing}
        />
         <ActionButtons
            title={"Decline Appoinment"}
            variant={"secondary"}
            onClick={() => handleActionClick("Decline")}
            disabled={isDisabled}
            isProcessing={isProcessing}
        />
    </section>
  );
};

export default VeterinarianActions;
