import React, { useState } from 'react'

const BookAppointment = () => {
    const[formData, setFormData] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        pets: [
            {
                petName: "",
                petType: "",
                petColor: "",
                petBreed: "",
                petAge: "",
            },

        ],
    });

    const handleDateChange = (date) => {
        setFormData((previousState) => ({
            ...previousState, appointmentDate: date,
        }));
    };

    const handleTimeChange = (time) => {
        setFormData((previousState) => ({
            ...previousState, appointmentTime: time,
        }));
    };

    const handleInputChange = (e) => {
        const{name, value} = e.target;
        setFormData((previousState) => ({
            ...previousState, [name]: value,
        }));
    };

    const handlePetChange = (index, e) => {
        const{name, value} = e.target;
        setFormData((previousState) => ({
            ...previousState, pets: previousState.pets.map((pet, idx) => idx === index? {...pet, [name]: value}: pet),
        }));
    };

    const addPet = () => {
        const newPet = {
            petName: "",
            petType: "",
            petColor: "",
            petBreed: "",
            petAge: "",
        }
        setFormData((previousState) => ({
            ...previousState, pets: [...previousState.pets, newPet],
        }));
    };

    const removePet = (index, e) => {
        const filteredPets = formData.pets.filter((_, idx) => idx !== index);
        setFormData((previousState) => ({
            ...previousState, pets: filteredPets,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pets = formData.pets.map((pet) =>({
            name: pet.petName,
            type: pet.petType,
            color: pet.petColor,
            breed: pet.petBreed,
            age: pet.petAge, 
        }));
    };

    const request = {
        appointment: {
            date: formData.appointmentDate,
            time: formData.appointmentTime,
            reason: formData.reason,
        },
        pets: pets,
    }

  return (
    <div>
      
    </div>
  )
}

export default BookAppointment
