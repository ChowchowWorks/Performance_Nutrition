import React, { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import './appointments.css';


const ClientRequirements = () => {
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    fetch("https://your-cloudflare-worker-api.com/client-requirements")
      .then((res) => res.json())
      .then((data) => setRequirements(data))
      .catch(console.error);
  }, []);

  return (
    <div className="ClientNeeds">
      <h3 className="needsHeader">Your Requirements</h3>
      <ul className="needs">
        {requirements.map((req, idx) => (
          <li key={idx}>{req.type} — {req.dueDate}</li>
        ))}
      </ul>
    </div>
  );
};

// Display available timeslots
const RetrieveTimeSlots = ({ selectedDate, setSelectedTime }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;

    fetch(`/api/slots?date=${selectedDate.toISOString()}`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, [selectedDate]);

  return (
    <div className="TimeSlot">
      <h3>Available Timeslots</h3>
      {!selectedDate ? (
        <p>No date selected yet.</p>
      ) : slots.length === 0 ? (
        <p>No available slots.</p>
      ) : (
        slots.map((slot) => (
          <button key={slot} onClick={() => setSelectedTime(slot)}>
            {slot}
          </button>
        ))
      )}
    </div>
  );
};


// Main Appointment Component
const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState('');

  const handleAppointmentSubmit = () => {
    // Make sure all fields are selected
    if (!selectedDate || !selectedTime || !selectedAppointment) {
      alert("Please select a date, time, and appointment type.");
      return;
    }

    // Ask for user confirmation
    const confirmed = window.confirm(
      `Confirm your appointment:\n\nDate: ${selectedDate.toDateString()}\nTime: ${selectedTime}\nType: ${selectedAppointment}`
    );

    if (!confirmed) return; // If user cancels, do nothing

    // If confirmed, send data to Cloudflare Worker
    const appointmentData = {
      date: selectedDate,
      time: selectedTime,
      type: selectedAppointment,
    };

    fetch("https://your-cloudflare-worker-api.com/save-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Appointment saved:", data);
        alert("Your appointment has been booked successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("There was an error booking your appointment. Please try again.");
      });
  };

  
  const appointmentTypes = [
    'Height and Weight Measurement',
    'Lifestyle Consultation',
    'Fitness Goals Consultations'
  ];

  const instructions = [
  "Welcome to the appointment booking page!",
  "You will see your required appointments listed under 'Your Requirements'.",
  "Select a Date on the calendar.",
  "If there are no available slots, please choose another date.",
  "Thank you! See you soon for your consultation."
];

const AppointmentInstructions = () => (
  <div className="AppointmentInstructions">
    <h2 className="InstructHeader">Book Appointment</h2>
    {instructions.map((text, idx) => (
      <p key={idx}>{text}</p>
    ))}
  </div>
);


  return (
    <div className="AppointmentContainer">
      <AppointmentInstructions/> 
      <div className="AppointmentsPage">  
        <div className="ClientRequirements">
            <ClientRequirements />
        </div>
        <div className="slotSelector">
            <div className="Calendar">
                <h3>Select a Date</h3>
                <Calendar
                className="customCalendar"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                inline
                />
                <p> Selected Date: {selectedDate ? selectedDate.toDateString() : "No Date Selected Yet"}</p>
            </div>

            {/* Add a divider line here*/}

            <RetrieveTimeSlots selectedDate={selectedDate} setSelectedTime={setSelectedTime}/>
        </div>
        <div className="desiredAppointment">
            <h3>Select Appointment Type</h3>
                <select
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                >
                  <option value="" disabled>Select an appointment</option>
                  {appointmentTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
        </div>              
        <button className="submitAppointment" onClick={handleAppointmentSubmit}>
          Submit
        </button>
      </div>
    </div>
          
  );
};

export default Appointment;
