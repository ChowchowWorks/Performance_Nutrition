import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import './appointments.css';

const appointmentInstructions = [
  "Welcome to the appointment booking page!",
  "Select a Date on the calendar.",
  "If there are no available slots, please choose another date.",
  "Thank you! See you soon for your consultation.",
];

function AppointmentInstructions() {
  return (
    <div className="AppointmentInstructions">
      {appointmentInstructions.map((text, idx) => (
        <p key={idx}>{text}</p>
      ))}
    </div>
  );
}

// Display available timeslots
const RetrieveTimeSlots = ({ selectedDate, selectedTime, setSelectedTime }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!selectedDate) return;

    fetch(`/api/slots?date=${selectedDate.toISOString()}`) // edit this line to put in the retrieval service
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, [selectedDate]);

  return (
    <div className="TimeSlot">
      <div className="sectionHeading">
        <h3>Available Timeslots</h3>
        <p>Choose a date to load open booking windows.</p>
      </div>
      {!selectedDate ? (
        <p className="emptyState">Select a date on the calendar to view times.</p>
      ) : slots.length === 0 ? (
        <p className="emptyState">No available slots for this day.</p>
      ) : (
        <div className="timeslotGrid">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={selectedTime === slot ? "timeslotButton active" : "timeslotButton"}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// Main Appointment Component
const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });

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

  return (
    <div className="AppointmentContainer">
      <div className="headerRow">
        <h1 className="pageName">Book Appointment</h1>
        <h3>📆 {currentDate}</h3>
      </div>
      <AppointmentInstructions/> 
      <div className="AppointmentsPage">  
        <div className="bookingGrid">
          <div className="slotSelector">
            <div className="Calendar">
              <div className="sectionHeading">
                <h3>Select a Date</h3>
                <p>Pick an available day to see live openings.</p>
              </div>
              <Calendar
                className="customCalendar"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                inline
              />
              <p className="selectedDate">
                Selected Date: {selectedDate ? selectedDate.toDateString() : "No Date Selected Yet"}
              </p>
            </div>

            <RetrieveTimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>
          <div className="desiredAppointment">
            <h3>Select Appointment Type</h3>
            <p>Confirm the service you want to book.</p>
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
        </div>
        <button className="submitAppointment" onClick={handleAppointmentSubmit}>
          Submit Booking
        </button>
      </div>
    </div>
          
  );
};

export default Appointment;
