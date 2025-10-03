import React, { useEffect, useState } from 'react';
import UseMessageAlerts from '../hooks/UseMessageAlerts';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { Button, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import AlertMessage from '../common/AlertMessage';
import {Link, useParams} from 'react-router-dom';
import { BsCheckLg, BsEyeFill, BsLockFill, BsPencilFill, BsPlusSquareFill, BsTrashFill, BsUnlockFill, BsXLg } from 'react-icons/bs';
import { deleteUserAccount, lockUserAccount, unLockUserAccount, updateUser } from "../user/UserService";
import { getVeterinarians, editSpecialization} from "../veterinarian/VeterinarianService";
import Paginator from '../common/Paginator';
import UserFilter from '../user/UserFilter';
import AddSpecializationModal from '../modals/AddSpecializationModal';

const VeterinarianComponent = () => {
    const[veterinarians, setVeterinarians] = useState([]);
    const[showDeleteModal, setShowDeleteModal] = useState(false);
    const[vetToDelete, setVetToDelete] = useState(null);
    const[filteredVets, setFilteredVets] = useState([]);
    const[selectedSpecialization, setSelectedSpecialization] = useState("");
    const[editVetId, setEditVetId] = useState(null);
    const[specializations, setSpecializations] = useState([]);
    const[editedVet, setEditedVet] = useState({});
    const[isUpdating, setIsUpdating] = useState(false);
    const[currentPage, setCurrentPage] = useState(1);
    const[vetsPerPage, setVetsPerPage] = useState(10);
    const[showAddSpecializationModal, setShowAddSpecializationModal] = useState(false);
    const[vetIdToAddSpecialization, setVetIdToAddSpecialization] = useState(null);

    //const {userId} = useParams();

    const indexOfLastVet = currentPage * vetsPerPage;
    const indexOfFirstVet = indexOfLastVet - vetsPerPage;
    const currentVets = filteredVets.slice(indexOfFirstVet, indexOfLastVet);

    const{successMessage, setSuccessMessage, errorMessage, setErrorMessage, showSuccessAlert, setShowSuccessAlert, showErrorAlert, setShowErrorAlert} = UseMessageAlerts();

    const fetchVeterinarians = () =>{
        getVeterinarians()
            .then((data) => {
                setVeterinarians(data.data);
                const uniqueSpecializations = [...new Set(data.data.map(vet => vet.specialization))];
                setSpecializations(uniqueSpecializations);
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setShowErrorAlert(true);
        });
    };

    useEffect(() => {
        fetchVeterinarians();
    }, []);

    const handleDeleteAccount = async () => {
        if(vetToDelete){
            try {
                const response = await deleteUserAccount(vetToDelete);
                setSuccessMessage(response.message);
                setShowDeleteModal(false);
                setShowSuccessAlert(true);
                fetchVeterinarians();
            } catch (error) {
                setErrorMessage(error.message);
                setShowErrorAlert(true);
            }
        }
    };
    
    const handleShowDeleteModal = (vetId) => {
        setVetToDelete(vetId);
        setShowDeleteModal(true);
    };

    const handleToggleAccountLock = async (vet) => {
        try {
            let response;
            if(vet.enabled){
                response = await lockUserAccount(vet.id);
            }else{
                response = await unLockUserAccount(vet.id);
            }
            setVeterinarians(veterinarians.map((theVet) => theVet.id === vet.id ? {...theVet, enabled: !theVet.enabled} : theVet));
            setSuccessMessage(response.message);
            setShowErrorAlert(false);
            setShowSuccessAlert(true);
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setShowSuccessAlert(false);
            setShowErrorAlert(true);
        }
    };

    useEffect(() => {
        let filtered = veterinarians;
        if(selectedSpecialization){
            filtered = filtered.filter((vet) => vet.specialization === selectedSpecialization);
        }
        setFilteredVets(filtered);
    }, [selectedSpecialization, veterinarians]);

    const handleClearFilters = () => {
        setSelectedSpecialization("");
    }

    // Start editing a veterinarian
    const handleStartEdit = (vet) => {
        setEditVetId(vet.id);
        setEditedVet({
            firstName: vet.firstName,
            lastName: vet.lastName,
            email: vet.email,
            phoneNumber: vet.phoneNumber,
            gender: vet.gender,
            specialization: vet.specialization
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditVetId(null);
        setEditedVet({});
    };

    // Handle input changes during editing
    const handleInputChange = (field, value) => {
        setEditedVet(prev => ({
            ...prev,
            [field]: value
        }));
    };

        // Save the edited veterinarian
    const handleSaveUpdate = async (vetId) => {
        setIsUpdating(true);
        try {
            const response = await updateUser(editedVet, vetId);
            setVeterinarians((previousVets) => 
                previousVets.map((vet) =>
                    vet.id === vetId ? {...vet, ...editedVet} : vet
                )
            );
            setEditVetId(null);
            setEditedVet({});
            setSuccessMessage(response.message);
            setShowSuccessAlert(true);
            setShowErrorAlert(false);
        } catch (error) {
            setErrorMessage(error.message || error.response?.data?.message || 'Failed to update veterinarian');
            setShowErrorAlert(true);
            setShowSuccessAlert(false);
        } finally {
            setIsUpdating(false);
        }
    };

    // Render editable cell
    const renderEditableCell = (vet, field, type = "text") => {
        if (editVetId === vet.id) {
            if (field === 'gender') {
                return (
                    <Form.Select
                        value={editedVet.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        size="sm"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                );
            } else if (field === 'specialization') {
                return (
                    <Form.Control
                        as="select"
                        value={editedVet.specialization || ''}
                        onChange={(e) =>{
                            const selectedValue = e.target.value;
                            if(selectedValue === "addNewSpecialization"){
                                setVetIdToAddSpecialization(vet.id);
                                setShowAddSpecializationModal(true);
                            }else{
                                handleInputChange('specialization', selectedValue)
                            }
                        }}
                        size="sm"
                    >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec, idx) => (
                            <option key={idx} value={spec}>{spec}</option>
                        ))}
                        <option value={"addNewSpecialization"}>Add New</option>
                    </Form.Control>
                );
            } else {
                return (
                    <Form.Control
                        type={type}
                        value={editedVet[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        size="sm"
                    />
                );
            }
        }
        
        // Display mode
        if (field === 'firstName') {
            return `Dr. ${vet.firstName}`;
        }
        return vet[field];
    };

    const handleAddSpecialization = async (editVetId, newSpecialization) => {
        try {
            await editSpecialization(editVetId, newSpecialization);
            const updatedVets = veterinarians.map(vet => vet.id === editVetId ? {...vet, specialization: newSpecialization} : vet);
            setVeterinarians(updatedVets);
            setSpecializations([...new Set(updatedVets.map(vet => vet.specialization))]);
            setSuccessMessage('New specialization added successfully');
            setShowSuccessAlert(true);
            setEditedVet(previous => ({...previous, specialization: newSpecialization }));
        } catch (error) {
            setErrorMessage(error.message || 'Failed o add specialization');
            setShowErrorAlert(true);
        }finally{
            setShowAddSpecializationModal(false);
        }
    };

    return (
    <main>
        <DeleteConfirmationModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            itemToDelete='veterinarian'
        />
        <AddSpecializationModal
            show={showAddSpecializationModal}
            onHide={() => {
                setShowAddSpecializationModal(false);
                setVetIdToAddSpecialization(null);
            }}
            onConfirm={handleAddSpecialization}
            vetId={vetIdToAddSpecialization}
            existingSpecializations={specializations}
        />
        <h3>List of Veterinarians</h3>
        <Row>
            <Col>
                {showErrorAlert && (<AlertMessage type='danger' message={errorMessage}/>)}
                {showSuccessAlert && (<AlertMessage type='success' message={successMessage}/>)}
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                {" "}
                <UserFilter
                values={specializations} 
                selectedValue={selectedSpecialization}
                onSelectValue={setSelectedSpecialization}
                onClearFilters={handleClearFilters}
                label={"specializations"}
            />
            </Col> 
        </Row>
        <Table bordered hover striped>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Gender</th>
                    <th>Specialization</th>
                    <th>Registered on</th>
                    <th colSpan={4}>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentVets.map((vet, index) =>(
                    <tr key={vet.id} className={editVetId === vet.id ? 'table-warning' : ''}>
                        <td>{renderEditableCell(vet, 'firstName')}</td>
                        <td>{renderEditableCell(vet, 'lastName')}</td>
                        <td>{renderEditableCell(vet, 'email', 'email')}</td>
                        <td>{renderEditableCell(vet, 'phoneNumber', 'tel')}</td>
                        <td>{renderEditableCell(vet, 'gender')}</td>
                        <td>{renderEditableCell(vet, 'specialization')}</td>
                        <td>{vet.createdAt}</td>
                        <td>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip-view-${index}`}>View Vet Information</Tooltip>
                                }>
                                <Link to={`/user-dashboard/${vet.id}/my-dashboard`} className='text-info'>
                                    <BsEyeFill/>
                                </Link>
                            </OverlayTrigger>
                        </td>
                        <td>
                            {editVetId === vet.id ? (
                                <div className='d-flex gap-1'>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id={`tooltip-save-${index}`}>Save Changes</Tooltip>
                                        }>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleSaveUpdate(vet.id)}
                                            disabled={isUpdating}
                                        >
                                            <BsCheckLg/>
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id={`tooltip-cancel-${index}`}>Cancel Edit</Tooltip>
                                        }>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            disabled={isUpdating}
                                        >
                                            <BsXLg/>
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            ) : (
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip id={`tooltip-edit-${index}`}>Edit Vet Information</Tooltip>
                                    }>
                                    <span 
                                        onClick={() => handleStartEdit(vet)}
                                        style={{cursor: "pointer"}}
                                        className='text-warning'
                                    >
                                        <BsPencilFill/>
                                    </span>
                                </OverlayTrigger>
                            )}
                        </td>
                        <td>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip-lock-${index}`}>
                                        {vet.enabled ? "Lock" : "Unlock"} Vet Account
                                    </Tooltip>
                                }>
                                <span 
                                    onClick={() => handleToggleAccountLock(vet)}
                                    style={{cursor: "pointer"}}>
                                    {vet.enabled ? <BsUnlockFill/> : <BsLockFill/>}
                                </span>
                            </OverlayTrigger>
                        </td>
                        <td>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id={`tooltip-delete-${index}`}>Delete Vet Account</Tooltip>
                                }>
                                <Link to={"#"} className='text-danger' onClick={() => handleShowDeleteModal(vet.id)}>
                                    <BsTrashFill/>
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
            itemsPerPage={vetsPerPage}
            totalItems={filteredVets.length}
        />
    </main>
  )
}

export default VeterinarianComponent