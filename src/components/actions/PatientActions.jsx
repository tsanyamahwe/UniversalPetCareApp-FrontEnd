import React, { useState } from 'react';
import ActionButtons from './ActionButtons';
import AppointmentUpdateModal from '../modals/AppointmentUpdateModal';

const PatientActions = ({onCancel, onUpdate, isDisabled, appointment}) => {
    const[isProcessing, setIsProcessing] = useState(false);
    const[showUpdateModal, setShowUpdateModal] = useState(false);
     const[processingAction, setProcessingAction] = useState(null);

    const handleActionClick = (actionType) => {
        setIsProcessing(true);
        setProcessingAction(actionType);
        try {
            if(actionType === "Update"){
                setShowUpdateModal(true);
                setIsProcessing(false);
                setProcessingAction(null);
            }else{
                onCancel(appointment.id)
                setProcessingAction(null);
            }            
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            setProcessingAction(null);
        }
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setIsProcessing(false);
    };

    const handleUpdateAppointment = async (updatedAppointment) => {
        setIsProcessing(true);
        try {
            await onUpdate(updatedAppointment);
            handleCloseModal();
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    }

  return (
    <React.Fragment>
        <section className='d-flex justify-content-end gap-2 mt-2 mb-2'>
            <ActionButtons
                title={
                    isProcessing && processingAction === "Update" ? (
                        <ProcessSpinner message="Updating appointment.."/>
                    ):(
                        "Update Appointment"
                    )
                }
                variant={"warning"}
                onClick={() => handleActionClick("Update")}
                disabled={isDisabled}
                isProcessing={isProcessing}
            />
            <ActionButtons
               title={
                    isProcessing && processingAction === "Cancel" ? (
                        <ProcessSpinner message="Cancelling appointment.."/>
                    ):(
                        "Cancel Appointment"
                    )
                }
                variant={"danger"}
                onClick={() => onCancel(appointment.id)}
                disabled={isDisabled}
                isProcessing={isProcessing}
            />
        </section>
        {showUpdateModal && (
            <AppointmentUpdateModal
                show={showUpdateModal}
                appointment={appointment}
                handleClose={handleCloseModal}
                handleUpdate={handleUpdateAppointment}
            />
        )}
    </React.Fragment>
  );
};

export default PatientActions;
